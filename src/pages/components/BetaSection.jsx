// src/pages/components/BetaSection.jsx
// Seção de beta testers para a Landing Page
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Storefront, UserCircle, ArrowRight, Newspaper, CalendarBlank } from '@phosphor-icons/react';

const PRIMARY = '#2f0d51';
const ACCENT = '#bb25a6';

const FORM_LOJISTA = 'https://forms.office.com/r/cb1fKfHX25';
const FORM_CONSULTOR = 'https://forms.office.com/r/7KuKzZkZvp';

/* ══════ SEÇÃO BETA ══════ */
export const BetaSection = () => {
  const [hovered, setHovered] = React.useState(null);

  const cards = [
    {
      id: 'lojista',
      icon: <Storefront size={36} weight="duotone" color={ACCENT} />,
      titulo: 'Sou Lojista',
      desc: 'Cadastre sua loja gratuitamente e teste a plataforma com consultores reais durante o beta.',
      beneficios: ['Sem taxa de setup', 'Acesso completo durante o beta', 'Suporte prioritário', 'Feedback direto com a fundadora'],
      cta: 'Quero ser Beta Tester',
      link: FORM_LOJISTA,
      bg: `linear-gradient(135deg, ${PRIMARY}, #4a1a7a)`,
      badge: '🏪 Para Lojistas',
    },
    {
      id: 'consultor',
      icon: <UserCircle size={36} weight="duotone" color={ACCENT} />,
      titulo: 'Sou Consultor',
      desc: 'Acesse lojas parceiras, construa sua carteira de clientes e ganhe comissão desde o primeiro atendimento.',
      beneficios: ['Primeiras comissões garantidas', 'Treinamentos exclusivos', 'Badge de Beta Consultor', 'Comunidade fechada'],
      cta: 'Quero ser Beta Consultor',
      link: FORM_CONSULTOR,
      bg: `linear-gradient(135deg, #7b1fa2, ${ACCENT})`,
      badge: '🎯 Para Consultores',
    },
  ];

  return (
    <section style={{ background: 'linear-gradient(160deg, #f3e8ff 0%, #fce7f3 100%)', padding: '64px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ background: ACCENT, color: 'white', padding: '6px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
            🚀 Beta Aberto
          </span>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: PRIMARY, margin: '16px 0 8px' }}>
            Faça parte da primeira turma Kaslee
          </h2>
          <p style={{ fontSize: 17, color: '#666', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Estamos em beta e queremos parceiros reais para crescer juntos. Vagas limitadas.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
          {cards.map((card) => (
            <div
              key={card.id}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: card.bg,
                borderRadius: 24,
                padding: '36px 32px',
                color: 'white',
                transition: 'transform 0.3s, box-shadow 0.3s',
                transform: hovered === card.id ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hovered === card.id ? '0 20px 48px rgba(47,13,81,0.3)' : '0 8px 24px rgba(47,13,81,0.15)',
              }}
            >
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {card.badge}
              </span>

              <div style={{ margin: '20px 0 12px' }}>{card.icon}</div>
              <h3 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>{card.titulo}</h3>
              <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.7, marginBottom: 20 }}>{card.desc}</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {card.beneficios.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 8, opacity: 0.95 }}>
                    <span style={{ color: '#a8edbe', fontWeight: 700 }}>✓</span> {b}
                  </li>
                ))}
              </ul>

              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'white', color: PRIMARY, borderRadius: 50, padding: '14px 24px',
                  fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 15,
                  textDecoration: 'none', transition: 'all 0.25s',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                }}
              >
                {card.cta} <ArrowRight size={18} weight="bold" />
              </a>
            </div>
          ))}
        </div>

        {/* Counter */}
        <BetaCounter />
      </div>
    </section>
  );
};

const BetaCounter = () => {
  const [counts, setCounts] = useState({ lojistas: 0, consultores: 0 });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('beta_testers')
        .select('tipo');
      if (data) {
        setCounts({
          lojistas: data.filter(d => d.tipo === 'lojista').length,
          consultores: data.filter(d => d.tipo === 'consultor').length,
        });
      }
    };
    fetch();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 40, flexWrap: 'wrap' }}>
      {[
        { label: 'Lojistas inscritos', value: counts.lojistas, max: 50 },
        { label: 'Consultores inscritos', value: counts.consultores, max: 100 },
      ].map(({ label, value, max }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 6px' }}>{label}</p>
          <div style={{ background: '#e9d5ff', borderRadius: 20, height: 8, width: 180, overflow: 'hidden' }}>
            <div style={{ background: ACCENT, height: '100%', width: `${Math.min((value / max) * 100, 100)}%`, borderRadius: 20, transition: 'width 1s ease' }} />
          </div>
          <p style={{ fontSize: 13, color: PRIMARY, fontWeight: 700, margin: '4px 0 0' }}>{value} / {max} vagas</p>
        </div>
      ))}
    </div>
  );
};

/* ══════ SEÇÃO NOVIDADES / BLOG ══════ */
export const NovidadesSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, titulo, resumo, imagem_url, publicado_em')
        .eq('publicado', true)
        .order('publicado_em', { ascending: false })
        .limit(3);
      setPosts(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section style={{ padding: '64px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: PRIMARY, margin: 0 }}>
              Novidades
            </h2>
            <p style={{ color: '#888', fontSize: 15, margin: '4px 0 0' }}>Atualizações, dicas e bastidores da Kaslee</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PostCard = ({ post }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16, overflow: 'hidden', background: 'white',
        boxShadow: hovered ? '0 12px 32px rgba(47,13,81,0.12)' : '0 2px 12px rgba(0,0,0,0.07)',
        transition: 'all 0.3s', transform: hovered ? 'translateY(-4px)' : 'none',
        border: '1px solid #f0e8f8',
      }}
    >
      {post.imagem_url ? (
        <img src={post.imagem_url} alt={post.titulo} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: 180, background: 'linear-gradient(135deg,#f3e8ff,#fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Newspaper size={48} weight="duotone" color={ACCENT} />
        </div>
      )}
      <div style={{ padding: '20px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#aaa', marginBottom: 10 }}>
          <CalendarBlank size={13} />
          {post.publicado_em ? new Date(post.publicado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
        </div>
        <h3 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 17, fontWeight: 700, color: PRIMARY, margin: '0 0 8px', lineHeight: 1.4 }}>{post.titulo}</h3>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 }}>{post.resumo}</p>
      </div>
    </div>
  );
};

export default { BetaSection, NovidadesSection };
