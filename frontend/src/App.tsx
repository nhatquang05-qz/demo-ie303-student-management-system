import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', score: '' });

  const fetchStudents = async () => {
    const res = await axios.get("http://localhost:8080/api/students");
    setStudents(res.data);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/students", form);
      setForm({ name: '', email: '', score: '' });
      fetchStudents();
    } catch (err) { alert("Lỗi dữ liệu: " + err.response.data.message); }
  };

  return (
    <div className="container mt-5">
      <h2>Quản lý Sinh viên</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input className="form-control mb-2" placeholder="Tên" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="form-control mb-2" type="number" placeholder="Điểm" value={form.score} onChange={e => setForm({...form, score: e.target.value})} />
        <button className="btn btn-primary">Thêm sinh viên</button>
      </form>
      <table className="table table-bordered">
        <thead>
          <tr><th>ID</th><th>Tên</th><th>Email</th><th>Điểm</th></tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}><td>{s.id}</td><td>{s.name}</td><td>{s.email}</td><td>{s.score}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App;