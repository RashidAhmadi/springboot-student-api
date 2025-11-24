package com.example.demo.service;

import com.example.demo.model.Course;
import com.example.demo.model.Instructor;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository repo;

    @Autowired
    private InstructorRepository instructorRepo;

    public Page<Course> listAllPaged(int page, int size) {
        Pageable p = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findAll(p);
    }

    public Page<Course> searchByNamePaged(String name, int page, int size) {
        Pageable p = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findByNameContainingIgnoreCase(name, p);
    }

    public Course create(Course course, Long instructorId) {
        if (instructorId != null) {
            Instructor ins = instructorRepo.findById(instructorId)
                    .orElseThrow(() -> new RuntimeException("Instructor not found"));
            course.setInstructor(ins);
        }
        return repo.save(course);
    }

    public Optional<Course> getById(Long id) {
        return repo.findById(id);
    }

    public Course update(Long id, Course update, Long instructorId) {
        return repo.findById(id).map(existing -> {
            if (update.getName() != null) existing.setName(update.getName());
            existing.setCode(update.getCode());
            existing.setDescription(update.getDescription());
            existing.setCredits(update.getCredits());
            if (instructorId != null) {
                Instructor ins = instructorRepo.findById(instructorId)
                        .orElseThrow(() -> new RuntimeException("Instructor not found"));
                existing.setInstructor(ins);
            } else {
                existing.setInstructor(null); // optional: clear assignment if instructorId null
            }
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
