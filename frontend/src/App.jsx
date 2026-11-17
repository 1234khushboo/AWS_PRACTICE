import { useEffect, useState } from 'react';

const API = 'http://localhost:5000/api/students';
const emptyForm = { name: '', email: '', course: '' };

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadStudents() {
    try {
      const response = await fetch(API);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to load students');
      setStudents(data);
    } catch (error) {
      setMessage(`${error.message}. Check that the backend and MySQL are running.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStudents(); }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    const url = editingId ? `${API}/${editingId}` : API;
    try {
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');
      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? 'Student updated.' : 'Student added.');
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function editStudent(student) {
    setForm({ name: student.name, email: student.email, course: student.course });
    setEditingId(student.id);
    setMessage('');
  }

  async function deleteStudent(id) {
    if (!window.confirm('Delete this student?')) return;
    try {
      const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Delete failed');
      setMessage('Student deleted.');
      if (editingId === id) cancelEdit();
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <main className="container">
      <header>
        <p className="eyebrow">FULL STACK MINI PROJECT</p>
        <h1>Student Management</h1>
        <p className="subtitle">Create, view, update and delete student records.</p>
      </header>

      <section className="panel">
        <h2>{editingId ? 'Update student' : 'Add a student'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Student name" value={form.name} onChange={updateField} required />
          <input name="email" type="email" placeholder="Email address" value={form.email} onChange={updateField} required />
          <input name="course" placeholder="Course (e.g. B.Tech CSE)" value={form.course} onChange={updateField} required />
          <div className="actions">
            <button type="submit">{editingId ? 'Save changes' : 'Add student'}</button>
            {editingId && <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
        {message && <p className="message" role="status">{message}</p>}
      </section>

      <section className="panel">
        <div className="table-heading">
          <h2>Student records</h2>
          <span>{students.length} total</span>
        </div>
        {loading ? <p>Loading...</p> : students.length === 0 ? <p>No students yet. Add your first student above.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>Actions</th></tr></thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.id}</td><td>{student.name}</td><td>{student.email}</td><td>{student.course}</td>
                    <td className="row-actions">
                      <button className="small secondary" onClick={() => editStudent(student)}>Edit</button>
                      <button className="small danger" onClick={() => deleteStudent(student.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <footer>React · Express · Node.js · MySQL</footer>
    </main>
  );
}
