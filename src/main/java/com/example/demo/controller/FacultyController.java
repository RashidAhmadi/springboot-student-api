package com.example.demo.controller;

import com.example.demo.dto.FacultyRequest;
import com.example.demo.model.Faculty;
import com.example.demo.model.Instructor;
import com.example.demo.service.CourseService;
import com.example.demo.service.FacultyService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculties")
@CrossOrigin(origins = "*")
public class FacultyController {
    @Autowired
    private FacultyService service;

    // Pagination
    @GetMapping
    public Page<Faculty> getAll(
            @RequestParam int page,
            @RequestParam int size
    ) {
        return service.getAll(page, size);
    }

    // Return list of all faculties (for dropdowns, etc.)
    @GetMapping("/all")
    public List<Faculty> getAllInstructors() {
        return service.getAllFaculties();
    }

    @GetMapping("/search")
    public Page<Faculty> search(@RequestParam String name,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "5") int size) {
        return service.searchByNamePaged(name, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Faculty> get(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Faculty> create(@RequestBody FacultyRequest req) {
        Faculty c = new Faculty();
        c.setName(req.name);
        c.setCode(req.code);
        c.setDescription(req.description);
        Faculty created = service.create(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Faculty> update(@PathVariable Long id, @RequestBody FacultyRequest req) {
        Faculty up = new Faculty();
        up.setName(req.name);
        up.setCode(req.code);
        up.setDescription(req.description);

        try {
            Faculty updated = service.update(id, up);
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

