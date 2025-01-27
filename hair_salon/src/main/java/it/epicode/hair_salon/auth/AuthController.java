package it.epicode.hair_salon.auth;

import it.epicode.hair_salon.auth.dto.*;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthUserSvc authUserSvc;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest registerRequest) {
        String message = authUserSvc.registerUser(registerRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        return new ResponseEntity<>(authUserSvc.Login(loginRequest), HttpStatus.OK);
    }

    @PostMapping("/requestChangePassword")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody EmailForPasswordResetRequest passwordResetRequest) {
        String message = authUserSvc.sendEmailForChangePassword(passwordResetRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/reset-password")
    public ResponseEntity<String> resetPasswordRedirect(@RequestParam String token, HttpServletResponse response) {

        return new ResponseEntity<>(authUserSvc.verifyTokenPasswordReset(token, response), HttpStatus.OK);
    }

    @PatchMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody PasswordResetRequest passwordResetRequest) {
        String message = authUserSvc.resetPassword(passwordResetRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/withAppUser")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthUserResponse> getByCustomerWithAppUser(@AuthenticationPrincipal User userDetails) {
        System.out.println(userDetails.getUsername());
        AuthUser authUser = authUserSvc.getByUsername(userDetails.getUsername());
        AuthUserResponse response = new AuthUserResponse();
        response.setId(authUser.getId());
        response.setEmail(authUser.getEmail());
        response.setAvatar(authUser.getAvatar());
        response.setUsername(authUser.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/withAppUser")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthUserResponse> updateByCustomerWithAppUser(@RequestBody AuthUserResponse appUserUpdateRequest, @AuthenticationPrincipal User userDetails) {

        AuthUserResponse response = authUserSvc.updateUser(appUserUpdateRequest, userDetails);
        System.out.println(response);
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
}
