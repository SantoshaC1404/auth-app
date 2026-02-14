package com.substring.auth_app_backend.security;

import com.substring.auth_app_backend.helpers.UserHelper;
import com.substring.auth_app_backend.repositories.UserRepository;
import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        logger.info("Authentication header: {}", header);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                if (!jwtService.isAccessToken(token)) {
                    filterChain.doFilter(request, response);
                    return;
                }

                Jws<Claims> parse = jwtService.parse(token);
                Claims payload = parse.getPayload();
                String userId = payload.getSubject();
                UUID parsedUUID = UserHelper.parseUUID(userId);

                logger.info("Parsed UUID: {}", parsedUUID);

//                userRepository.findById(parsedUUID)
                userRepository.findByEmail(payload.get("email", String.class))
                        .ifPresent(user -> {

                            logger.info("User found: {}", user.getEmail());
                            logger.info("User enabled: {}",user.isEnabled());

                            if (user.isEnabled()) {
                                List<SimpleGrantedAuthority> authorities = user.getRoles() == null ? List.of() :
                                        user.getRoles()
                                                .stream()
                                                .map(role -> new SimpleGrantedAuthority(role.getName()))
                                                .toList();

                                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                        user.getEmail(),
                                        null,
                                        authorities
                                );
                                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                                }
                            }
                        });
            } catch (ExpiredJwtException exception) {
                request.setAttribute("Error:", "Token Expired.");
                // exception.printStackTrace();
            } catch (Exception exception) {
                request.setAttribute("Error:", "Invalid Token.");
                //exception.printStackTrace();
            }
        }
        filterChain.doFilter(request, response);

    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().startsWith("/api/v1/auth");
    }
}
