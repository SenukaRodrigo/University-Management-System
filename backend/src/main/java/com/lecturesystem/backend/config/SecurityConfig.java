package com.lecturesystem.backend.config;

import com.lecturesystem.backend.security.JwtAuthenticationFilter;
import com.lecturesystem.backend.security.JwtService;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                // Let the servlet container's ERROR dispatch reach /error freely.
                // Without this, any unhandled exception on a public endpoint would
                // be intercepted by the AuthenticationEntryPoint and return 401,
                // masking the real error status.
                .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()

                // Login/signup endpoints must be reachable without a token.
                .requestMatchers("/api/auth/**").permitAll()

                // Enrollment requests nested under lectures. These MUST come
                // before the general /api/lectures/** rules: matchers are
                // evaluated top-down and the first match wins, so if the
                // broad POST /api/lectures/** -> LECTURER rule ran first, a
                // student's POST /api/lectures/5/requests would be rejected
                // before this rule was ever consulted. ("*" matches exactly
                // one path segment — the lecture id.)
                .requestMatchers(HttpMethod.POST, "/api/lectures/*/requests").hasRole("STUDENT")
                .requestMatchers(HttpMethod.GET,  "/api/lectures/*/requests").hasRole("LECTURER")

                // Lectures: rules are evaluated top-down, first match wins.
                // Writes are lecturer-only; reads need any valid token.
                // hasRole("LECTURER") matches the "ROLE_LECTURER" authority
                // that the JWT filter put in the SecurityContext.
                .requestMatchers(HttpMethod.POST,   "/api/lectures/**").hasRole("LECTURER")
                .requestMatchers(HttpMethod.PUT,    "/api/lectures/**").hasRole("LECTURER")
                .requestMatchers(HttpMethod.DELETE, "/api/lectures/**").hasRole("LECTURER")
                .requestMatchers(HttpMethod.GET,    "/api/lectures/**").authenticated()

                // Top-level request routes. Reads are open to both roles
                // (students check /mine, lecturers check /incoming); only a
                // lecturer can decide (PUT). WHICH lecturer is the service's
                // ownership check, not a concern of these role rules.
                .requestMatchers(HttpMethod.GET, "/api/requests/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/requests/**").hasRole("LECTURER")

                // Everything else requires a valid, authenticated request.
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
