package com.example.demo.repository;

import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
// Đơn giản hóa tối đa: Không cần mở Connection, không cần viết SQL INSERT/UPDATE dài dòng.
// Chỉ cần kế thừa JpaRepository, Spring Boot tự động cung cấp sẵn hàm save(), deleteById(),...
public interface StudentRepository extends JpaRepository<Student, String> {
    
    // Ma thuật (Magic Query): Chỉ cần đặt tên hàm đúng cấu trúc tiếng Anh, 
    // Spring Boot tự động dịch hàm này thành lệnh SQL: "SELECT * FROM student ORDER BY created_at ASC"
    List<Student> findAllByOrderByCreatedAtAsc();
}