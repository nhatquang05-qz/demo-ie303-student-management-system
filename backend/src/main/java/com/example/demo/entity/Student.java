package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDateTime;

// @Entity: Tính năng Đơn giản hóa (Simplifying). Spring Boot sẽ tự động quét class này
// và tự động gõ lệnh CREATE TABLE để tạo bảng 'student' dưới MySQL mà không cần tự làm thủ công.
@Entity
@Data
public class Student {
    
    // @Id: Đánh dấu biến này là Khóa Chính (Primary Key).
    @Id
    // Đơn giản hóa Validation: Thay vì viết hàng tá lệnh if-else trong Controller để kiểm tra mssv, 
    // ta chỉ cần dùng @Pattern. Nếu nhập sai (ví dụ nhập chữ), Spring tự động chặn đứng ngay lập tức!
    @Pattern(regexp = "^\\d{8}$", message = "Mã số sinh viên phải gồm đúng 8 chữ số")
    private String studentCode;

    @NotBlank(message = "Tên không được để trống")
    private String name;

    // @Column(unique = true): Tự động đánh index Unique dưới DB để chặn trùng lặp email.
    @Email(message = "Email không hợp lệ")
    @Column(unique = true)
    private String email;

    @Min(value = 0, message = "Điểm phải lớn hơn hoặc bằng 0")
    @Max(value = 10, message = "Điểm phải nhỏ hơn hoặc bằng 10")
    private Double score;

    // updatable = false: Đảm bảo thời gian tạo không bị thay đổi khi người dùng bấm Cập nhật thông tin.
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}