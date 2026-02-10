// src/pages/ConsultorDashboard/components/StatusVendaConsultor.jsx
// VERSÃO SEM REACT-ICONS - USA EMOJIS

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../supabaseClient";

// Componente ProgressBar inline
const ProgressBar = ({ percentual, label, cor = "#2c5aa0" }) => (
  <div style={{ width: '100%', marginBottom: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280' }}>{percentual}%</span>
    </div>
    <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '10px' }}>
      <div 
        style={{ 
          height: '10px', 
          borderRadius: '9999px', 
          transition: 'all 0.7s', 
          width: `${percentual}%`, 
          backgroundColor: cor 
        }}
      ></div>
    </div>
  </div>
);

const StatusVendaConsultor = ({ consultorId }) => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animar, setAnimar] = useState(false);
  const channelRef = useRef(null);

  // Busca inicial do pedido ativo
  useEffect(() => {
    const buscarDados = async () => {
      if (!consultorId) {
        console.log("[StatusVenda] ConsultorId não fornecido");
        setLoading(false);
        return;
      }
      
      console.log("[StatusVenda] Buscando pedido para:", consultorId);
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("pedidos")
          .select("*")
          .eq("user_id", consultorId)
          .in("status_separacao", ["QR Code Gerado!", "Aguardando Separação", "Pronto para pagamento"])
          .order("data_pedido", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("[StatusVenda] Erro ao buscar pedido:", error);
          setPedido(null);
        } else {
          console.log("[StatusVenda] Pedido encontrado:", data);
          setPedido(data);
        }
      } catch (err) {
        console.error("[StatusVenda] Erro:", err);
        setPedido(null);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [consultorId]);

  // Realtime para detectar mudanças
  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (!pedido?.id) return;

    console.log("[StatusVenda] Iniciando realtime para pedido:", pedido.id);

    channelRef.current = supabase
      .channel(`pedido-${pedido.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'pedidos', 
          filter: `id=eq.${pedido.id}` 
        },
        (payload) => {
          console.log("[StatusVenda] Atualização recebida:", payload);
          // Detecta mudança no valor
          if (payload.new.valor_total !== payload.old.valor_total) {
            setAnimar(true);
            setTimeout(() => setAnimar(false), 3000);
          }
          setPedido(payload.new);
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        console.log("[StatusVenda] Removendo canal realtime");
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [pedido?.id]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔄</div>
        <p style={{ color: '#6b7280', fontWeight: '500' }}>Buscando venda ativa...</p>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '12px', border: '2px dashed #d1d5db' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
        <p style={{ color: '#4b5563', fontWeight: '600', marginBottom: '4px' }}>Nenhuma venda ativa</p>
        <p style={{ color: '#9ca3af', fontSize: '12px' }}>
          Quando um cliente iniciar um carrinho no App, os dados aparecerão aqui.
        </p>
      </div>
    );
  }

  const isPago = pedido.status_separacao === 'Pago/Cancelado' || pedido.status_separacao === 'Retirado pelo Cliente';
  const valorComissao = pedido.valor_comissao || ((pedido.valor_total || 0) * (pedido.percentual_comissao || 10) / 100);
  const comissaoAnterior = pedido.comissao_anterior || valorComissao;

  return (
    <div 
      style={{ 
        padding: '24px', 
        borderRadius: '12px', 
        backgroundColor: 'white', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        border: animar ? '2px solid #10b981' : '2px solid transparent',
        transition: 'all 0.5s',
        transform: animar ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Pedido #{pedido.id.substring(0, 8)}
        </span>
        <span 
          style={{ 
            padding: '4px 12px', 
            borderRadius: '9999px', 
            fontSize: '10px', 
            fontWeight: '900',
            backgroundColor: isPago ? '#10b981' : '#2f0d51',
            color: 'white'
          }}
        >
          {isPago ? '✓ FINALIZADO' : '● CLIENTE NO APP'}
        </span>
      </div>

      {/* Progress Bar */}
      <ProgressBar 
        percentual={isPago ? 100 : 40} 
        label={pedido.status_separacao || "EM ANDAMENTO"} 
        cor={isPago ? "#10b981" : "#2c5aa0"} 
      />

      {/* Valores da Venda */}
      <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '16px', marginBottom: '12px' }}>
        <p style={{ fontSize: '9px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Valor da Venda</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '9px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold' }}>Anterior</p>
            <p style={{ color: '#9ca3af', textDecoration: 'line-through', fontSize: '14px' }}>
              R$ {(pedido.valor_anterior || pedido.valor_total || 0).toFixed(2)}
            </p>
          </div>
          <div style={{ fontSize: '20px', color: animar ? '#10b981' : '#d1d5db', transform: animar ? 'scale(1.25)' : 'scale(1)', transition: 'all 0.3s' }}>
            →
          </div>
          <div>
            <p style={{ fontSize: '9px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold' }}>Atual</p>
            <p style={{ fontSize: '20px', fontWeight: '900', color: '#1e3a8a' }}>
              R$ {(pedido.valor_total || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Comissão do Consultor */}
      <div style={{ backgroundColor: '#ecfdf5', padding: '16px', borderRadius: '8px', border: '2px solid #a7f3d0' }}>
        <p style={{ fontSize: '9px', color: '#047857', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>
          💰 Sua Comissão ({pedido.percentual_comissao || 10}%)
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '9px', color: '#059669', textTransform: 'uppercase', fontWeight: 'bold' }}>Anterior</p>
            <p style={{ color: '#059669', textDecoration: 'line-through', fontSize: '14px' }}>
              R$ {comissaoAnterior.toFixed(2)}
            </p>
          </div>
          <div style={{ fontSize: '20px', color: animar ? '#059669' : '#a7f3d0', transform: animar ? 'scale(1.25)' : 'scale(1)', transition: 'all 0.3s' }}>
            →
          </div>
          <div>
            <p style={{ fontSize: '9px', color: '#059669', textTransform: 'uppercase', fontWeight: 'bold' }}>Atual</p>
            <p style={{ fontSize: '24px', fontWeight: '900', color: '#047857' }}>
              R$ {valorComissao.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Animação */}
      {animar && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '8px', 
          marginTop: '12px', 
          color: '#059669', 
          fontSize: '10px', 
          fontWeight: 'bold',
          animation: 'bounce 1s infinite'
        }}>
          <span style={{ animation: 'spin 1s linear infinite' }}>🔄</span> CARRINHO ATUALIZADO!
        </div>
      )}
    </div>
  );
};

export default StatusVendaConsultor;