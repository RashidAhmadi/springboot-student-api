package com.example.demo.service;

import com.example.demo.model.Department;
import com.example.demo.model.Faculty;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository repo;

    @Autowired
    private FacultyRepository instructorRepo;

    public Page<Department> listAllPaged(int page, int size) {
        Pageable p = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findAll(p);
    }

    public Page<Department> searchByNamePaged(String name, int page, int size) {
        Pageable p = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findByNameContainingIgnoreCase(name, p);
    }

    public Department create(Department department, Long facultyId) {
        if (facultyId != null) {
            Faculty fa = instructorRepo.findById(facultyId)
                    .orElseThrow(() -> new RuntimeException("Instructor not found"));
            department.setFaculty(fa);
        }
        return repo.save(department);
    }

    public Optional<Department> getById(Long id) {
        return repo.findById(id);
    }

    public Department update(Long id, Department update, Long facultyId) {
        return repo.findById(id).map(existing -> {
            if (update.getName() != null) existing.setName(update.getName());
            existing.setCode(update.getCode());
            existing.setDescription(update.getDescription());
            if (facultyId != null) {
                Faculty fa = instructorRepo.findById(facultyId)
                        .orElseThrow(() -> new RuntimeException("Faculty not found"));
                existing.setFaculty(fa);
            } else {
                existing.setFaculty(null); // optional: clear assignment if facultyId null
            }
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Department not found"));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
