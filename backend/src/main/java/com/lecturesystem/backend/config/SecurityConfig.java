package com.lecturesystem.backend.config;

import com.lecturesystem.backend.security.JwtAuthenticationFilter;
import com.lecturesystem.backend.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtService jwtService;

    // We inject JwtService here rather than JwtAuthenticationFilter directly,
    // because we declare the filter as a @Bean below — this keeps Spring Boot
    // from registering it at the servlet level separately (which would cause
    // the filter to run twice per request).
    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF protection is for browser-based sessions using cookies.
            // We're using stateless tokens, so it's safe (and correct) to disable.
            .csrf(csrf -> csrf.disable())

            // STATELESS: Spring Security will never create or consult an HttpSession.
            // Each request must carry its own proof of identity (the JWT).
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                // Login endpoint must be reachable without a token.
                // The ** wildcard covers /api/auth/login and any future
                // endpoints we add under /api/auth (e.g. /api/auth/refresh).
                .requestMatchers("/api/auth/**").permitAll()

                // Everything else requires a valid, authenticated request.
                // No role rules yet — those come in Phases 3 & 4.
                .anyRequest().authenticated()
            )

            // Custom entry point: return 401 instead of Spring Security's default
            // redirect-to-login-form (302) or access-denied (403).
            // 401 = "I don't know who you are". 403 = "I know, but you can't".
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) ->
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
            )

            // Insert our JWT filter before Spring's form-login filter.
            // By the time Spring Security checks the SecurityContext, our filter
            // has already populated it from the token (if the token was valid).
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
