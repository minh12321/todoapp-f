import "./login.css";
import api from "../../api/axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      setMessage("Đăng nhập thành công ✅");
      console.log("Login data:", res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.accessToken);
      }
      if (res.data.token) {
        localStorage.setItem("refreshtoken", res.data.refreshToken);
      }


    } catch (err) {
      setMessage(err.response?.data?.error || "Có lỗi xảy ra ❌");
    }
  };

  return (
    <div className="page-1">
      <div className="login-card">
        <h2>Đăng nhập</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">
            Đăng nhập
          </button>
        </form>
        <p className="message">{message}</p>
        <div className="login-footer">
          <p>
            Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}