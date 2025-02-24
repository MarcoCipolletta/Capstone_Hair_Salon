package it.epicode.hair_salon.auth;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import it.epicode.hair_salon.auth.dto.*;
import it.epicode.hair_salon.auth.jwt.JwtTokenUtil;
import it.epicode.hair_salon.entities.customer.CustomerSvc;
import it.epicode.hair_salon.entities.customer.dto.CustomerCreateRequest;
import it.epicode.hair_salon.entities.customer.dto.CustomerMapper;
import it.epicode.hair_salon.exceptions.AlreadyExistsException;
import it.epicode.hair_salon.exceptions.EmailAlreadyUsedException;
import it.epicode.hair_salon.exceptions.EmailSendErrorException;
import it.epicode.hair_salon.utils.Utils;
import it.epicode.hair_salon.utils.email.EmailMapper;
import it.epicode.hair_salon.utils.email.EmailSvc;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Validated
public class AuthUserSvc {
    private final AuthUserRepo authUserRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final CustomerSvc customerSvc;
    private final EmailSvc emailSvc;
    private final EmailMapper emailMapper;
    private final AuthMapper authMapper;
    private final CustomerMapper customerMapper;

    @Value("${server.address}")
    private String address;

    public boolean existByUsername(String username) {
        return authUserRepo.existsByUsername(username);
    }

    public AuthUser getByUsername(String username) {
        if (existByUsername(username)) {
            return authUserRepo.findByUsername(username).get();
        } else {
            throw new EntityNotFoundException("User non trovato");
        }
    }

    public boolean existByEmail(String email) {
        return authUserRepo.existsByEmail(email.toLowerCase());
    }

    @Transactional
    public String registerUser(@Valid RegisterRequest registerRequest) {
        if (authUserRepo.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyUsedException("Email già usata");
        }
        if (authUserRepo.existsByUsername(registerRequest.getUsername())) {
            throw new AlreadyExistsException("Username già usato");
        }
        if (authUserRepo.existsByCustomerPhoneNumber(registerRequest.getCustomer().getPhoneNumber())) {
            throw new AlreadyExistsException("Numero di telefono già usato");
        }

        AuthUser authUser = new AuthUser();
        BeanUtils.copyProperties(registerRequest, authUser);
        authUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        boolean hasImage = registerRequest.getAvatar() != null && !registerRequest.getAvatar().isEmpty();
        if (hasImage) {
            authUser.setAvatar(registerRequest.getAvatar());
        } else {
            authUser.setAvatar(Utils.getAvatar(registerRequest));
        }
        if (registerRequest.getCustomer() != null) {
            authUser.setCustomer(customerSvc.create(registerRequest.getCustomer(), authUser));
            authUser.setRole(Role.USER);
        } else {
            authUser.setRole(Role.ADMIN);
        }

        authUserRepo.save(authUser);

        //      emailSvc.sendEmailHtml(emailMapper.fromAuthUserToEmailRequest(authUser));

        return "Registrazione avvenuta con successo";
    }

    public void registerAdmin(@Valid RegisterRequest registerRequest) {
        if (authUserRepo.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyUsedException("Email already used");
        }
        if (authUserRepo.existsByUsername(registerRequest.getUsername())) {
            throw new AlreadyExistsException("Username already used");
        }
        AuthUser authUser = new AuthUser();
        BeanUtils.copyProperties(registerRequest, authUser);
        authUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        authUser.setRole(Role.ADMIN);
        boolean hasImage = registerRequest.getAvatar() != null && !registerRequest.getAvatar().isEmpty();
        if (hasImage) {
            authUser.setAvatar(registerRequest.getAvatar());
        } else {
            authUser.setAvatar(Utils.getAvatar(registerRequest));
        }
        authUserRepo.save(authUser);

    }

    @Transactional
    public UUID createCustomer(@Valid CustomerCreateRequestForAdmin customerCreateRequestForAdmin) {
        AuthUser authUser = new AuthUser();
        authUser.setUsername(customerCreateRequestForAdmin.getName() + "." + customerCreateRequestForAdmin.getSurname() + "." + customerCreateRequestForAdmin.getDateOfBirth().getDayOfMonth());
        authUser.setEmail(customerCreateRequestForAdmin.getEmail());
        authUser.setPassword(passwordEncoder.encode("string"));
        authUser.setRole(Role.USER);
        authUser.setAvatar(Utils.getAvatar(customerCreateRequestForAdmin.getName(), customerCreateRequestForAdmin.getSurname()));

        CustomerCreateRequest customerCreateRequest = new CustomerCreateRequest();
        customerCreateRequest.setName(customerCreateRequestForAdmin.getName());
        customerCreateRequest.setSurname(customerCreateRequestForAdmin.getSurname());
        customerCreateRequest.setDateOfBirth(customerCreateRequestForAdmin.getDateOfBirth());
        customerCreateRequest.setPhoneNumber(customerCreateRequestForAdmin.getPhoneNumber());

        authUser.setCustomer(customerSvc.create(customerCreateRequest, authUser));
        authUserRepo.save(authUser);
        return authUser.getCustomer().getId();
    }

    public AuthResponse Login(@Valid LoginRequest loginRequest) {
        {
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginRequest.getIdentifier(), loginRequest.getPassword())
                );

                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                AuthUser authUser = getByUsername(userDetails.getUsername());

                return new AuthResponse(jwtTokenUtil.generateToken(userDetails), authMapper.toAuthUserResponse(authUser));
            } catch (AuthenticationException e) {
                throw new SecurityException("Credenziali non valide", e);
            }
        }

    }


    public String sendEmailForChangePassword(@Valid EmailForPasswordResetRequest request) {
        AuthUser authUser = authUserRepo.findByEmail(request.getEmail()).orElseThrow(() -> new EntityNotFoundException("Email non trovata"));
        String token = jwtTokenUtil.generateTokenResetPassword(authUser);

        String resetUrl = "http://"+address+":8080/auth/reset-password?token=" + token;

        emailSvc.sendEmailHtml(emailMapper.fromResetPasswordBodyToEmailRequest(resetUrl, authUser));

        return "Email inviata con successo";
    }

    private String generateTemplateErrorResetPassword(String errorMessage) {
        try (InputStream is = getClass().getResourceAsStream("/templates/errorPage.html")) {
            if (is == null) {
                throw new RuntimeException("Impossibile trovare errorPage.html nel classpath!");
            }
            String template = new String(is.readAllBytes(), StandardCharsets.UTF_8);

            Map<String, String> values = new HashMap<>();
            values.put("errorMessage", errorMessage);
            values.put("website", "http://"+address+":4200/auth/forgot-password");

            for (Map.Entry<String, String> entry : values.entrySet()) {
                template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());
            }
            return template;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }



    public void verifyTokenPasswordReset(String token, HttpServletResponse response) throws ServletException, IOException {
        try {
            jwtTokenUtil.isValidToken(token);
            jwtTokenUtil.isTokenExpired(token);
                response.sendRedirect("http://"+address+":4200/auth/reset-password/" + token);

        }
        catch (IOException e) {
            throw new EmailSendErrorException("Redirect fallito: " + e.getMessage());
        }
        catch (ExpiredJwtException e) {
            String processedHtml = generateTemplateErrorResetPassword("Token scaduto, rifai la richiesta di reset!");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().write(processedHtml);
            response.getWriter().flush();
            return;
        } catch (SignatureException | MalformedJwtException e) {
            String processedHtml = generateTemplateErrorResetPassword("Token non valido, rifai la richiesta di reset!");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().write(processedHtml);
            response.getWriter().flush();
            return;
        }

    }

    public String resetPassword(@Valid PasswordResetRequest resetPasswordRequest) {
        if (jwtTokenUtil.isTokenExpired(resetPasswordRequest.getToken())) {
            throw new SecurityException("Token non valido o scaduto");
        } else {
            String username = jwtTokenUtil.getUsernameFromToken(resetPasswordRequest.getToken());
            AuthUser authUser = authUserRepo.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("User non trovato"));
            authUser.setPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()));
            authUserRepo.save(authUser);
            emailSvc.sendEmailHtml(emailMapper.fromResetPasswordSuccessBodyToEmailRequest(authUser));
            return "Password cambiata con successo";
        }
    }

    public AuthUpdateResponse updateUser(AuthUserResponse authUserResponse, User userDetails) {
        AuthUser authUser = getByUsername(userDetails.getUsername());
        if (!authUserResponse.getId().equals(authUser.getId())) {
            throw new SecurityException("User non autorizzato");
        }
        if (!authUserResponse.getUsername().equals(authUser.getUsername())) {
            if (existByUsername(authUserResponse.getUsername())) {
                throw new AlreadyExistsException("Username già usato");
            }
        }
        if (!authUserResponse.getEmail().equals(authUser.getEmail())) {
            if (existByEmail(authUserResponse.getEmail())) {
                throw new AlreadyExistsException("Email già usata");
            }
        }

        BeanUtils.copyProperties(authUserResponse, authUser);
        if (authUser.getRole() == Role.ADMIN) {
            System.out.println(authUser.getRole());
            authUserRepo.save(authUser);
        } else {
            authUser.setCustomer(customerSvc.update(authUserResponse.getCustomer(), authUser));
            System.out.println(authUser.getRole());

            authUserRepo.save(authUser);

        }
        UserDetails newUserDetails = new User(authUser.getUsername(), userDetails.getPassword(), userDetails.getAuthorities());

        AuthUpdateResponse authUpdateResponse = new AuthUpdateResponse();
        authUpdateResponse.setAuthResponse(new AuthResponse(jwtTokenUtil.generateToken(newUserDetails), authMapper.toAuthUserResponse(authUser)));
        authUpdateResponse.setAuthUserResponse(authUserResponse);
        return authUpdateResponse;

    }

    public AuthUserResponse getByUserLogged(User userDetails) {
        AuthUser authUser = getByUsername(userDetails.getUsername());
        AuthUserResponse authUserResponse = authMapper.toAuthUserResponse(authUser);
        if (authUser.getRole() == Role.ADMIN) return authUserResponse;
        authUserResponse.setCustomer(customerMapper.toCustomerResponseForAuthResponse(authUser.getCustomer()));
        return authUserResponse;
    }


    public String changePassword(@Valid ChangePasswordRequest changePasswordRequest, User userDetails) {
        AuthUser authUser = getByUsername(userDetails.getUsername());
        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), authUser.getPassword())) {
            throw new SecurityException("Vecchia password non corretta");
        }
        if (passwordEncoder.matches(changePasswordRequest.getNewPassword(), authUser.getPassword())) {
            throw new SecurityException("La nuova password deve essere diversa da quella vecchia");
        }
        authUser.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        authUserRepo.save(authUser);
        return "Password cambiata con successo";
    }

    public AuthResponse restoreUser(String token) {
        if (!jwtTokenUtil.isValidToken(token)) {
            throw new SecurityException("Token non valido, rifai il login!");
        }
        if (jwtTokenUtil.isTokenExpired(token)) throw new SecurityException("Token scaduto");
        String username = jwtTokenUtil.getUsernameFromToken(token);
        AuthUser authUser = getByUsername(username);
        return new AuthResponse(token, authMapper.toAuthUserResponse(authUser));
    }

}
