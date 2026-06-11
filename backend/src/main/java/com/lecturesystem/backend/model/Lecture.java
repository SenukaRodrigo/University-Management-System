package com.lecturesystem.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "lectures")
@Getter
@Setter
public class Lecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many lectures -> one lecturer. LAZY means the User row is only fetched
    // from the DB when we actually call a getter on it, not on every lecture load.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lecturer_id", nullable = false)
    private User lecturer;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
