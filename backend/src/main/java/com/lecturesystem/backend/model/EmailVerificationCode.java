package com.lecturesystem.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

// One active verification code per user (enforced by the unique column below).
// Generating a new code overwrites this row rather than inserting another one.
@Entity
@Table(name = "email_verification_codes")
@Getter
@Setter
public class EmailVerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    // Stored in plain text for simplicity at this stage — it's a short-lived,
    // single-use, 6-digit code, not a credential. Hashing it (e.g. the same way
    // passwords are hashed) would be more secure and is worth doing later.
    @Column(nullable = false, length = 6)
    private String code;

    @Column(nullable = false)
    private Instant expiresAt;
}
