import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoFootball,
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoArrowForward,
  IoPersonAddOutline,
} from "react-icons/io5";

import "./styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin() {
    navigate("/dashboard");
  }

  return (
    <div className="login-wrapper">
      {/* Formas orgânicas suaves ao fundo */}
      <div className="background-shape shape-1"></div>
      <div className="background-shape shape-2"></div>
      <div className="background-shape shape-3"></div>

      <div className="login-container">
        {/* CARD FROSTED */}
        <div className="login-card glass-light">
          
          <header className="login-header">
            <div className="icon-badge">
              <IoFootball className="bounce-animation" size={42} />
            </div>
            <div className="header-text">
              <h1>Entrar</h1>
              <p>O campo está pronto entre em sua conta para saber mais.</p>
            </div>
          </header>

          <div className="form-content">
            {/* Input Email */}
            <label className="input-group">
              <div className="icon-slot">
                <IoMailOutline size={20} />
              </div>
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {/* Input Senha */}
            <label className="input-group">
              <div className="icon-slot">
                <IoLockClosedOutline size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
              </button>
            </label>

            <button className="forgot-link" onClick={() => navigate("/forgot")}>
              Recuperar senha
            </button>

            {/* LOGIN BUTTON */}
            <button className="btn-primary shadow-hover" onClick={handleLogin}>
              <span>Acessar Painel</span>
              <IoArrowForward size={18} />
            </button>

            <div className="divider">
              <span>novo por aqui?</span>
            </div>

            {/* Register */}
            <button className="btn-secondary" onClick={() => navigate("/register")}>
              <IoPersonAddOutline size={18} />
              Criar conta gratuita
            </button>
          </div>

          <footer className="footer">
            Termos de Uso • Privacidade
          </footer>
        </div>
      </div>
    </div>
  );
}