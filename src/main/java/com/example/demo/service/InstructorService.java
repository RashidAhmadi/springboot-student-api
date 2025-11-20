package com.example.demo.service;

import com.example.demo.model.Instructor;
import com.example.demo.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InstructorService {

    @Autowired
    private InstructorRepository repository;

    public Page<Instructor> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return repository.findAll(pageable);
    }

    public Instructor save(Instructor instructor) {
        return repository.save(instructor);
    }

    public Instructor update(Long id, Instructor newData) {
        Instructor inst = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        inst.setName(newData.getName());
        inst.setLastname(newData.getLastname());
        inst.setFaculty(newData.getFaculty());
        inst.setDepartment(newData.getDepartment());
        inst.setAcademicRank(newData.getAcademicRank());
        inst.setDegree(newData.getDegree());
        inst.setEmployment(newData.getEmployment());
        inst.setProficiency(newData.getProficiency());

        return repository.save(inst);
    }

    public Instructor getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Instructor> search(String keyword) {
        return repository.search(keyword);
    }
}
