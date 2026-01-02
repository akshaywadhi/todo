import React from "react";
import api from "../api";
import { useEffect, useState } from "react";
import { useRef } from "react";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    image: null,
  });

  const [editId, setEditId] = useState(null);
  const fileRef = useRef(null);

  const fetchTodo = async () => {
    const res = await api.get("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("desc", form.desc);

    if (form.image) {
      formData.append("image", form.image);
    }

    if (editId) {
      const res = await api.put(`/todos/${editId}`, formData);
      console.log(res.data);
    } else {
      const res = await api.post("/todos", formData);

      console.log(res.data);
    }

    setForm({
      title: "",
      desc: "",
      image: null,
    });

    setEditId(null);
    fileRef.current.value = null


    fetchTodo();
  };

  const editTodo = (todo) => {
    setForm({
      title: todo.title,
      desc: todo.desc,
      image: null,
    });
    setEditId(todo._id);
  };

  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    fetchTodo();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mb-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title"
            value={form.title}
            placeholder="Title"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <textarea
            name="desc"
            value={form.desc}
            placeholder="Description"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            className="
    block w-full text-sm text-gray-600
    file:mr-4 file:py-2 file:px-4
    file:rounded-md file:border-0
    file:text-sm file:font-semibold
    file:bg-blue-50 file:text-blue-700
    hover:file:bg-blue-100
    cursor-pointer
  "
            onChange={handleImage}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer">
            {editId ? "Update Todo" : "Add Todo"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {todos.map((item) => (
          <div key={item._id} className="bg-white rounded p-4 shadow">
            {item.image?.url && (
              <img
                src={item.image.url}
                className="h-40 w-full object-cover rounded mb-3"
              />
            )}
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="text-gray-600">{item.desc}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => editTodo(item)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTodo(item._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
