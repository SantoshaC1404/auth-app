package com.substring.auth_app_backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Authentication API",
                version = "1.0",
                description = "API documentation for the Authentication Service",
                contact = @Contact(
                        name = "Santosh Team",
                        email = "santosha1404@gmail.com",
                        url = ""
                ),
                summary = "This API provides endpoints for user registration, login, and OAuth2 authentication."
        ),
        security = {
                @SecurityRequirement(
                        name = "bearerAuth"
                )
        }
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer", // Use "bearer" for JWT tokens
        bearerFormat = "JWT" // Optional, but can specify the format of the token
)
public class ApiDocConfig {
}
