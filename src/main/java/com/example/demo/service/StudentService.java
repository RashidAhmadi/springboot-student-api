package com.example.demo.service;
import com.example.demo.model.Department;
import com.example.demo.model.Faculty;
import com.example.demo.model.Student;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.FacultyRepository;
import com.example.demo.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repo;

    @Autowired
    private FacultyRepository facultyRepo;
    private DepartmentRepository departmentRepo;

    public Page<Student> listAllPaged(int page, int size) {
        Pageable p = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findAll(p);
    }

    public Page<Student> searchByNamePaged(String name, int page, int size) {
        Pageable p = PageRequest.of(page, size, Sort.by("id").descending());
        return repo.findByNameContainingIgnoreCase(name, p);
    }

    public Student create(Student student, Long facultyId) {
        if (facultyId != null) {
            Faculty fa = facultyRepo.findById(facultyId)
                    .orElseThrow(() -> new RuntimeException("Faculty not found"));
            student.setFaculty(fa);
        }
        return repo.save(student);
    }

    public Optional<Student> getById(Long id) {
        return repo.findById(id);
    }

    public Student update(Long id, Student update, Long facultyId, Long departmentId) {
        return repo.findById(id).map(existing -> {
            if (update.getFName() !=null && update.getLName() != null) existing.setFName(update.getFName());
            existing.setLName(update.getLName());
            if (facultyId != null) {
                Faculty fa = facultyRepo.findById(facultyId)
                        .orElseThrow(() -> new RuntimeException("Faculty not found"));
                existing.setFaculty(fa);
            } else {
                existing.setFaculty(null); // optional: clear assignment if facultyId null
            }

            if (departmentId != null) {
                Department de = departmentRepo.findById(departmentId)
                        .orElseThrow(() -> new RuntimeException("Department not found"));
                existing.setDepartment(de);
            } else {
                existing.setDepartment(null);// optional: clear assignment if deparmentId null
            }
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
