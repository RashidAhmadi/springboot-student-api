
package com.example.demo.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "department")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String code;

    @Column(length = 2000)
    private String description;

    // NEW: many-to-one relationship to Faculty
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Faculty faculty;

    public Department() {}

    // getters and setters for all fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Faculty getFaculty() { return faculty; }
    public void setFaculty(Faculty faculty) { this.faculty = faculty; }
}

