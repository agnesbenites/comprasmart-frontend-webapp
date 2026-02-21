import React, { useState } from 'react';
import { FaMagic, FaCheck, FaTimes, FaSync, FaRobot, FaInfoCircle, FaLightbulb } from 'react-icons/fa';
import axios from 'axios';

const DescricaoInteligente = ({ value, onChange, nomeProduto, categoria, tags }) => {
  const [loading, setLoading] = useState(false);
  const [sugestao, setSugestao] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const gerarComGrok = async () => {
    if (!nomeProduto || nomeProduto.length < 3) {
      alert("⚠️ Digite um nome de produto válido para a IA trabalhar.");
      return;
    }

    setLoading(true);
    try {
      // CORREÇÃO DAS TAGS: Converte array de objetos ou strings para texto simples
      const tagsLimpas = Array.isArray(tags) 
        ? tags.map(t => typeof t === 'object' ? t.label : t).join(", ") 
        : (tags || "");

      const response = await axios.post(
        'https://api.x.ai/v1/chat/completions',
        {
          model: "grok-beta",
          messages: [
            { 
              role: "system", 
              content: "Você é um redator de e-commerce profissional. Gere descrições técnicas e persuasivas em Português Brasil. Foco em detalhes que ajudam consultores de vendas." 
            },
            { 
              role: "user", 
              content: `Produto: ${nomeProduto}. Categoria: ${categoria}. Atributos: ${tagsLimpas}. Gere uma descrição rica.` 
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_XAI_API_KEY}`
          }
        }
      );

      setSugestao(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Erro na API Grok:", error.response?.data || error.message);
      alert("Erro ao conectar com a IA. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* CARD DE IMPORTÂNCIA (SUSPENSO/DESTAQUE) */}
      <div style={{
        backgroundColor: '#fffbeb',
        borderLeft: '4px solid #f59e0b',
        padding: '16px',
        borderRadius: '8px',
        display: 'flex',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <FaLightbulb style={{ color: '#f59e0b', fontSize: '24px', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: '13.5px', color: '#92400e', lineHeight: '1.5' }}>
          <strong>Dica Estratégica:</strong> Lembre-se que os consultores não têm acesso direto ao produto, 
          e muitas vezes o cliente também não. Boa parte de convencer alguém de comprar o seu produto 
          está nos detalhes, principalmente na <strong>descrição detalhada</strong>.
        </p>
      </div>

      {/* CAMPO DE TEXTO E BOTÃO IA */}
      <div style={{
        position: 'relative',
        borderRadius: '12px',
        border: isFocused ? '2px solid #2f0d51' : '1px solid #e2e8f0',
        backgroundColor: '#fff',
        transition: 'all 0.2s'
      }}>
        <div style={{
          padding: '10px 15px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>DESCRIÇÃO TÉCNICA</span>
          <button
            type="button"
            onClick={gerarComGrok}
            disabled={loading}
            style={{
              backgroundColor: '#0f172a',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {loading ? <FaSync className="fa-spin" /> : <FaRobot color="#60a5fa" />}
            {loading ? "Criando..." : "Gerar com Grok"}
          </button>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Descreva as características, benefícios e diferenciais do produto..."
          style={{
            width: '100%',
            minHeight: '130px',
            padding: '15px',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#1e293b'
          }}
        />
      </div>

      {/* CARD DE SUGESTÃO DA IA */}
      {sugestao && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px',
          padding: '15px',
          animation: 'fadeIn 0.3s'
        }}>
          <div style={{ fontSize: '13px', color: '#0369a1', fontWeight: '700', marginBottom: '8px' }}>SUGESTÃO GERADA:</div>
          <p style={{ fontSize: '13px', color: '#334155', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{sugestao}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => { onChange(sugestao); setSugestao(''); }}
              style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 15px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
            >
              <FaCheck style={{ marginRight: '5px' }} /> Aplicar
            </button>
            <button
              type="button"
              onClick={() => setSugestao('')}
              style={{ background: 'none', color: '#64748b', border: '1px solid #cbd5e1', padding: '6px 15px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
            >
              Descartar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescricaoInteligente;