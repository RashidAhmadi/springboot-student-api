package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService service;

    // GET /api/courses?page=0&size=10
    @GetMapping
    public Page<Course> list(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "10") int size) {
        return service.listAll(page, size);
    }

    // GET /api/courses/search?name=foo&page=0&size=10
    @GetMapping("/search")
    public Page<Course> search(@RequestParam String name,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "10") int size) {
        return service.searchByName(name, page, size);
    }

    // GET /api/courses/{id}
    @GetMapping("/{id}")
    public Course get(@PathVariable Long id) {
        return service.getById(id);
    }

    // POST /api/courses
    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course course) {
        Course created = service.save(course);
        return ResponseEntity.ok(created);
    }

    // PUT /api/courses/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody Course course) {
        Course updated = service.update(id, course);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/courses/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
