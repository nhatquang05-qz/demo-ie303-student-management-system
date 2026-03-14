package com.example.demo.controller;

import com.example.demo.entity.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
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

// @RestController: Đơn giản hóa Data Binding. Tự động dịch các Object Java thành chuỗi JSON cho React.
@RestController
@RequestMapping("/api/students")
// @CrossOrigin: Web API. Chỉ 1 dòng này giải quyết toàn bộ lỗi bảo mật CORS,
// cho phép Frontend (Vite port 5173) được phép gọi đến Backend (Port 8080).
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentRepository repository;

    @GetMapping
    public List<Student> getAll() {
        return repository.findAllByOrderByCreatedAtAsc();
    }

    @PostMapping
    // @RequestBody: Tự động bắt chuỗi JSON từ React gửi lên và biến thành Object Student.
    // @Valid: Kích hoạt bộ lọc chặn lỗi (MSSV, Email) bên file Student.java.
    public ResponseEntity<?> add(@Valid @RequestBody Student student) {
        if (repository.existsById(student.getStudentCode())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã số sinh viên này đã tồn tại trong hệ thống!"));
        }
        try {
            return ResponseEntity.ok(repository.save(student)); // save() ở đây đóng vai trò là INSERT
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
            return ResponseEntity.ok(repository.save(student)); // save() ở đây tự hiểu là UPDATE vì đã có ID
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email này đã tồn tại trong hệ thống!"));
        }
    }

    @DeleteMapping("/{studentCode}")
    public void delete(@PathVariable String studentCode) {
        repository.deleteById(studentCode);
    }

    // Hàm đánh chặn: Nếu @Valid bắt được lỗi (nhập chữ vào MSSV, điểm > 10...), 
    // Spring sẽ ném lỗi đó vào đây, hàm này sẽ lấy đúng câu thông báo tiếng Việt trả về cho React hiện Popup.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(Map.of("message", errorMessage));
    }
}