package com.lecturesystem.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // False until the signup email-verification code is confirmed (see
    // EmailVerificationService). Login is rejected while this is false.
    @Column(nullable = false)
    private boolean enabled = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
