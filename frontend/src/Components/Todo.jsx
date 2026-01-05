import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: "", desc: "", image: null });
  const [editId, setEditId] = useState(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const user = getUserFromToken();
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchTodo = async () => {
    const res = await api.get("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("desc", form.desc);
    if (form.image) formData.append("image", form.image);

    editId
      ? await api.put(`/todos/${editId}`, formData)
      : await api.post("/todos", formData);

    setForm({ title: "", desc: "", image: null });
    setEditId(null);
    fileRef.current.value = null;
    fetchTodo();
  };

  const editTodo = (todo) => {
    setForm({ title: todo.title, desc: todo.desc, image: null });
    setEditId(todo._id);
  };

  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    fetchTodo();
  };

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">

      {/* 🌟 NAVBAR */}
      <nav className="sticky top-0 z-20 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            <span className="text-purple-400">✓</span> TaskFlow
          </h1>

          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt="avatar"
              className="w-9 h-9 rounded-full bg-white"
            />
            <button
              onClick={logout}
              className="text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* 🌟 CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-4 gap-8">

        {/* 📊 SIDEBAR / STATS */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-lg font-semibold">Welcome back</h2>
            <p className="text-gray-400 text-sm mt-1">
              Stay productive today 🚀
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <p className="text-sm text-gray-400">Total tasks</p>
            <h3 className="text-3xl font-bold mt-1">{todos.length}</h3>
          </div>
        </aside>

        {/* 📝 MAIN */}
        <main className="lg:col-span-3 space-y-8">

          {/* CREATE / EDIT */}
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
            <h2 className="text-lg font-medium mb-4">
              {editId ? "Edit task" : "Create new task"}
            </h2>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Task title"
                required
                className="rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20"
              />

              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                onChange={handleImage}
                className="text-sm text-gray-400 file:bg-white/10 file:text-white file:border-0 file:rounded-lg"
              />

              <textarea
                name="desc"
                value={form.desc}
                onChange={handleChange}
                placeholder="Description"
                rows="3"
                required
                className="md:col-span-2 rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20"
              />

              <button className="md:col-span-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-3 font-medium hover:scale-[1.02] transition">
                {editId ? "Update task" : "Add task"}
              </button>
            </form>
          </div>

          {/* 📌 TASK LIST */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {todos.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-20">
                ✨ No tasks yet. Start by adding one.
              </div>
            )}

            {todos.map((item) => (
              <div
                key={item._id}
                className="group rounded-2xl bg-white/5 border border-white/10 p-4 hover:border-purple-400/40 transition"
              >
                {item.image?.url && (
                  <img
                    src={item.image.url}
                    className="h-36 w-full object-cover rounded-xl mb-3"
                  />
                )}

                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.desc}</p>

                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => editTodo(item)}
                    className="flex-1 rounded-lg bg-white/10 py-2 text-sm hover:bg-white/20"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(item._id)}
                    className="flex-1 rounded-lg bg-red-500/20 text-red-300 py-2 text-sm hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
