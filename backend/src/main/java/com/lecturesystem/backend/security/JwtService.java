package com.lecturesystem.backend.security;

import com.lecturesystem.backend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    // SecretKey is jjwt's typed wrapper around the raw bytes.
    // Storing it here means we decode the Base64 secret once at startup,
    // not on every request.
    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationMs) {
        // Decoders.BASE64.decode turns the Base64 string from the env var back
        // into raw bytes.  Keys.hmacShaKeyFor wraps those bytes in a SecretKey
        // that jjwt can use — it also validates the key is long enough for HS256
        // (minimum 32 bytes / 256 bits).
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = expirationMs;
    }

    // ------------------------------------------------------------------
    // Token creation
    // ------------------------------------------------------------------

    public String generateToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                // "sub" — the standard claim that identifies the principal.
                // We use email so the server can later reload the user from DB.
                .subject(user.getEmail())

                // Custom claim: not part of the JWT standard, but safe to add.
                // Storing role here lets the frontend show the right UI immediately
                // without a second API call.
                .claim("role", user.getRole().name())

                // "iat" — issued-at timestamp. Lets you reason about token age.
                .issuedAt(now)

                // "exp" — the moment the token stops being valid.
                // jjwt checks this automatically on every parse.
                .expiration(expiry)

                // Sign with HMAC-SHA-256.  Jwts.SIG.HS256 is the 0.12.x way to
                // reference the algorithm — it replaced the old SignatureAlgorithm enum.
                // The signature makes it impossible to forge or tamper with the token
                // without knowing the secret.
                .signWith(signingKey, Jwts.SIG.HS256)

                // Serialize everything into the compact dot-separated string:
                // base64url(header).base64url(payload).signature
                .compact();
    }

    // ------------------------------------------------------------------
    // Token reading — used by the security filter in the next phase
    // ------------------------------------------------------------------

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    // Reads the custom "role" claim we wrote in generateToken().
    // Returns the raw string e.g. "LECTURER" or "STUDENT".
    public String extractRole(String token) {
        return (String) parseClaims(token).get("role");
    }

    // Returns false for expired, tampered, or malformed tokens instead of
    // propagating the exception to callers.
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ------------------------------------------------------------------
    // Internal parsing — all verification happens here
    // ------------------------------------------------------------------

    private Claims parseClaims(String token) {
        return Jwts.parser()
                // Tell jjwt which key to use when verifying the signature.
                // It will reject any token not signed with our secret.
                .verifyWith(signingKey)
                .build()
                // parseSignedClaims is the 0.12.x method (was parseClaimsJws in 0.11).
                // It verifies the signature AND checks exp — throws if either fails.
                .parseSignedClaims(token)
                // getPayload() returns the Claims map (was getBody() in 0.11).
                .getPayload();
    }
}
