import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Assumindo que usa router
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoArrowForward,
  IoShieldCheckmarkOutline 
} from "react-icons/io5";

import "./styles/Ranking.css";

export default function Register() {
  const navigate = useNavigate(); // Hook para navegação
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="register-wrapper">
      {/* Elementos de fundo para manter consistência com o Login */}
      <div className="background-shape shape-1"></div>
      <div className="background-shape shape-2"></div>
      
      <div className="register-container">
        <div className="register-card glass-light">
          
          {/* HEADER */}
          <header className="register-header">
            <div className="header-icon">
              <IoShieldCheckmarkOutline size={32} />
            </div>
            <h1>Junte-se ao time</h1>
            <p>Crie sua conta gratuita em segundos.</p>
          </header>

          {/* FORM */}
          <div className="form-content">
            
            {/* Input Nome */}
            <label className="input-group">
              <div className="icon-slot">
                <IoPersonOutline size={20} />
              </div>
              <input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            {/* Input Email */}
            <label className="input-group">
              <div className="icon-slot">
                <IoMailOutline size={20} />
              </div>
              <input
                type="email"
                placeholder="Endereço de email"
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
                type="password"
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {/* Botão de Registro */}
            <button className="btn-primary shadow-hover">
              <span>Criar Conta</span>
              <IoArrowForward size={18} />
            </button>

            {/* Footer / Login Link */}
            <div className="register-footer">
              <p>Já tem uma conta?</p>
              <button className="link-btn" onClick={() => navigate("/")}>
                Fazer Login
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}