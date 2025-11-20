package com.example.demo.repository;

import com.example.demo.model.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {

    @Query("SELECT i FROM Instructor i WHERE " +
            "LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.lastname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.department) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.faculty) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Instructor> search(String keyword);
}
