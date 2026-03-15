package com.substring.auth_app_backend.services;

import com.substring.auth_app_backend.dtos.VerifyOtpResponse;

public interface PasswordResetService {

    /**
     * Step 1: Generate a 6-digit OTP and email it. Always silent.
     */
    void sendOtp(String email);

    /**
     * Step 2: Verify OTP → returns a short-lived resetToken.
     */
    VerifyOtpResponse verifyOtp(String email, String otp);

    /**
     * Step 3: Use resetToken to set a new password.
     */
    void resetPassword(String resetToken, String newPassword);
}