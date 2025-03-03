package it.epicode.hair_salon.auth;

import io.jsonwebtoken.ExpiredJwtException;
import it.epicode.hair_salon.auth.dto.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthUserSvc authUserSvc;

    @PostMapping("/register")
    @PreAuthorize("isAnonymous()")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest registerRequest) {
        String message = authUserSvc.registerUser(registerRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @PreAuthorize("isAnonymous()")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        return new ResponseEntity<>(authUserSvc.Login(loginRequest), HttpStatus.OK);
    }

    @PostMapping("/requestForgotPassword")
    public ResponseEntity<Map<String, String>> requestForgotPassword(@RequestBody EmailForPasswordResetRequest passwordResetRequest) {
        String message = authUserSvc.sendEmailForChangePassword(passwordResetRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/reset-password")
    public void resetPasswordRedirect(@RequestParam String token, HttpServletResponse response)  {
        try {
            authUserSvc.verifyTokenPasswordReset(token, response);
        } catch (ServletException | IOException e) {

            throw new SecurityException(e.getMessage());
        }
    }

    @PatchMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody PasswordResetRequest passwordResetRequest) {
       try{
        String message = authUserSvc.resetPassword(passwordResetRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.OK);

       } catch (ExpiredJwtException e){
           throw new SecurityException("Token scaduto, rifai la richiesta di reset!");
       }
    }

    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthUpdateResponse> updateByCustomerWithAppUser(@RequestBody AuthUserResponse authUserResponse, @AuthenticationPrincipal User userDetails) {

        AuthUpdateResponse response = authUserSvc.updateUser(authUserResponse, userDetails);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthUserResponse> getAuthUser(@AuthenticationPrincipal User userDetails) {
        AuthUserResponse response = authUserSvc.getByUserLogged(userDetails);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest, @AuthenticationPrincipal User userDetails) {
        String message = authUserSvc.changePassword(changePasswordRequest, userDetails);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/restoreUser/{token}")
    public ResponseEntity<AuthResponse> restoreUser(@PathVariable String token) {
        return new ResponseEntity<>(authUserSvc.restoreUser(token), HttpStatus.OK);
    }
}
