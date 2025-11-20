package com.example.demo.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Instructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String lastname;
    private String faculty;
    private String department;
    private String academicRank;
    private String degree;          // Education Degree
    private String employment;      // Visitor / Permanent
    private String proficiency;     // Skills or field expertise
}
