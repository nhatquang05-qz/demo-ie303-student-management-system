import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Student {
  studentCode: string;
  name: string;
  email: string;
  score: number;
}

interface StudentForm {
  studentCode: string;
  name: string;
  email: string;
  score: number | string;
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<StudentForm>({ studentCode: '', name: '', email: '', score: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/students");
      setStudents(res.data);
    } catch (error) {
      alert("Không thể kết nối tới Backend!");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/students/${form.studentCode}`, form);
      } else {
        await axios.post("http://localhost:8080/api/students", form);
      }
      setForm({ studentCode: '', name: '', email: '', score: '' });
      setIsEditing(false);
      fetchStudents();
    } catch (err: any) {
      alert("Lỗi dữ liệu: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (student: Student) => {
    setForm({
      studentCode: student.studentCode,
      name: student.name,
      email: student.email,
      score: student.score
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setForm({ studentCode: '', name: '', email: '', score: '' });
    setIsEditing(false);
  };

  const handleDelete = async (studentCode: string) => {
    if (window.confirm("Xóa sinh viên này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/students/${studentCode}`);
        fetchStudents();
      } catch (err: any) {
        alert("Lỗi khi xóa: " + err.message);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5 text-primary fw-bold text-uppercase">Demo Quản Lý Sinh Viên</h2>
      
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card border-0">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0 fw-bold">{isEditing ? 'Cập Nhật Thông Tin' : 'Thêm Mới Sinh Viên'}</h5>
            </div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary">Mã Số Sinh Viên</label>
                  <input 
                    className="form-control" 
                    placeholder="Nhập 8 chữ số..." 
                    value={form.studentCode} 
                    onChange={e => setForm({...form, studentCode: e.target.value})} 
                    disabled={isEditing}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary">Họ và Tên</label>
                  <input 
                    className="form-control" 
                    placeholder="Nhập tên sinh viên..." 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary">Địa chỉ Email</label>
                  <input 
                    className="form-control" 
                    type="email" 
                    placeholder="Nhập email hợp lệ..." 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">Điểm số (0 - 10)</label>
                  <input 
                    className="form-control" 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="10" 
                    placeholder="Nhập điểm..." 
                    value={form.score} 
                    onChange={e => setForm({...form, score: e.target.value})} 
                    required 
                  />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary w-100 fw-bold py-2" type="submit">
                    {isEditing ? 'Lưu Thay Đổi' : 'Lưu Dữ Liệu'}
                  </button>
                  {isEditing && (
                    <button className="btn btn-secondary w-100 fw-bold py-2" type="button" onClick={handleCancelEdit}>
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped mb-0 text-center align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th className="py-3">STT</th>
                      <th className="py-3">MSSV</th>
                      <th className="text-start py-3">Tên Sinh Viên</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Điểm Số</th>
                      <th className="py-3">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-5 text-muted">
                          Chưa có dữ liệu sinh viên nào trong hệ thống.
                        </td>
                      </tr>
                    ) : (
                      students.map((s, index) => (
                        <tr key={s.studentCode}>
                          <td className="fw-bold text-secondary">{index + 1}</td>
                          <td className="fw-bold text-primary">{s.studentCode}</td>
                          <td className="text-start fw-medium">{s.name}</td>
                          <td className="text-muted">{s.email}</td>
                          <td>
                            <span className={`badge ${Number(s.score) >= 5 ? 'bg-success' : 'bg-danger'} px-3 py-2 fs-6 rounded-pill`}>
                              {s.score}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <button 
                                className="btn btn-sm btn-outline-primary fw-bold px-3" 
                                onClick={() => handleEdit(s)}
                              >
                                Sửa
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger fw-bold px-3" 
                                onClick={() => handleDelete(s.studentCode)}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;