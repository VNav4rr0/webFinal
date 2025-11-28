import React, { useState, useEffect } from 'react';
import { 
  IoAdd, 
  IoPencil, 
  IoTrash, 
  IoCalendarOutline, 
  IoShieldHalf,
  IoStatsChart,
  IoCheckmarkCircle,
  IoClose,
  IoSearchOutline,
  IoLogOutOutline,
  IoWarningOutline // Novo ícone para o alerta
} from 'react-icons/io5';

import './styles/AdminDashboard.css'; 

// --- TIPAGEM ---
interface Match {
  id: number;
  timeA: string;
  timeB: string;
  dataHora: string;
  status: 'ABERTA' | 'ENCERRADA';
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

// --- COMPONENTES AUXILIARES ---
const Navbar: React.FC = () => (
  <nav className="admin-navbar glass-nav">
    <div className="navbar-content">
      <div className="navbar-brand">
        <div className="brand-icon">🛡️</div>
        <span>BolãoSky <small>Admin</small></span>
      </div>
      <div className="navbar-actions">
        <div className="admin-profile">
            <div className="avatar">AD</div>
            <span>Administrador</span>
        </div>
        <button className="btn-logout"><IoLogOutOutline size={20}/></button>
      </div>
    </div>
  </nav>
);

const Toast: React.FC<{ notification: Notification | null, onClose: () => void }> = ({ notification, onClose }) => {
    if (!notification) return null;
    return (
        <div className={`toast-notification ${notification.type}`}>
            <div className="toast-content">
                {notification.type === 'success' ? <IoCheckmarkCircle size={22} /> : <IoClose size={22} />}
                <span>{notification.message}</span>
            </div>
            <button onClick={onClose} className="toast-close"><IoClose size={18}/></button>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

const AdminDashboard: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([
        { id: 1, timeA: 'Flamengo', timeB: 'Vasco', dataHora: '2025-11-20T16:00', status: 'ABERTA' },
        { id: 2, timeA: 'Corinthians', timeB: 'Palmeiras', dataHora: '2025-11-21T18:30', status: 'ENCERRADA' },
        { id: 3, timeA: 'São Paulo', timeB: 'Santos', dataHora: '2025-11-22T21:00', status: 'ABERTA' }
    ]);

    // Modais
    const [showModal, setShowModal] = useState(false);
    const [matchToDelete, setMatchToDelete] = useState<Match | null>(null); // Novo estado para deletar

    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ timeA: '', timeB: '', dataHora: '' });
    const [notification, setNotification] = useState<Notification | null>(null);

    // Auto-hide notificação
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
    };

    // --- ACTIONS ---

    const openModal = (match?: Match) => {
        if (match) {
            setFormData({ timeA: match.timeA, timeB: match.timeB, dataHora: match.dataHora });
            setEditingId(match.id);
        } else {
            setFormData({ timeA: '', timeB: '', dataHora: '' });
            setEditingId(null);
        }
        setShowModal(true);
    };

    // Abre o modal de confirmação
    const requestDelete = (match: Match) => {
        setMatchToDelete(match);
    };

    // Executa a exclusão
    const confirmDelete = () => {
        if (matchToDelete) {
            setMatches(prev => prev.filter(m => m.id !== matchToDelete.id));
            showToast('Partida removida com sucesso.', 'success');
            setMatchToDelete(null); // Fecha o modal
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setMatches(prev => prev.map(m => m.id === editingId ? { ...m, ...formData } : m));
            showToast('Partida atualizada!');
        } else {
            const newMatch: Match = { id: Date.now(), status: 'ABERTA', ...formData };
            setMatches(prev => [...prev, newMatch]);
            showToast('Nova partida criada!');
        }
        setShowModal(false);
    };

    const stats = {
        total: matches.length,
        abertas: matches.filter(m => m.status === 'ABERTA').length,
        encerradas: matches.filter(m => m.status === 'ENCERRADA').length
    };

    return (
        <div className="admin-wrapper">
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>

            <Navbar />
            <Toast notification={notification} onClose={() => setNotification(null)} />

            <main className="admin-container">
                {/* HEADER COM STATS */}
                <header className="admin-header">
                    <div className="header-title">
                        <h1>Gerenciar Partidas</h1>
                        <p>Controle total do campeonato</p>
                    </div>
                    
                    <div className="stats-grid">
                        <div className="stat-card glass-light">
                            <div className="stat-icon blue"><IoShieldHalf /></div>
                            <div>
                                <h3>{stats.total}</h3>
                                <span>Total</span>
                            </div>
                        </div>
                        <div className="stat-card glass-light">
                            <div className="stat-icon green"><IoCalendarOutline /></div>
                            <div>
                                <h3>{stats.abertas}</h3>
                                <span>Abertas</span>
                            </div>
                        </div>
                        <div className="stat-card glass-light">
                            <div className="stat-icon purple"><IoStatsChart /></div>
                            <div>
                                <h3>{stats.encerradas}</h3>
                                <span>Finalizadas</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* TABELA DE AÇÕES */}
                <section className="matches-section glass-light">
                    <div className="section-toolbar">
                        <div className="search-box">
                            <IoSearchOutline className="search-icon" />
                            <input type="text" placeholder="Buscar time..." />
                        </div>
                        <button className="btn-primary" onClick={() => openModal()}>
                            <IoAdd size={20} /> Nova Partida
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Mandante</th>
                                    <th></th>
                                    <th>Visitante</th>
                                    <th>Data / Hora</th>
                                    <th style={{textAlign: 'right'}}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map(match => (
                                    <tr key={match.id} className="match-row">
                                        <td>
                                            <span className={`status-badge ${match.status.toLowerCase()}`}>
                                                {match.status}
                                            </span>
                                        </td>
                                        <td className="team-cell right"><strong>{match.timeA}</strong></td>
                                        <td className="vs-cell">x</td>
                                        <td className="team-cell left"><strong>{match.timeB}</strong></td>
                                        <td className="date-cell">
                                            {new Date(match.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                        <td className="actions-cell">
                                            <button className="action-btn edit" onClick={() => openModal(match)} title="Editar">
                                                <IoPencil size={16} />
                                            </button>
                                            <button 
                                                className="action-btn delete" 
                                                onClick={() => requestDelete(match)} 
                                                title="Excluir"
                                            >
                                                <IoTrash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* MODAL DE EDIÇÃO/CRIAÇÃO */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-glass" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Editar Jogo' : 'Novo Jogo'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}><IoClose size={24}/></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="match-inputs">
                                <div className="input-group">
                                    <label>Mandante</label>
                                    <input type="text" value={formData.timeA} onChange={e => setFormData({...formData, timeA: e.target.value})} required />
                                </div>
                                <div className="vs-divider">VS</div>
                                <div className="input-group">
                                    <label>Visitante</label>
                                    <input type="text" value={formData.timeB} onChange={e => setFormData({...formData, timeB: e.target.value})} required />
                                </div>
                            </div>
                            <div className="input-group full">
                                <label>Data e Horário</label>
                                <input type="datetime-local" value={formData.dataHora} onChange={e => setFormData({...formData, dataHora: e.target.value})} required />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary">Salvar Dados</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE EXCLUSÃO (DANGER ZONE) */}
            {matchToDelete && (
                <div className="modal-overlay" onClick={() => setMatchToDelete(null)}>
                    <div className="modal-glass danger-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon-danger">
                            <IoWarningOutline size={40} />
                        </div>
                        <div className="modal-body-center">
                            <h2>Excluir Partida?</h2>
                            <p>
                                Você está prestes a remover <strong>{matchToDelete.timeA} vs {matchToDelete.timeB}</strong>.
                                <br />
                                Essa ação não pode ser desfeita.
                            </p>
                        </div>
                        <div className="modal-footer center">
                            <button type="button" className="btn-secondary" onClick={() => setMatchToDelete(null)}>
                                Cancelar
                            </button>
                            <button type="button" className="btn-danger" onClick={confirmDelete}>
                                Sim, Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;