package com.example.demo.controller;

import com.example.demo.model.Instructor;
import com.example.demo.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructors")
@CrossOrigin(origins = "*")
public class InstructorController {

    @Autowired
    private InstructorService service;

    // Pagination
    @GetMapping
    public Page<Instructor> getAll(
            @RequestParam int page,
            @RequestParam int size
    ) {
        return service.getAll(page, size);
    }

    // Get by ID
    @GetMapping("/{id}")
    public Instructor getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // Create
    @PostMapping
    public Instructor create(@RequestBody Instructor instructor) {
        return service.save(instructor);
    }

    // Update
    @PutMapping("/{id}")
    public Instructor update(@PathVariable Long id, @RequestBody Instructor instructor) {
        return service.update(id, instructor);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Instructor deleted successfully";
    }

    // Search API
    @GetMapping("/search")
    public List<Instructor> search(@RequestParam String keyword) {
        return service.search(keyword);
    }
}

