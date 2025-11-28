import React from "react";
import { Trophy, Medal, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

// -------------------------------------------------------------------------
// PARA O SEU PROJETO LOCAL:
// Descomente a linha abaixo para importar o CSS que você salvou anteriormente
// import "./styles/Ranking.css"; 
// -------------------------------------------------------------------------

// Interface para tipar os dados do usuário
interface RankingUser {
  id: number;
  name: string;
  points: number;
}

// Dados Fictícios (Mock Data) tipados
const MOCK_USERS: RankingUser[] = [
  { id: 1, name: "Lucas Silva", points: 2450 },
  { id: 2, name: "Ana Beatriz", points: 2320 },
  { id: 3, name: "Carlos Eduardo", points: 2100 },
  { id: 4, name: "Mariana Costa", points: 1950 },
  { id: 5, name: "Roberto Dias", points: 1800 },
  { id: 6, name: "Julia Nogueira", points: 1650 },
  { id: 99, name: "Você (Atleta)", points: 1540 }, // Usuário Logado
  { id: 8, name: "Fernando Souza", points: 1200 },
];

export default function Ranking() {
  const currentUserId = 99; // ID do usuário logado para simular o destaque

  // Função para renderizar o ícone da posição
  const renderRank = (index: number) => {
    if (index === 0) return <Trophy className="rank-icon gold" size={24} />;
    if (index === 1) return <Medal className="rank-icon silver" size={24} />;
    if (index === 2) return <Medal className="rank-icon bronze" size={24} />;
    return <span className="rank-number">#{index + 1}</span>;
  };

  // Variantes de animação para o container e itens da lista
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Atraso entre a aparição de cada item
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="ranking-wrapper">
      {/* Background Decorativo Animado */}
      <motion.div
        className="bg-shape shape-blue"
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="bg-shape shape-purple"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      <div className="ranking-container">
        <motion.div
          className="ranking-card glass-light"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header Animado */}
          <header className="ranking-header">
            <motion.div
              className="header-icon-box"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Trophy size={28} />
            </motion.div>
            <div className="header-titles">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Ranking Geral
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Veja quem está liderando o campeonato
              </motion.p>
            </div>
          </header>

          {/* Tabela */}
          <div className="table-responsive">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th style={{ width: "15%", textAlign: "center" }}>Posição</th>
                  <th style={{ width: "60%", textAlign: "left" }}>Atleta</th>
                  <th style={{ width: "25%", textAlign: "right" }}>Pontos</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {MOCK_USERS.map((user, index) => {
                  const isCurrentUser = user.id === currentUserId;
                  
                  return (
                    <motion.tr
                      key={user.id}
                      variants={itemVariants}
                      className={isCurrentUser ? "row-highlight" : ""}
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{ cursor: "default" }}
                    >
                      <td className="col-rank">
                        {renderRank(index)}
                      </td>
                      
                      <td className="col-user">
                        <div className="user-info">
                          <UserCircle size={32} className="user-avatar" />
                          <span className="user-name">
                            {user.name} 
                            {isCurrentUser && (
                              <motion.span 
                                className="badge-you" 
                                initial={{ scale: 0.8 }} 
                                animate={{ scale: 1 }} 
                                transition={{ 
                                  repeat: Infinity, 
                                  repeatType: "reverse", 
                                  duration: 0.8 
                                }}
                              >
                                Você
                              </motion.span>
                            )}
                          </span>
                        </div>
                      </td>
                      
                      <td className="col-points">
                        {user.points.toLocaleString()}
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>

        </motion.div>
      </div>
    </div>
  );
}