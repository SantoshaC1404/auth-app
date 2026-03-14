package com.substring.auth_app_backend.controllers;

import com.substring.auth_app_backend.dtos.ForgotPasswordRequest;
import com.substring.auth_app_backend.services.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    /**
     * POST /api/v1/auth/forgot-password
     * Always returns 200 to prevent user enumeration.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        passwordResetService.initiatePasswordReset(request.email());
        return ResponseEntity.ok(Map.of(
                "message", "If that email is registered, instructions have been sent."
        ));
    }
}