package com.lecturesystem.backend.service;

import com.lecturesystem.backend.exception.InvalidEmailDomainException;
import com.lecturesystem.backend.model.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Single source of truth for turning an email address into an account role.
 * The domains are configurable (see application.properties) and compared
 * case-insensitively.
 */
@Service
public class EmailDomainService {

    private final String studentDomain;
    private final String lecturerDomain;

    public EmailDomainService(
            @Value("${app.email.student-domain}") String studentDomain,
            @Value("${app.email.lecturer-domain}") String lecturerDomain) {
        // Store domains lowercased so comparisons against a normalized email hold.
        this.studentDomain = studentDomain.trim().toLowerCase();
        this.lecturerDomain = lecturerDomain.trim().toLowerCase();
    }

    /** Trim + lowercase so stored emails and domain checks are always consistent. */
    public String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    /**
     * Derives the account role from the email's domain. Pass a value that has
     * already been run through {@link #normalize}.
     *
     * TODO: email ownership is not yet verified — a user could enter a
     * lecturer-domain email they don't own. Email verification (planned) will
     * close this gap.
     */
    public Role resolveRole(String normalizedEmail) {
        int at = normalizedEmail.lastIndexOf('@');
        // No '@', or nothing after it: not a usable address. Malformed emails are
        // normally caught by @Email (400) before we get here; this is a safety net.
        if (at < 0 || at == normalizedEmail.length() - 1) {
            throw new InvalidEmailDomainException();
        }
        String domain = normalizedEmail.substring(at + 1);

        if (domain.equals(lecturerDomain)) {
            return Role.LECTURER;
        }
        if (domain.equals(studentDomain)) {
            return Role.STUDENT;
        }
        throw new InvalidEmailDomainException();
    }
}
