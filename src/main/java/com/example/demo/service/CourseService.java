package com.example.demo.service;

import com.example.demo.model.Course;
import com.example.demo.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class CourseService {

    @Autowired
    private CourseRepository repo;

    public Page<Course> listAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findAll(pageable);
    }

    public Page<Course> searchByName(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findByNameContainingIgnoreCase(name, pageable);
    }

    public Course save(Course c) {
        return repo.save(c);
    }

    public Course update(Long id, Course c) {
        return repo.findById(id).map(existing -> {
            existing.setName(c.getName());
            existing.setCode(c.getCode());
            existing.setDescription(c.getDescription());
            existing.setCredits(c.getCredits());
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Course getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
    }
}
