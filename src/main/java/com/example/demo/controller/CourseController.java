package com.example.demo.controller;

import com.example.demo.dto.CourseRequest;
import com.example.demo.model.Course;
import com.example.demo.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService service;

    @GetMapping
    public Page<Course> list(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "5") int size) {
        return service.listAllPaged(page, size);
    }

    @GetMapping("/search")
    public Page<Course> search(@RequestParam String name,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "5") int size) {
        return service.searchByNamePaged(name, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> get(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody CourseRequest req) {
        Course c = new Course();
        c.setName(req.name);
        c.setCode(req.code);
        c.setDescription(req.description);
        c.setCredits(req.credits);
        Course created = service.create(c, req.instructorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody CourseRequest req) {
        Course up = new Course();
        up.setName(req.name);
        up.setCode(req.code);
        up.setDescription(req.description);
        up.setCredits(req.credits);
        try {
            Course updated = service.update(id, up, req.instructorId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
