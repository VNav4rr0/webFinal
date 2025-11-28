import React, { useState, useEffect, useMemo, useCallback } from 'react';
// IMPORTANTE: Imports do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Import CSS do Swiper (Obrigatório)
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import { 
  IoFootballOutline, 
  IoCalendarOutline, 
  IoCheckmarkCircle, 
  IoInformationCircleOutline,
  IoSaveOutline,
  IoTrophyOutline,
  IoCloseCircleOutline
} from 'react-icons/io5';

// Suas imagens
import futebol1Image from '../images/futebol1.png';
import futebol2Image from '../images/futebol2.png';
import futebol3Image from '../images/futebol3.png';

// Seu CSS customizado
import './styles/Dashboard.css'; 

// ==========================================
// 1. TIPAGEM E DADOS
// ==========================================

interface CarouselSlideData {
  id: number;
  image: string;
  title: string;
  caption: string;
}

export interface Palpite {
  placarTimeA: number;
  placarTimeB: number;
}

interface PalpiteInputState {
  placarTimeA: number | '';
  placarTimeB: number | '';
}

export interface Partida {
  id: string;
  timeA: string;
  timeB: string;
  dataHora: string;
  status: 'ABERTA' | 'ENCERRADA';
  meuPalpite?: Palpite;
  resultadoA?: number;
  resultadoB?: number;
  acertou?: boolean;
  pontosGanhos?: number;
}

type PalpitesEmEdicao = Record<string, PalpiteInputState>;

interface ToastNotification {
  message: string;
  type: 'success' | 'info' | 'error';
}

const carouselData: CarouselSlideData[] = [
  { 
    id: 1, 
    image: futebol1Image, 
    title: "Brasileirão 2025", 
    caption: "A rodada decisiva começou. Faça seus palpites!" 
  },
  { 
    id: 2, 
    image: futebol2Image, 
    title: "Dobre seus Pontos", 
    caption: "Acerte o placar exato e suba no ranking." 
  },
  { 
    id: 3, 
    image: futebol3Image, 
    title: "Comunidade VIP", 
    caption: "Entre no nosso grupo exclusivo do Telegram." 
  },
];

const mockPartidas: Partida[] = [
    { id: 'p1', timeA: 'Flamengo', timeB: 'Vasco', dataHora: '2025-11-20T21:30:00', status: 'ABERTA', meuPalpite: { placarTimeA: 2, placarTimeB: 1 } },
    { id: 'p2', timeA: 'Corinthians', timeB: 'São Paulo', dataHora: '2025-11-21T19:00:00', status: 'ABERTA' },
    { id: 'p3', timeA: 'Palmeiras', timeB: 'Santos', dataHora: '2025-11-15T16:00:00', status: 'ENCERRADA', resultadoA: 1, resultadoB: 0, meuPalpite: { placarTimeA: 1, placarTimeB: 0 }, acertou: true, pontosGanhos: 1 },
    { id: 'p4', timeA: 'Grêmio', timeB: 'Inter', dataHora: '2025-11-16T18:00:00', status: 'ENCERRADA', resultadoA: 3, resultadoB: 2, meuPalpite: { placarTimeA: 0, placarTimeB: 1 }, acertou: false, pontosGanhos: 0 },
];

// ==========================================
// 2. COMPONENTES AUXILIARES
// ==========================================

const Navbar: React.FC = () => (
  <nav className="navbar glass-nav">
    <div className="navbar-content">
      <div className="navbar-brand">
        <div className="brand-icon"><IoFootballOutline size={24} /></div>
        <span>BolãoSky</span>
      </div>
      <div className="navbar-links">
        <a href="#regras" className="nav-link">Regras</a>
        <div className="user-profile-circle">JS</div>
      </div>
    </div>
  </nav>
);

const Footer: React.FC = () => (
  <footer className="footer-container">
    <p>© 2025 BolãoSky. Jogue com responsabilidade.</p>
  </footer>
);

const Toast: React.FC<ToastNotification & { onClose: () => void }> = ({ message, type, onClose }) => (
  <div className={`toast-notification ${type}`}>
    <div className="toast-content" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {type === 'success' ? <IoCheckmarkCircle size={22} /> : <IoInformationCircleOutline size={22} />}
        <span>{message}</span>
    </div>
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
        <IoCloseCircleOutline size={22}/>
    </button>
  </div>
);

// ==========================================
// 3. CARROUSEL COM SWIPER (O EXEMPLO DA INTERNET)
// ==========================================

const HeroCarousel: React.FC = () => {
  return (
    <div className="carousel-centering-wrapper">
      <div className="carousel-container-swiper">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          effect={'fade'} // Efeito de transição suave
          speed={800}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // Pausa quando passa o mouse
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          className="mySwiper"
        >
          {carouselData.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="swiper-slide-content">
                {/* Imagem de Fundo */}
                <img src={slide.image} alt={slide.title} className="swiper-bg-image" />
                
                {/* Overlay de Texto (Glass) */}
                <div className="swiper-overlay-wrapper">
                  <div className="glass-badge">
                    <h2>{slide.title}</h2>
                    <p>{slide.caption}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

// ==========================================
// 4. CARD DE PARTIDA
// ==========================================

const PartidaCard: React.FC<any> = ({ partida, palpitesEmEdicao, setPalpitesEmEdicao, onSalvarPalpite }) => {
  // Lógica simplificada para o exemplo
  const palpiteAtual = palpitesEmEdicao?.[partida.id] || { 
    placarTimeA: partida.meuPalpite?.placarTimeA ?? '', 
    placarTimeB: partida.meuPalpite?.placarTimeB ?? '' 
  };

  const isEditable = partida.status === 'ABERTA';
  
  const handleChange = (campo: string, val: string) => {
    if(!setPalpitesEmEdicao) return;
    setPalpitesEmEdicao((prev: any) => ({
      ...prev, [partida.id]: { ...palpiteAtual, [campo]: val === '' ? '' : Number(val) }
    }));
  };

  return (
    <div className={`match-card glass-light ${partida.status === 'ENCERRADA' ? (partida.acertou ? 'status-win' : 'status-lose') : ''}`}>
      <div className="match-header">
        <div className="match-date"><IoCalendarOutline /> {new Date(partida.dataHora).toLocaleDateString('pt-BR')}</div>
        {partida.status === 'ENCERRADA' && <div className={`match-badge ${partida.acertou ? 'badge-win' : 'badge-lose'}`}>{partida.acertou ? 'ACERTOU' : 'ERROU'}</div>}
      </div>
      <div className="match-content">
        <div className="team-block">{partida.timeA}</div>
        <div className="scoreboard-area">
          {isEditable ? (
            <>
              <input type="number" className="score-input" value={palpiteAtual.placarTimeA} onChange={e => handleChange('placarTimeA', e.target.value)} />
              <span className="versus">X</span>
              <input type="number" className="score-input" value={palpiteAtual.placarTimeB} onChange={e => handleChange('placarTimeB', e.target.value)} />
            </>
          ) : (
            <div className="final-score-display">
              <span className="score-number">{partida.meuPalpite?.placarTimeA ?? 0}</span>
              <span className="versus-small">SEU PALPITE</span>
              <span className="score-number">{partida.meuPalpite?.placarTimeB ?? 0}</span>
            </div>
          )}
        </div>
        <div className="team-block">{partida.timeB}</div>
      </div>
      <div className="match-footer">
        {isEditable ? (
          <button className="btn-save" onClick={() => onSalvarPalpite(partida.id, palpiteAtual)}><IoSaveOutline /> Salvar</button>
        ) : (
          <div className="real-result">Resultado: <strong>{partida.resultadoA} x {partida.resultadoB}</strong></div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. DASHBOARD
// ==========================================

const Dashboard: React.FC = () => {
    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [loading, setLoading] = useState(true);
    const [palpitesEmEdicao, setPalpitesEmEdicao] = useState<PalpitesEmEdicao>({});
    const [toast, setToast] = useState<ToastNotification | null>(null);

    useEffect(() => {
        setTimeout(() => { setPartidas(mockPartidas); setLoading(false); }, 800);
    }, []);

    const handleSalvar = (id: string, p: Palpite) => {
        setPartidas(prev => prev.map(pt => pt.id === id ? { ...pt, meuPalpite: p } : pt));
        setToast({ message: "Salvo com sucesso!", type: 'success' });
        setTimeout(() => setToast(null), 3000);
    };

    if (loading) return <div className="loading-screen">Carregando...</div>;

    const abertas = partidas.filter(p => p.status === 'ABERTA');
    const encerradas = partidas.filter(p => p.status === 'ENCERRADA');

    return (
        <div className="dashboard-wrapper">
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <Navbar />
            
            <main className="main-content">
                {/* Aqui entra o Swiper Profissional */}
                <HeroCarousel /> 

                <div className="content-container">
                    <section className="section-block">
                        <div className="section-header"><h2><IoFootballOutline /> Próximos Jogos</h2></div>
                        <div className="matches-grid">
                            {abertas.map(p => <PartidaCard key={p.id} partida={p} palpitesEmEdicao={palpitesEmEdicao} setPalpitesEmEdicao={setPalpitesEmEdicao} onSalvarPalpite={handleSalvar} />)}
                        </div>
                    </section>
                    <section className="section-block">
                         <div className="section-header"><h2><IoTrophyOutline /> Seus Resultados</h2></div>
                        <div className="matches-grid">
                            {encerradas.map(p => <PartidaCard key={p.id} partida={p} />)}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default Dashboard;