import "./login.css";
import api from "../../api/axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
  window.location.href = "http://localhost:5000/auth/google";
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      setMessage("Đăng nhập thành công ");
      console.log("Login data:", res.data);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); 

      login(res.data);

      // if (res.data.accessToken) {
      //   localStorage.setItem("token", res.data.accessToken);
      // }
      // if (res.data.accessToken) {
      //   localStorage.setItem("refreshtoken", res.data.refreshToken);
      // }
      // if (data.user) {
      // localStorage.setItem("user", JSON.stringify(data.user));
      // setUser(data.user);
      // }đã chuyển vào hook


    } catch (err) {
      setMessage(err.response?.data?.error || "Có lỗi xảy ra ");
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
          <button onClick={handleGoogleLogin} className="google-login-btn">
            <img src="data:image/png;base64,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" alt="Google" /> Đăng nhập bằng Google
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