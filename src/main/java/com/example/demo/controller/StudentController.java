package com.example.demo.controller;
import com.example.demo.model.Student;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;



@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")  // Allow frontend access
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        Student s = studentRepository.findById(id).orElseThrow();
        s.setName(studentDetails.getName());
        s.setEmail(studentDetails.getEmail());
        s.setCourse(studentDetails.getCourse());
        return studentRepository.save(s);
    }

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return "Deleted";
    }
}