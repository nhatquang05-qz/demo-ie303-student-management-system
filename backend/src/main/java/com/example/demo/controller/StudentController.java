package com.example.demo.controller;

import com.example.demo.entity.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentRepository repository;

    @GetMapping
    public List<Student> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> add(@Valid @RequestBody Student student) {
        if (repository.existsById(student.getStudentCode())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã số sinh viên này đã tồn tại trong hệ thống!"));
        }
        try {
            return ResponseEntity.ok(repository.save(student));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email này đã tồn tại trong hệ thống!"));
        }
    }

    @PutMapping("/{studentCode}")
    public ResponseEntity<?> update(@PathVariable String studentCode, @Valid @RequestBody Student student) {
        if (!repository.existsById(studentCode)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy sinh viên cần sửa!"));
        }
        try {
            student.setStudentCode(studentCode);
            return ResponseEntity.ok(repository.save(student));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email này đã tồn tại trong hệ thống!"));
        }
    }

    @DeleteMapping("/{studentCode}")
    public void delete(@PathVariable String studentCode) {
        repository.deleteById(studentCode);
    }
}