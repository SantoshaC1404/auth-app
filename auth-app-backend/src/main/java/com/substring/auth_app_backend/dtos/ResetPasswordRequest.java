package com.substring.auth_app_backend.dtos;

public record ResetPasswordRequest(String token, String newPassword) {
}


