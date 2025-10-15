import { useEffect, useState } from "react";
import "./projectDetail.css";
import { useDarkMode } from "../../context/DarkModeContext";
import useAuth from "../../hooks/useAuth";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { createtk, deletetk, fixtk, gettkpjid } from "../../api/task";


export default function ProjectDetail() {
  const { pjid } = useAuth();
  const id = localStorage.getItem("pjid");
  const { darkMode, setDarkMode } = useDarkMode();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false); // có thay đổi chưa lưu

  const [showModal, setShowModal] = useState(false);
  const [fix,setfix] =useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "",
    status: "",
  });

  const [editingTask, setEditingTask] = useState(null);

  
  const columns = {
    todo: { name: "📝 Todo", color: "#f87171" },
    inprogress: { name: "🚧 In Progress", color: "#facc15" },
    done: { name: "✅ Done", color: "#4ade80" },
  };

  // load tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await gettkpjid(id);
        const mapped = res.data.map((t) => ({
        ...t,
        status:
          t.status === "pending"
            ? "todo"
            : t.status === "in_progress"
            ? "inprogress"
            : t.status === "completed"
            ? "done"
            : "todo",
        }));
        setTasks(mapped);
      } catch (err) {
        console.error("Lỗi khi tải tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [id]);

  // xóa task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Bạn có chắc muốn xóa task này?")) return;
    try {
      await deletetk(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Lỗi khi xóa task:", err);
    }
  };

  // xử lý kéo thả
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id.toString() === draggableId
            ? { ...t, status: destination.droppableId }
            : t
        )
      );
      setChanged(true); // có thay đổi chưa lưu
    } else {
      // reorder trong cùng cột
      const reordered = Array.from(
        tasks.filter((t) => t.status === source.droppableId)
      );
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);

      const others = tasks.filter((t) => t.status !== source.droppableId);
      setTasks([...others, ...reordered]);
    }
  };

  // lưu thay đổi về server
  const saveChanges = async () => {
    try {
      await Promise.all(
        tasks.map((t) =>
          fixtk(t.id, {
            title: t.title,
            description: t.description,
            due_date: t.due_date,
            priority: t.priority,
            status:
              t.status === "todo"
                ? "pending"
                : t.status === "inprogress"
                ? "in_progress"
                : t.status === "done"
                ? "completed"
                : "pending",
          })
        )
      );
      alert("Đã lưu thay đổi!");
      setChanged(false);
    } catch (err) {
      console.error("Lỗi khi lưu tasks:", err);
      alert("Lưu thất bại!");
    }
  };
    // tạo task
  const handleSaveTask = async () => {
  try {
    const id = localStorage.getItem("pjid");
    const statusMap = {
      todo: "pending",
      inprogress: "in_progress",
      done: "completed",
    };

    const payload = {
      project_id: id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      due_date: formData.due_date || null,
      priority: formData.priority,
      status: statusMap[formData.status] || "pending",
    };

    if (!payload.title) {
      alert("Vui lòng nhập tiêu đề task!");
      return;
    }

    console.log("🧩 editingTask hiện tại:", editingTask);
    let res;

    if (editingTask) {
      console.log("payload gửi lên fix:", payload);
      res = await fixtk(editingTask.id, payload);
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? res.data : t))
      );
    } else {
      console.log("payload gửi lên new:", payload);
      res = await createtk(payload);
      setTasks((prev) => [...prev, res.data]);
    }

    setShowModal(false);
    setEditingTask(null);
    alert("✅ Đã lưu thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi lưu task:", err);
    alert("Lưu task thất bại!");
  }
};


  const openModal = (task = null) => {
  if (task) {
    setEditingTask(task);
    setfix(true);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      due_date: task.due_date ? task.due_date.split("T")[0] : "",
      priority: task.priority || "medium",
      status:
        task.status === "pending"
          ? "todo"
          : task.status === "in_progress"
          ? "inprogress"
          : "done",
    });
  } else {
    setEditingTask(null);
    setfix(false);
    setFormData({
      title: "",
      description: "",
      due_date: "",
      priority: "medium",
      status: "todo",
    });
  }
  setShowModal(true);
};


  return (
    
    <div className={`project-detail ${darkMode ? "dark" : ""}`}>
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
      <header className="header">
        <h1>Project Detail {id}</h1>
        <div>
          <button className="btn" onClick={() => openModal()}>
            + New Task
          </button>
          {changed && (
            <button className="btn save" onClick={saveChanges}>
              💾 Lưu thay đổi
            </button>
          )}
        </div>
      </header>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Thêm Task Mới</h2>

            <label>Tiêu đề</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <label>Hạn</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
            />

            <label>Ưu tiên</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
            </select>

            <label>Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <div className="modal-actions">
              <button className="btn" onClick={handleSaveTask}>
                Lưu
              </button>
              <button className="btn danger" onClick={() => setShowModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban">
          {Object.entries(columns).map(([key, col]) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  className="kanban-column"
                  style={{ borderColor: col.color }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 style={{ color: col.color }}>{col.name}</h3>
                  {tasks
                    .filter((t) => t.status === key)
                    .sort((a, b) => {
                        const order = { high: 1, medium: 2, low: 3 };
                        return order[a.priority] - order[b.priority];
                      })
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="task-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h4>{task.title}</h4>
                            <p>Priority: {task.priority}</p>
                            <div className="actions">
                              <button className="btn-small" onClick={() => openModal(task)}>✏️ Edit</button>
                              <button className="btn-small danger" onClick={() => handleDelete(task.id)}> 🗑 Delete</button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
