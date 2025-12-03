package com.example.demo.repository;
import com.example.demo.model.Faculty;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Page<Faculty> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
