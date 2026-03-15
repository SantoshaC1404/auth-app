package com.substring.auth_app_backend.controllers;

import com.substring.auth_app_backend.dtos.ForgotPasswordRequest;
import com.substring.auth_app_backend.dtos.ResetPasswordRequest;
import com.substring.auth_app_backend.dtos.VerifyOtpRequest;
import com.substring.auth_app_backend.dtos.VerifyOtpResponse;
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
     * Step 1 — POST /api/v1/auth/forgot-password
     * Sends a 6-digit OTP to the email. Always returns 200.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        passwordResetService.sendOtp(request.email());
        return ResponseEntity.ok(Map.of(
                "message", "If that email is registered, an OTP has been sent."
        ));
    }

    /**
     * Step 2 — POST /api/v1/auth/verify-otp
     * Verifies the OTP and returns a short-lived resetToken.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        VerifyOtpResponse response = passwordResetService.verifyOtp(request.email(), request.otp());
        return ResponseEntity.ok(response);
    }

    /**
     * Step 3 — POST /api/v1/auth/reset-password
     * Uses the resetToken to set a new password.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.resetToken(), request.newPassword());
        return ResponseEntity.ok(Map.of("message", "Password reset successfully. Please log in."));
    }
}