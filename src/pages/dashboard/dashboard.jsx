import { useEffect, useState } from "react";
import "./dashboard.css";
import { jwtDecode } from "jwt-decode";
import { useDarkMode } from "../../context/DarkModeContext";
import { getpjuserid, createpj, fixpj } from "../../api/projects";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { darkMode, setDarkMode } = useDarkMode();
  const { pjid } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // 👉 thêm biến lưu id người dùng

  // --- Popup form state ---
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  // --- Lấy token từ URL hoặc localStorage ---
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");

    if (urlToken) {
      // Lưu token vào localStorage để dùng lâu dài
      localStorage.setItem("token", urlToken);

      // Giải mã token để lấy thông tin người dùng
      const decoded = jwtDecode(urlToken);
      console.log("🔑 Token payload:", decoded);
      setUserId(decoded.id);

      // Xóa token khỏi URL để sạch hơn
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Nếu không có token trên URL → lấy từ localStorage
      const localToken = localStorage.getItem("token");
      if (localToken) {
        const decoded = jwtDecode(localToken);
        setUserId(decoded.id);
      } else if (user?.id) {
        // fallback cuối cùng nếu có useAuth
        setUserId(user.id);
      }
    }
  }, [user?.id]);

  // --- Fetch projects ---
  useEffect(() => {
    const fetchProjects = async () => {
      if (!userId) return;
      try {
        const res = await getpjuserid(userId);
        const mapped = res.data.map((p) => ({
          ...p,
          tasks: 0,
          completed: 0,
        }));
        setProjects(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi lấy projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userId]);

  // --- Popup form handlers ---
  const openCreateForm = () => {
    setEditingProject(null);
    setFormData({ name: "" });
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setEditingProject(project);
    setFormData({ name: project.name });
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) return alert("Tên project không được để trống!");
      if (!userId) return alert("Không xác định được người dùng!");

      if (editingProject) {
        await fixpj(editingProject.id, { name: formData.name });
      } else {
        await createpj({ user_id: userId, name: formData.name });
      }

      const res = await getpjuserid(userId);
      setProjects(res.data);
      closeForm();
    } catch (err) {
      console.error("❌ Lỗi khi lưu project:", err);
      alert("Có lỗi xảy ra khi lưu project!");
    }
  };

  // --- Handle click chi tiết ---
  const handleDetail = (projectId) => {
    pjid(projectId);
    navigate("/projectdetail");
  };

  // --- Render ---
  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <nav>
          <ul>
            <li><h2 className="logo">TodoApp</h2></li>
            <li>
              <button className="btn-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "☀ Light" : "🌙 Dark"}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="header">
          <h1>Dashboard</h1>
          <button className="btn" onClick={openCreateForm}>+ New Project</button>
        </header>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <>
            <section className="overview">
              <div className="card">Total Projects: {projects.length}</div>
              <div className="card">
                Total Tasks: {projects.reduce((a, p) => a + p.tasks, 0)}
              </div>
              <div className="card">
                Completed: {projects.reduce((a, p) => a + p.completed, 0)}
              </div>
            </section>

            <section className="project-list">
              {projects.map((p) => {
                const progress = p.tasks > 0 ? Math.round((p.completed / p.tasks) * 100) : 0;
                return (
                  <div className="project-card" key={p.id}>
                    <h3>{p.name}</h3>
                    <p>{p.completed}/{p.tasks} tasks</p>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p>Deadline: {p.deadline || "Chưa có"}</p>
                    <div className="btn-row">
                      <button type="button" className="btn-small" onClick={() => handleDetail(p.id)}>Chi tiết</button>
                      <button type="button" className="btn-small" onClick={() => openEditForm(p)}>Sửa</button>
                    </div>
                  </div>
                );
              })}
            </section>
          </>
        )}

        {/* --- Popup Form --- */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{editingProject ? "Sửa Project" : "Tạo Project Mới"}</h2>
              <form onSubmit={handleSubmit}>
                <label>Tên Project:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên project"
                />
                <div className="modal-buttons">
                  <button type="submit" className="btn-save">
                    {editingProject ? "Lưu thay đổi" : "Tạo mới"}
                  </button>
                  <button type="button" className="btn-cancel" onClick={closeForm}>Hủy</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
