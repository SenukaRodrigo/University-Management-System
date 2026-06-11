package com.lecturesystem.backend.repository;

import com.lecturesystem.backend.model.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
    // Derived query: Spring Data parses the method name into
    // "WHERE lecture.lecturer.id = ?" — no SQL needed.
    List<Lecture> findByLecturerId(Long lecturerId);
}
