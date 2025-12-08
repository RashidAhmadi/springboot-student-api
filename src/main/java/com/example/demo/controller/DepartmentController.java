package com.example.demo.controller;
import com.example.demo.dto.DepartmentRequest;
import com.example.demo.model.Department;
import com.example.demo.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentService service;

    @GetMapping
    public Page<Department> list(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "5") int size) {
        return service.listAllPaged(page, size);
    }

    @GetMapping("/search")
    public Page<Department> search(@RequestParam String name,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "5") int size) {
        return service.searchByNamePaged(name, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> get(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Department> create(@RequestBody DepartmentRequest req) {
        Department d = new Department();
        d.setName(req.name);
        d.setCode(req.code);
        d.setDescription(req.description);
        
        Department created = service.create(d, req.facultyId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> update(@PathVariable Long id, @RequestBody DepartmentRequest req) {
        Department up = new Department();
        up.setName(req.name);
        up.setCode(req.code);
        up.setDescription(req.description);
        try {
            Department updated = service.update(id, up, req.facultyId);
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
