package com.lecturesystem.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// Not annotated with @Component — SecurityConfig creates and owns this bean
// to prevent Spring Boot from also registering it at the servlet level (double run).
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // No header, or it doesn't look like a Bearer token.
        // Pass through — the security rules below will decide: if the endpoint
        // requires authentication the request will get a 401, otherwise it passes.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Strip the 7-character "Bearer " prefix to get the raw token.
        String token = authHeader.substring(7);

        // isTokenValid() returns false for expired, tampered, or malformed tokens
        // without throwing — it catches the jjwt exception internally.
        // If invalid, pass through unauthenticated; the security rules produce 401.
        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Token is valid — read its claims. No database call needed:
        // all the information we need is already encoded in the signed token.
        String email = jwtService.extractEmail(token);
        String role  = jwtService.extractRole(token);

        // Spring Security uses the "ROLE_" prefix convention.
        // Storing "ROLE_LECTURER" here is what makes hasRole("LECTURER") work later.
        var authority = new SimpleGrantedAuthority("ROLE_" + role);

        // UsernamePasswordAuthenticationToken(principal, credentials, authorities)
        //   - principal   = email string (available as getPrincipal() anywhere in the app)
        //   - credentials = null  (we don't need the password after token validation)
        //   - authorities = single-element list with the role authority
        // Passing the authorities list is what marks this as "authenticated" — the
        // two-arg constructor (without authorities) creates an unauthenticated token.
        var authentication = new UsernamePasswordAuthenticationToken(
                email,
                null,
                List.of(authority)
        );

        // Publish to the SecurityContext so Spring Security sees this request
        // as authenticated for all downstream processing (controllers, other filters).
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
