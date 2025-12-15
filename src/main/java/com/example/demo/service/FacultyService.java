package com.example.demo.service;
import com.example.demo.model.Faculty;
import com.example.demo.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository repo;

    public Page<Faculty> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findAll(pageable);
    }
    public List<Faculty> getAllFaculties() {
    return repo.findAll();
    }
    public Page<Faculty> listAllPaged(int page, int size) {
        Pageable p = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findAll(p);
    }

    public Page<Faculty> searchByNamePaged(String name, int page, int size) {
        Pageable p = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findByNameContainingIgnoreCase(name, p);
    }

    public Faculty create(Faculty faculty) {
       
        return repo.save(faculty);
    }

    public Optional<Faculty> getById(Long id) {
        return repo.findById(id);
    }

    public Faculty update(Long id, Faculty update) {
        return repo.findById(id).map(existing -> {
            if (update.getName() != null) existing.setName(update.getName());
            existing.setCode(update.getCode());
            existing.setDescription(update.getDescription());
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
