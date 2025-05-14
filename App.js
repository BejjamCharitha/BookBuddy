import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/books";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    status: "Unread",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async () => {
    const res = await axios.get(API);
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ title: "", author: "", genre: "", year: "", status: "Unread" });
    fetchBooks();
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditingId(book._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchBooks();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Book Buddy</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
        <input name="year" placeholder="Year" value={form.year} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Read</option>
          <option>Unread</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <b>{book.title}</b> by {book.author} ({book.genre}, {book.year}) - <i>{book.status}</i>
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
