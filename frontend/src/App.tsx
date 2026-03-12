import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
interface Student {
  id: number;
  name: string;
  email: string;
  score: number;
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({ name: '', email: '', score: '' });

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
      await axios.post("http://localhost:8080/api/students", form);
      setForm({ name: '', email: '', score: '' });
      fetchStudents();
    } catch (err: any) {
      alert("Lỗi dữ liệu: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Xóa sinh viên này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/students/${id}`);
        fetchStudents();
      } catch (err: any) {
        alert("Lỗi khi xóa: " + err.message);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5 text-primary fw-bold text-uppercase">Hệ Thống Quản Lý Sinh Viên</h2>
      
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0 fw-bold">Thêm Mới / Cập Nhật</h5>
            </div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit}>
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
                    placeholder="Nhập điểm trung bình..." 
                    value={form.score} 
                    onChange={e => setForm({...form, score: e.target.value})} 
                    required 
                  />
                </div>
                <button className="btn btn-primary w-100 fw-bold py-2" type="submit">
                  Lưu Dữ Liệu
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0 text-center align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th className="py-3">ID</th>
                      <th className="text-start py-3">Tên Sinh Viên</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Điểm Số</th>
                      <th className="py-3">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5 text-muted">
                          Chưa có dữ liệu sinh viên nào trong hệ thống.
                        </td>
                      </tr>
                    ) : (
                      students.map(s => (
                        <tr key={s.id}>
                          <td className="fw-bold text-secondary">{s.id}</td>
                          <td className="text-start fw-medium">{s.name}</td>
                          <td className="text-muted">{s.email}</td>
                          <td>
                            <span className={`badge ${s.score >= 5 ? 'bg-success' : 'bg-danger'} px-3 py-2 fs-6 rounded-pill`}>
                              {s.score}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-danger fw-bold px-3" 
                              onClick={() => handleDelete(s.id)}
                            >
                              Xóa
                            </button>
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