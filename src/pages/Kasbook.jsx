import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { supabase } from '../supabaseClient';
import ModalDia from '../components/ModalDia';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const KasBook = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para cada funcionalidade
  const [eventos, setEventos] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [orcamento, setOrcamento] = useState({ entradas: [], saidas: [] });
  
  // Estados para IA
  const [analiseIA, setAnaliseIA] = useState(null);
  const [loadingIA, setLoadingIA] = useState(false);
  
  // Estado para controlar categoria de dicas
  const [categoriaDica, setCategoriaDica] = useState('marketing');
  const [dicaExpandida, setDicaExpandida] = useState(null);
  
  // Estados para modais
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [showDespesaModal, setShowDespesaModal] = useState(false);
  const [showTarefaModal, setShowTarefaModal] = useState(false);
  const [showModalDia, setShowModalDia] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(2026);

  // Feriados nacionais brasileiros 2026
  const feriados = {
    '2026-01-01': 'Ano Novo',
    '2026-02-16': 'Carnaval',
    '2026-02-17': 'Carnaval',
    '2026-04-03': 'Sexta-feira Santa',
    '2026-04-21': 'Tiradentes',
    '2026-05-01': 'Dia do Trabalho',
    '2026-06-04': 'Corpus Christi',
    '2026-09-07': 'Independência',
    '2026-10-12': 'Nossa Senhora Aparecida',
    '2026-11-02': 'Finados',
    '2026-11-15': 'Proclamação da República',
    '2026-12-25': 'Natal'
  };

  const colors = {
    purple: '#2F0D51',
    pink: '#BB25A6',
    red: '#F53342',
    text: isDark ? '#EEE' : '#333',
    bg: isDark ? '#1A1E29' : '#FAFAFA',
    card: isDark ? '#2B2F38' : '#FFF'
  };

  const logoKaslee = "/img/Logo_Institucional_escura.png";
  const logoBag = "/img/Logo Bag.png";

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await carregarDados(session.user.id);
    }
    setLoading(false);
  };

  const carregarDados = async (userId) => {
    await Promise.all([
      carregarEventos(userId),
      carregarDespesas(userId),
      carregarTarefas(userId),
      carregarOrcamento(userId)
    ]);
  };

  const carregarEventos = async (userId) => {
    const { data, error } = await supabase
      .from('kasbook_eventos')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: true });
    
    if (data) setEventos(data);
  };

  const carregarDespesas = async (userId) => {
    const { data, error } = await supabase
      .from('kasbook_despesas')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });
    
    if (data) setDespesas(data);
  };

  const carregarTarefas = async (userId) => {
    const { data, error } = await supabase
      .from('kasbook_tarefas')
      .select('*')
      .eq('user_id', userId)
      .order('prioridade', { ascending: false });
    
    if (data) setTarefas(data);
  };

  const carregarOrcamento = async (userId) => {
    const { data, error } = await supabase
      .from('kasbook_financeiro')
      .select('*')
      .eq('user_id', userId);
    
    if (data) {
      const entradas = data.filter(item => item.tipo === 'entrada');
      const saidas = data.filter(item => item.tipo === 'saida');
      setOrcamento({ entradas, saidas });
    }
  };

  // Funções de calendário
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const getEventosForDate = (date) => {
    return eventos.filter(e => e.data === date);
  };

  const isFeriado = (date) => {
    return feriados[date];
  };

  // CRUD Eventos
  const salvarEvento = async (eventoData) => {
    if (!user) return;

    const evento = {
      ...eventoData,
      user_id: user.id
    };

    if (eventoSelecionado) {
      const { error } = await supabase
        .from('kasbook_eventos')
        .update(evento)
        .eq('id', eventoSelecionado.id);
    } else {
      const { error } = await supabase
        .from('kasbook_eventos')
        .insert([evento]);
    }

    setShowEventoModal(false);
    setEventoSelecionado(null);
    carregarEventos(user.id);
  };

  const excluirEvento = async (id) => {
    const { error } = await supabase
      .from('kasbook_eventos')
      .delete()
      .eq('id', id);
    
    carregarEventos(user.id);
  };

  // CRUD Despesas
  const salvarDespesa = async (despesaData) => {
    if (!user) return;

    const despesa = {
      ...despesaData,
      user_id: user.id
    };

    const { error } = await supabase
      .from('kasbook_despesas')
      .insert([despesa]);

    setShowDespesaModal(false);
    carregarDespesas(user.id);
  };

  const excluirDespesa = async (id) => {
    const { error } = await supabase
      .from('kasbook_despesas')
      .delete()
      .eq('id', id);
    
    carregarDespesas(user.id);
  };

  // CRUD Tarefas
  const salvarTarefa = async (tarefaData) => {
    if (!user) return;

    const tarefa = {
      ...tarefaData,
      user_id: user.id
    };

    const { error } = await supabase
      .from('kasbook_tarefas')
      .insert([tarefa]);

    setShowTarefaModal(false);
    carregarTarefas(user.id);
  };

  const atualizarStatusTarefa = async (id, novoStatus) => {
    const { error } = await supabase
      .from('kasbook_tarefas')
      .update({ status: novoStatus })
      .eq('id', id);
    
    carregarTarefas(user.id);
  };

  const excluirTarefa = async (id) => {
    const { error } = await supabase
      .from('kasbook_tarefas')
      .delete()
      .eq('id', id);
    
    carregarTarefas(user.id);
  };

  // Cálculos financeiros
  const calcularTotais = () => {
    const totalEntradas = orcamento.entradas.reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
    const totalSaidas = orcamento.saidas.reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
    const saldo = totalEntradas - totalSaidas;
    
    return { totalEntradas, totalSaidas, saldo };
  };

  const getDespesasPorCategoria = () => {
    const categorias = {};
    despesas.forEach(d => {
      if (!categorias[d.categoria]) {
        categorias[d.categoria] = 0;
      }
      categorias[d.categoria] += parseFloat(d.valor || 0);
    });
    return categorias;
  };

  const getOrcamentoPorMes = () => {
    const meses = {};
    
    orcamento.entradas.forEach(item => {
      const mes = new Date(item.data).getMonth();
      if (!meses[mes]) meses[mes] = { entradas: 0, saidas: 0 };
      meses[mes].entradas += parseFloat(item.valor || 0);
    });

    orcamento.saidas.forEach(item => {
      const mes = new Date(item.data).getMonth();
      if (!meses[mes]) meses[mes] = { entradas: 0, saidas: 0 };
      meses[mes].saidas += parseFloat(item.valor || 0);
    });

    return meses;
  };

  // Renderização de componentes
  const renderCalendario = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '10px' }}></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(currentYear, currentMonth, day);
      const eventosData = getEventosForDate(date);
      const feriado = isFeriado(date);
      
      days.push(
        <div
          key={date}
          onClick={() => {
            setDataSelecionada(date);
            setShowModalDia(true);
          }}
          style={{
            padding: '15px',
            border: `2px solid ${feriado ? colors.red : eventosData.length > 0 ? colors.pink : (isDark ? '#444' : '#eee')}`,
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: feriado 
              ? (isDark ? '#4a1a1a' : '#fff5f5') 
              : eventosData.length > 0 
                ? (isDark ? '#3a1a3a' : '#fff0fb') 
                : (isDark ? '#2a2a2a' : 'transparent'),
            minHeight: '80px',
            position: 'relative',
            transition: 'all 0.2s',
            color: isDark ? '#FFF' : colors.text
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: isDark ? '#FFF' : colors.text }}>{day}</div>
          {feriado && (
            <div style={{ fontSize: '10px', color: colors.red, fontWeight: 'bold' }}>
               {feriado}
            </div>
          )}
          {eventosData.map((evt, idx) => (
            <div
              key={evt.id}
              style={{
                fontSize: '9px',
                backgroundColor: getCategoriaColor(evt.categoria),
                color: '#FFF',
                padding: '2px 5px',
                borderRadius: '3px',
                marginTop: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {evt.titulo}
            </div>
          ))}
        </div>
      );
    }
    
    return days;
  };

  const getCategoriaColor = (categoria) => {
    const cores = {
      'promocao': colors.pink,
      'reuniao': colors.purple,
      'entrega': '#2ecc71',
      'pagamento': colors.red,
      'evento': '#3498db',
      'outro': '#95a5a6'
    };
    return cores[categoria] || cores.outro;
  };

  const renderDashboard = () => {
    const { totalEntradas, totalSaidas, saldo } = calcularTotais();
    const tarefasPendentes = tarefas.filter(t => t.status === 'pendente');
    const proximosEventos = eventos.slice(0, 5);

    return (
      <div>
        {/* Header com ilustração e gradiente */}
        <div style={{ 
          background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.pink} 100%)`,
          padding: '25px 30px',
          borderRadius: '15px',
          marginBottom: '30px',
          boxShadow: '0 8px 25px rgba(187, 37, 166, 0.3)',
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '12px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <img 
              src="/img/kasbook/analytics.png" 
              alt="Dashboard" 
              style={{ width: '60px', height: '60px' }}
            />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#FFF', fontSize: '28px', fontWeight: 'bold' }}>Dashboard</h2>
            <p style={{ margin: '5px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
              Visão geral do seu negócio
            </p>
          </div>
        </div>
        
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <KPICard 
            titulo="Total Entradas"
            valor={`R$ ${totalEntradas.toFixed(2)}`}
            cor="#2ecc71"
            isDark={isDark}
          />
          <KPICard 
            titulo="Total Saídas"
            valor={`R$ ${totalSaidas.toFixed(2)}`}
            cor={colors.red}
            isDark={isDark}
          />
          <KPICard 
            titulo="Saldo"
            valor={`R$ ${saldo.toFixed(2)}`}
            cor={saldo >= 0 ? '#2ecc71' : colors.red}
            isDark={isDark}
          />
          <KPICard 
            titulo="Tarefas Pendentes"
            valor={tarefasPendentes.length}
            cor={colors.pink}
            isDark={isDark}
          />
        </div>

        {/* Próximos Eventos e Tarefas Urgentes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: colors.purple, marginBottom: '15px' }}>Próximos Eventos</h3>
            {proximosEventos.length === 0 ? (
              <p style={{ color: '#999' }}>Nenhum evento agendado</p>
            ) : (
              proximosEventos.map(evt => (
                <div key={evt.id} style={{ padding: '10px', borderLeft: `4px solid ${getCategoriaColor(evt.categoria)}`, marginBottom: '10px', backgroundColor: isDark ? '#333' : '#f9f9f9', borderRadius: '5px' }}>
                  <div style={{ fontWeight: 'bold' }}>{evt.titulo}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(evt.data).toLocaleDateString('pt-BR')} - {evt.categoria}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: colors.purple, marginBottom: '15px' }}>Tarefas Urgentes</h3>
            {tarefasPendentes.length === 0 ? (
              <p style={{ color: '#999' }}>Nenhuma tarefa pendente</p>
            ) : (
              tarefasPendentes.slice(0, 5).map(tarefa => (
                <div key={tarefa.id} style={{ padding: '10px', borderLeft: `4px solid ${getPrioridadeColor(tarefa.prioridade)}`, marginBottom: '10px', backgroundColor: isDark ? '#333' : '#f9f9f9', borderRadius: '5px' }}>
                  <div style={{ fontWeight: 'bold' }}>{tarefa.titulo}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Prioridade: {tarefa.prioridade} | {tarefa.deadline ? new Date(tarefa.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const getPrioridadeColor = (prioridade) => {
    const cores = {
      'alta': colors.red,
      'media': '#f39c12',
      'baixa': '#2ecc71'
    };
    return cores[prioridade] || cores.baixa;
  };

  const renderAgenda = () => {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src="/img/kasbook/task.png" 
              alt="Agenda" 
              style={{ width: '60px', height: '60px' }}
            />
            <h2 style={{ color: colors.purple, margin: 0 }}>Calendário de Eventos {currentYear}</h2>
          </div>
          <button
            onClick={() => {
              setSelectedDate(null);
              setEventoSelecionado(null);
              setShowEventoModal(true);
            }}
            style={{
              backgroundColor: colors.pink,
              color: '#FFF',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '30px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            + Novo Evento
          </button>
        </div>

        <div style={{ backgroundColor: colors.card, padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => setCurrentMonth(m => m === 0 ? 11 : m - 1)}
              style={{ backgroundColor: colors.purple, color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ← Anterior
            </button>
            <h3 style={{ color: colors.pink, fontSize: '24px' }}>{meses[currentMonth]} {currentYear}</h3>
            <button
              onClick={() => setCurrentMonth(m => m === 11 ? 0 : m + 1)}
              style={{ backgroundColor: colors.purple, color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Próximo →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '10px' }}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, idx) => (
              <div key={`header-${idx}`} style={{ textAlign: 'center', fontWeight: 'bold', padding: '10px', color: isDark ? '#FFF' : colors.purple }}>
                {dia}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {renderCalendario()}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: colors.pink, borderRadius: '3px' }}></div>
              Promoção
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: colors.purple, borderRadius: '3px' }}></div>
              Reunião
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: '#2ecc71', borderRadius: '3px' }}></div>
              Entrega
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: colors.red, borderRadius: '3px' }}></div>
              Feriado/Pagamento
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDespesas = () => {
    const totalDespesas = despesas.reduce((acc, d) => acc + parseFloat(d.valor || 0), 0);

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src="/img/kasbook/documents.png" 
              alt="Despesas" 
              style={{ width: '60px', height: '60px' }}
            />
            <h2 style={{ color: colors.purple, margin: 0 }}>Rastreador de Despesas</h2>
          </div>
          <button
            onClick={() => setShowDespesaModal(true)}
            style={{
              backgroundColor: colors.pink,
              color: '#FFF',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '30px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            + Nova Despesa
          </button>
        </div>

        <div style={{ backgroundColor: colors.card, padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h3 style={{ color: colors.pink, marginBottom: '15px' }}>Total de Despesas: R$ {totalDespesas.toFixed(2)}</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: colors.purple, color: '#FFF' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Data</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Categoria</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Empresa</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Descrição</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Valor</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Nota</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {despesas.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      Nenhuma despesa registrada
                    </td>
                  </tr>
                ) : (
                  despesas.map((despesa, idx) => (
                    <tr key={despesa.id} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? (isDark ? '#333' : '#f9f9f9') : 'transparent' }}>
                      <td style={{ padding: '12px' }}>{new Date(despesa.data).toLocaleDateString('pt-BR')}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ backgroundColor: getCategoriaColorDespesa(despesa.categoria), color: '#FFF', padding: '4px 8px', borderRadius: '5px', fontSize: '11px' }}>
                          {despesa.categoria}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{despesa.empresa}</td>
                      <td style={{ padding: '12px' }}>{despesa.descricao}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: colors.red }}>
                        R$ {parseFloat(despesa.valor).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {despesa.nota_url ? (
                          <a href={despesa.nota_url} target="_blank" rel="noopener noreferrer" style={{ color: colors.pink }}>
                            📎 Ver
                          </a>
                        ) : (
                          <span style={{ color: '#ccc' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => excluirDespesa(despesa.id)}
                          style={{ backgroundColor: colors.red, color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px' }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const getCategoriaColorDespesa = (categoria) => {
    const cores = {
      'transporte': '#3498db',
      'hospedagem': '#9b59b6',
      'alimentacao': '#e67e22',
      'compras': colors.pink,
      'servicos': '#1abc9c',
      'outros': '#95a5a6'
    };
    return cores[categoria] || cores.outros;
  };

  const renderFinanceiro = () => {
    const dadosOrcamento = getOrcamentoPorMes();
    const despesasCategoria = getDespesasPorCategoria();
    
    const mesesLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const entradasData = mesesLabels.map((_, idx) => dadosOrcamento[idx]?.entradas || 0);
    const saidasData = mesesLabels.map((_, idx) => dadosOrcamento[idx]?.saidas || 0);

    const chartDataBar = {
      labels: mesesLabels,
      datasets: [
        {
          label: 'Entradas',
          data: entradasData,
          backgroundColor: '#2ecc71'
        },
        {
          label: 'Saídas',
          data: saidasData,
          backgroundColor: colors.red
        }
      ]
    };

    const chartDataPie = {
      labels: Object.keys(despesasCategoria),
      datasets: [
        {
          data: Object.values(despesasCategoria),
          backgroundColor: ['#3498db', '#9b59b6', '#e67e22', colors.pink, '#1abc9c', '#95a5a6']
        }
      ]
    };

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <img 
            src="/img/kasbook/pie-chart.png" 
            alt="Financeiro" 
            style={{ width: '70px', height: '70px' }}
          />
          <h2 style={{ color: colors.purple, margin: 0 }}>Controle de Orçamento</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: colors.card, padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '20px' }}>Entradas vs Saídas (2026)</h3>
            <Bar data={chartDataBar} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>

          <div style={{ backgroundColor: colors.card, padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '20px' }}>Despesas por Categoria</h3>
            {Object.keys(despesasCategoria).length > 0 ? (
              <Pie data={chartDataPie} options={{ responsive: true, maintainAspectRatio: true }} />
            ) : (
              <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>Nenhuma despesa registrada ainda</p>
            )}
          </div>
        </div>

        {/* Tabela resumo por mês */}
        <div style={{ backgroundColor: colors.card, padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '15px' }}>Resumo Mensal</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: colors.purple, color: '#FFF' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Mês</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Entradas</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Saídas</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {mesesLabels.map((mes, idx) => {
                  const entradas = dadosOrcamento[idx]?.entradas || 0;
                  const saidas = dadosOrcamento[idx]?.saidas || 0;
                  const saldo = entradas - saidas;
                  
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{mes}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#2ecc71' }}>R$ {entradas.toFixed(2)}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: colors.red }}>R$ {saidas.toFixed(2)}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: saldo >= 0 ? '#2ecc71' : colors.red }}>
                        R$ {saldo.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTarefas = () => {
    const tarefasPorStatus = {
      pendente: tarefas.filter(t => t.status === 'pendente'),
      andamento: tarefas.filter(t => t.status === 'andamento'),
      concluido: tarefas.filter(t => t.status === 'concluido')
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src="/img/kasbook/task.png" 
              alt="Tarefas" 
              style={{ width: '60px', height: '60px' }}
            />
            <h2 style={{ color: colors.purple, margin: 0 }}>Monitor de Tarefas</h2>
          </div>
          <button
            onClick={() => setShowTarefaModal(true)}
            style={{
              backgroundColor: colors.pink,
              color: '#FFF',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '30px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            + Nova Tarefa
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {Object.entries(tarefasPorStatus).map(([status, listaTarefas]) => (
            <div key={status} style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '15px', textTransform: 'capitalize', color: getStatusColor(status) }}>
                {status === 'pendente' ? 'Pendente' : status === 'andamento' ? 'Em Andamento' : 'Concluído'}
                <span style={{ marginLeft: '10px', fontSize: '14px', backgroundColor: getStatusColor(status), color: '#FFF', padding: '2px 8px', borderRadius: '10px' }}>
                  {listaTarefas.length}
                </span>
              </h3>
              
              {listaTarefas.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>Nenhuma tarefa</p>
              ) : (
                listaTarefas.map(tarefa => (
                  <div
                    key={tarefa.id}
                    style={{
                      backgroundColor: isDark ? '#333' : '#f9f9f9',
                      padding: '15px',
                      borderRadius: '10px',
                      marginBottom: '10px',
                      borderLeft: `4px solid ${getPrioridadeColor(tarefa.prioridade)}`
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{tarefa.titulo}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{tarefa.descricao}</div>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '10px' }}>
                      {tarefa.deadline && `${new Date(tarefa.deadline).toLocaleDateString('pt-BR')}`}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {status !== 'andamento' && (
                        <button
                          onClick={() => atualizarStatusTarefa(tarefa.id, 'andamento')}
                          style={{ fontSize: '10px', padding: '5px 10px', backgroundColor: '#f39c12', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                          Iniciar
                        </button>
                      )}
                      {status !== 'concluido' && (
                        <button
                          onClick={() => atualizarStatusTarefa(tarefa.id, 'concluido')}
                          style={{ fontSize: '10px', padding: '5px 10px', backgroundColor: '#2ecc71', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                          Concluir
                        </button>
                      )}
                      <button
                        onClick={() => excluirTarefa(tarefa.id)}
                        style={{ fontSize: '10px', padding: '5px 10px', backgroundColor: colors.red, color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    const cores = {
      'pendente': '#f39c12',
      'andamento': '#3498db',
      'concluido': '#2ecc71'
    };
    return cores[status];
  };

  const renderDicas = () => {
    const dicasPorCategoria = {
      marketing: {
        titulo: 'Marketing Digital para Pequenos Negócios',
        imagem: '/img/kasbook/email.png',
        dicas: [
          {
            titulo: 'Google Search Console - Apareça no Google GRÁTIS',
            descricao: 'Cadastre seu site no Google Search Console para aparecer nas buscas.',
            imagem: '/img/kasbook/infographic.png',
            passos: [
              '1. Acesse https://search.google.com/search-console/welcome',
              '2. Adicione a URL do seu site ou loja',
              '3. Verifique a propriedade (vários métodos disponíveis)',
              '4. Envie seu sitemap para indexação mais rápida',
              '5. Monitore quantas pessoas encontram você no Google'
            ],
            beneficio: 'Custo: R$ 0,00 | Tempo: 15 minutos | Resultado: Visibilidade orgânica',
            link: 'https://search.google.com/search-console/welcome'
          },
          {
            titulo: 'Gastos com Marketing - Quando Vale a Pena Investir?',
            descricao: 'Entenda quando começar a investir em anúncios pagos e quanto gastar.',
            imagem: '/img/kasbook/pie-chart.png',
            passos: [
              '1. Só comece a pagar anúncios quando vender +R$ 10k/mês organicamente',
              '2. Invista 10% do faturamento em marketing (R$ 10k = R$ 1k em ads)',
              '3. Teste primeiro: R$ 10/dia no Google ou Instagram por 7 dias',
              '4. Meça TUDO: quantas vendas vieram dos anúncios?',
              '5. Se 1 venda = R$ 50 lucro e anúncio custou R$ 70 = PARE'
            ],
            beneficio: 'Evita jogar dinheiro fora em anúncios sem retorno'
          },
          {
            titulo: 'Instagram e Facebook - Comece Orgânico',
            descricao: 'Não precisa pagar anúncios no início. Foque em conteúdo de qualidade.',
            imagem: '/img/kasbook/business.png',
            passos: [
              '1. Poste 3-5x por semana (consistência > quantidade)',
              '2. Use 15-20 hashtags relevantes (#lojalocal #nomebairro)',
              '3. Responda TODOS os comentários e mensagens',
              '4. Faça stories mostrando o dia a dia',
              '5. Marque a localização em todas as postagens'
            ],
            beneficio: 'Engajamento orgânico pode trazer 20-30 clientes/mês sem custo',
          }
        ]
      },
      vendas: {
        titulo: 'Técnicas de Vendas Simples e Eficazes',
        imagem: '/img/kasbook/pie-chart__2_.png',
        dicas: [
          {
            titulo: 'WhatsApp Business - Atendimento que Converte',
            descricao: 'Use o WhatsApp Business para parecer profissional e vender mais.',
            imagem: '/img/kasbook/ecommerce.png',
            passos: [
              '1. Baixe WhatsApp Business (versão empresarial GRÁTIS)',
              '2. Configure catálogo com fotos e preços dos produtos',
              '3. Crie mensagem de boas-vindas automática',
              '4. Responda em NO MÁXIMO 5 minutos (crucial!)',
              '5. Use etiquetas: "Interessado", "Comprou", "Seguir"'
            ],
            beneficio: 'Atendimento rápido aumenta conversão em 60%'
          },
          {
            titulo: 'Vendedor Excelente - Atendimento pelo Celular',
            descricao: 'Como atender bem usando apenas o celular e converter mais vendas.',
            imagem: '/img/kasbook/ecommerce__1_.png',
            passos: [
              '1. Responda com áudio personalizado (cliente sente proximidade)',
              '2. Envie fotos/vídeos do produto de ângulos diferentes',
              '3. Mostre o produto sendo usado (se possível)',
              '4. Ofereça entrega no mesmo dia se cliente estiver perto',
              '5. Facilite pagamento: Pix, link de pagamento, parcelamento'
            ],
            beneficio: 'Vendedor que usa celular bem vende 3x mais que loja física'
          },
          {
            titulo: 'Regra dos 3 Preços - Psicologia de Vendas',
            descricao: 'Sempre ofereça 3 opções de preço. Cliente raramente escolhe a mais barata.',
            passos: [
              '1. Opção Básica: R$ 30 (poucos compram)',
              '2. Opção Intermediária: R$ 50 (MAIORIA compra)',
              '3. Opção Premium: R$ 80 (valoriza as outras)',
              'Sempre destaque a intermediária como "Mais Vendido"'
            ],
            beneficio: 'Ticket médio aumenta 40% com esta técnica'
          },
          {
            titulo: 'Combos e Kits - Facilite a Decisão',
            descricao: 'Monte combos prontos com desconto.',
            passos: [
              'Kit Básico: 3 produtos por R$ 100',
              'Kit Família: 5 produtos por R$ 150',
              'Kit Presente: 2 produtos + embalagem',
              'Sempre mostre quanto economiza vs. compra separada'
            ],
            beneficio: 'Combos vendem 3x mais que produtos individuais'
          }
        ]
      },
      gestao: {
        titulo: 'Gestão Financeira Sem Complicação',
        imagem: '/img/kasbook/line-graph.png',
        dicas: [
          {
            titulo: 'Regra do 50/30/20 para Pequenos Negócios',
            descricao: 'Divida todo dinheiro que entra assim:',
            passos: [
              '50% → Custos fixos (aluguel, luz, estoque)',
              '30% → Seu pagamento/pró-labore',
              '20% → Reserva de emergência + investimentos'
            ],
            beneficio: 'Evita misturar dinheiro pessoal com da loja'
          },
          {
            titulo: 'Controle de Estoque Simples',
            descricao: 'Use planilha básica ou caderno mesmo',
            passos: [
              'Anote TODA entrada de mercadoria',
              'Anote TODA saída (venda)',
              'Faça contagem física 1x por semana',
              'Produtos parados > 60 dias = PROMOÇÃO',
              'Identifique os 10 produtos mais vendidos'
            ],
            beneficio: 'Evita faltar produto bom e sobrar produto ruim'
          },
          {
            titulo: 'Separe Dinheiro Pessoal x Loja',
            descricao: 'Erro #1 que quebra pequenos negócios',
            passos: [
              '1. Tenha conta bancária separada (pode ser digital grátis)',
              '2. Defina seu salário fixo (pró-labore)',
              '3. Só retire esse valor por mês',
              '4. Emergências pessoais → empréstimo para você mesmo',
              '5. Anote toda movimentação'
            ],
            beneficio: 'Você sabe SE está lucrando de verdade'
          }
        ]
      },
      ferramentas: {
        titulo: 'Ferramentas Gratuitas Essenciais',
        imagem: '/img/kasbook/bar-chart.png',
        dicas: [
          {
            titulo: 'Canva - Design Profissional GRÁTIS',
            descricao: 'Crie posts, stories, cardápios, panfletos',
            passos: [
              '1. Acesse canva.com',
              '2. Use templates prontos (milhares gratuitos)',
              '3. Customize com suas cores e logo',
              '4. Baixe em PNG ou PDF',
              '5. Versão grátis já resolve 90% das necessidades'
            ],
            beneficio: 'R$ 0,00 | Parece que você tem designer',
            link: 'https://canva.com'
          },
          {
            titulo: 'Google Sheets - Controle Financeiro',
            descricao: 'Planilhas online, acesse de qualquer lugar',
            passos: [
              'Crie planilhas de: Vendas, Estoque, Fluxo de Caixa',
              'Acesse do celular ou computador',
              'Compartilhe com sócio/contador',
              'Use fórmulas simples (SOMA, MÉDIA)',
              'Backup automático na nuvem'
            ],
            beneficio: 'R$ 0,00 | Melhor que caderno físico',
            link: 'https://sheets.google.com'
          }
        ]
      }
    };

    const categorias = Object.keys(dicasPorCategoria);
    const dicaAtual = dicasPorCategoria[categoriaDica];

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <img 
            src="/img/kasbook/design-software.png" 
            alt="Estratégias" 
            style={{ width: '50px', height: '50px' }}
          />
          <h2 style={{ color: colors.purple, margin: 0 }}>Estratégias de Crescimento</h2>
        </div>
        
        <div style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginBottom: '15px' }}>
            <strong>Para quem está começando:</strong> Essas são dicas testadas e aprovadas por milhares de pequenos comerciantes. 
            Tudo aqui é GRÁTIS ou de baixo custo. Comece por 1-2 dicas por semana, não tente fazer tudo de uma vez!
          </p>

          {/* Seletor de Categorias */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaDica(cat)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '25px',
                  border: `2px solid ${categoriaDica === cat ? colors.pink : '#ddd'}`,
                  backgroundColor: categoriaDica === cat ? colors.pink : 'transparent',
                  color: categoriaDica === cat ? '#FFF' : colors.text,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                {dicasPorCategoria[cat].titulo}
              </button>
            ))}
          </div>
        </div>

        {/* Dicas da Categoria Selecionada */}
        <div>
          {/* Header com ilustração */}
          <div style={{ 
            background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.pink} 100%)`,
            padding: '30px', 
            borderRadius: '15px', 
            marginBottom: '30px',
            boxShadow: '0 8px 25px rgba(187, 37, 166, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '25px'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '15px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <img 
                src={dicaAtual.imagem} 
                alt={dicaAtual.titulo}
                style={{ 
                  width: '80px', 
                  height: '80px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#FFF', marginBottom: '8px', fontSize: '26px', margin: 0, fontWeight: 'bold' }}>
                {dicaAtual.titulo}
              </h3>
              <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                Dicas práticas e testadas por milhares de pequenos comerciantes
              </p>
            </div>
          </div>

          {dicaAtual.dicas.map((dica, idx) => (
            <div
              key={idx}
              onClick={() => setDicaExpandida(dica)}
              style={{
                backgroundColor: colors.card,
                padding: '25px',
                borderRadius: '15px',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                borderLeft: `5px solid ${colors.pink}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Ilustração à ESQUERDA */}
              {dica.imagem && (
                <div style={{ 
                  flexShrink: 0,
                  padding: '15px',
                  backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                  borderRadius: '10px'
                }}>
                  <img 
                    src={dica.imagem} 
                    alt={dica.titulo}
                    style={{ 
                      width: '80px', 
                      height: '80px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}

              {/* Texto à DIREITA */}
              <div style={{ flex: 1 }}>
                <h4 style={{ color: colors.purple, marginBottom: '8px', fontSize: '18px', margin: 0 }}>
                  {idx + 1}. {dica.titulo}
                </h4>
                
                <p style={{ color: '#666', margin: '8px 0 0 0', lineHeight: '1.5', fontSize: '14px' }}>
                  {dica.descricao}
                </p>
                
                <div style={{ marginTop: '10px', fontSize: '12px', color: colors.pink, fontWeight: 'bold' }}>
                  Clique para ver detalhes →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer com incentivo */}
        <div style={{
          backgroundColor: colors.purple,
          color: '#FFF',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <img 
            src="/img/kasbook/business.png" 
            alt="Crescimento" 
            style={{ width: '60px', height: '60px', margin: '0 auto 15px' }}
          />
          <h3 style={{ marginBottom: '10px' }}>Lembre-se: Pequenos passos levam a grandes resultados!</h3>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Escolha 1-2 dicas desta semana, aplique, veja os resultados. 
            Depois volte e implemente mais. Consistência > Perfeição.
          </p>
        </div>

        {/* Modal de Detalhes da Estratégia */}
        {dicaExpandida && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2000,
              padding: '20px'
            }} 
            onClick={() => setDicaExpandida(null)}
          >
            <div 
              style={{
                backgroundColor: colors.card,
                borderRadius: '20px',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '40px',
                position: 'relative'
              }} 
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setDicaExpandida(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '30px',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ×
              </button>

              <h3 style={{ color: colors.purple, marginBottom: '15px', fontSize: '24px' }}>
                {dicaExpandida.titulo}
              </h3>
              
              <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.6', fontSize: '16px' }}>
                {dicaExpandida.descricao}
              </p>

              <div style={{ backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '15px', color: colors.purple, fontSize: '18px' }}>
                  Passo a passo:
                </div>
                {typeof dicaExpandida.passos[0] === 'string' ? (
                  <ul style={{ margin: 0, paddingLeft: '25px', lineHeight: '2' }}>
                    {dicaExpandida.passos.map((passo, i) => (
                      <li key={i} style={{ marginBottom: '10px', color: isDark ? '#ccc' : '#555', fontSize: '15px' }}>
                        {passo}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ lineHeight: '2', color: isDark ? '#ccc' : '#555', fontSize: '15px' }}>
                    {dicaExpandida.passos}
                  </div>
                )}
              </div>

              <div style={{ 
                backgroundColor: isDark ? '#1a3a1a' : '#e8f5e9', 
                padding: '15px 20px', 
                borderRadius: '10px',
                borderLeft: `4px solid #2ecc71`,
                marginBottom: dicaExpandida.link ? '20px' : 0
              }}>
                <strong style={{ color: '#2ecc71' }}>Benefício:</strong>{' '}
                <span style={{ color: isDark ? '#ccc' : '#555' }}>{dicaExpandida.beneficio}</span>
              </div>

              {dicaExpandida.link && (
                <a
                  href={dicaExpandida.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    backgroundColor: colors.pink,
                    color: '#FFF',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  Acessar Ferramenta
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAnaliseIA = () => {
    if (!user) {
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <img 
              src="/img/kasbook/robot.png" 
              alt="Análise IA" 
              style={{ width: '60px', height: '60px' }}
            />
            <h2 style={{ color: colors.purple, margin: 0 }}>Análise Inteligente</h2>
          </div>
          <div style={{ 
            backgroundColor: colors.card, 
            padding: '60px 40px', 
            borderRadius: '15px', 
            textAlign: 'center',
            border: `2px dashed ${colors.pink}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <img 
              src="/img/kasbook/robot.png" 
              alt="Bloqueado" 
              style={{ width: '100px', height: '100px', margin: '0 auto 20px' }}
            />
            <h3 style={{ color: colors.purple, marginBottom: '15px' }}>Análise IA Bloqueada</h3>
            <p style={{ color: '#666', marginBottom: '25px', maxWidth: '500px', margin: '0 auto 25px' }}>
              Para ter acesso a análises inteligentes geradas por IA sobre seu negócio, faça login ou torne-se um parceiro Kaslee.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: colors.pink,
                color: '#FFF',
                border: 'none',
                padding: '15px 35px',
                borderRadius: '30px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
                marginRight: '10px'
              }}
            >
              🚀 Fazer Login
            </button>
            <button
              onClick={() => navigate('/onboarding')}
              style={{
                backgroundColor: colors.purple,
                color: '#FFF',
                border: 'none',
                padding: '15px 35px',
                borderRadius: '30px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Conhecer Planos
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src="/img/kasbook/robot.png" 
              alt="Análise IA" 
              style={{ width: '60px', height: '60px' }}
            />
            <div>
              <h2 style={{ color: colors.purple, margin: 0 }}>Análise Inteligente do Seu Negócio</h2>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                As análises são geradas automaticamente com base nos dados registrados no KasBook
              </p>
            </div>
          </div>
          
          <button
            onClick={gerarAnaliseIA}
            disabled={loadingIA}
            style={{
              backgroundColor: loadingIA ? '#999' : colors.pink,
              color: '#FFF',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '30px',
              fontWeight: 'bold',
              cursor: loadingIA ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0
            }}
          >
            {loadingIA ? (
              <>
                <span style={{ 
                  display: 'inline-block', 
                  width: '16px', 
                  height: '16px', 
                  border: '3px solid #FFF', 
                  borderTopColor: 'transparent', 
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Gerando Análise...
              </>
            ) : (
              <>
                Gerar Nova Análise
              </>
            )}
          </button>
        </div>

        {/* Card de boas-vindas para primeira análise */}
        {!analiseIA && !loadingIA && (
          <div style={{
            backgroundColor: colors.card,
            padding: '40px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            border: `1px solid ${colors.pink}20`
          }}>
            <img 
              src="/img/kasbook/robot.png" 
              alt="Análise IA" 
              style={{ width: '120px', height: '120px', margin: '0 auto 20px' }}
            />
            <h3 style={{ color: colors.purple, marginBottom: '15px' }}>Bem-vindo à Análise IA!</h3>
            <p style={{ color: '#666', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px' }}>
              Nossa IA analisa seus dados financeiros, tarefas e eventos para fornecer insights personalizados e recomendações estratégicas para seu negócio.
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px', 
              marginTop: '30px',
              textAlign: 'left'
            }}>
              <div style={{ backgroundColor: isDark ? '#333' : '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
                <img 
                  src="/img/kasbook/pie-chart.png" 
                  alt="Saúde Financeira" 
                  style={{ width: '50px', height: '50px', marginBottom: '10px' }}
                />
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Saúde Financeira</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Análise de receitas, despesas e fluxo de caixa</div>
              </div>
              <div style={{ backgroundColor: isDark ? '#333' : '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
                <img 
                  src="/img/kasbook/bar-chart.png" 
                  alt="Produtividade" 
                  style={{ width: '50px', height: '50px', marginBottom: '10px' }}
                />
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Produtividade</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Avaliação de tarefas e eficiência operacional</div>
              </div>
              <div style={{ backgroundColor: isDark ? '#333' : '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
                <img 
                  src="/img/kasbook/infographic.png" 
                  alt="Alertas" 
                  style={{ width: '50px', height: '50px', marginBottom: '10px' }}
                />
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Alertas</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Identificação de riscos e problemas potenciais</div>
              </div>
              <div style={{ backgroundColor: isDark ? '#333' : '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
                <img 
                  src="/img/kasbook/design-software.png" 
                  alt="Recomendações" 
                  style={{ width: '50px', height: '50px', marginBottom: '10px' }}
                />
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Recomendações</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Ações práticas para melhorar resultados</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loadingIA && (
          <div style={{
            backgroundColor: colors.card,
            padding: '60px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <img 
              src="/img/kasbook/robot.png" 
              alt="Analisando" 
              style={{ width: '100px', height: '100px', margin: '0 auto 20px' }}
            />
            <h3 style={{ color: colors.purple, marginBottom: '15px' }}>Analisando seus dados...</h3>
            <p style={{ color: '#666' }}>Nossa IA está processando suas informações para gerar insights personalizados.</p>
            <div style={{
              width: '100%',
              maxWidth: '400px',
              height: '4px',
              backgroundColor: '#eee',
              borderRadius: '2px',
              margin: '30px auto',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '50%',
                height: '100%',
                backgroundColor: colors.pink,
                animation: 'loading 1.5s ease-in-out infinite'
              }}></div>
            </div>
          </div>
        )}

        {/* Resultado da análise */}
        {analiseIA && !loadingIA && (
          <div style={{
            backgroundColor: colors.card,
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            borderLeft: `5px solid ${colors.pink}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <img 
                src="/img/kasbook/robot.png" 
                alt="IA" 
                style={{ width: '40px', height: '40px' }}
              />
              <div>
                <h3 style={{ color: colors.purple, margin: 0 }}>Análise Gerada por IA</h3>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  Gerada em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9',
              padding: '25px',
              borderRadius: '10px',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap',
              fontSize: '15px'
            }}>
              {analiseIA}
            </div>

            <div style={{
              marginTop: '25px',
              padding: '15px',
              backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#666',
              borderLeft: `3px solid ${colors.purple}`
            }}>
              <strong>Dica:</strong> Esta análise é baseada nos dados atuais do seu KasBook. Para insights mais precisos, mantenha seus registros atualizados regularmente.
            </div>
          </div>
        )}

        {/* CSS para animações */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(200%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
    );
  };

  // Função para gerar análise com IA
  const gerarAnaliseIA = async () => {
    if (!user) return;
    
    setLoadingIA(true);
    
    try {
      // Preparar dados para análise
      const { totalEntradas, totalSaidas, saldo } = calcularTotais();
      const despesasCategoria = getDespesasPorCategoria();
      const tarefasPendentes = tarefas.filter(t => t.status === 'pendente').length;
      const tarefasConcluidas = tarefas.filter(t => t.status === 'concluido').length;
      const proximosEventos = eventos.slice(0, 5);
      
      const dadosParaAnalise = {
        financeiro: {
          totalEntradas,
          totalSaidas,
          saldo,
          despesasPorCategoria: despesasCategoria,
          quantidadeDespesas: despesas.length
        },
        tarefas: {
          total: tarefas.length,
          pendentes: tarefasPendentes,
          concluidas: tarefasConcluidas,
          taxaConclusao: tarefas.length > 0 ? ((tarefasConcluidas / tarefas.length) * 100).toFixed(1) : 0
        },
        eventos: {
          total: eventos.length,
          proximos: proximosEventos.length
        }
      };

      const prompt = `Você é um consultor de negócios especializado em pequeno varejo brasileiro. Analise os dados abaixo de um lojista e forneça insights práticos e acionáveis em português do Brasil.

DADOS DO LOJISTA:

Financeiro:
- Total de Entradas: R$ ${totalEntradas.toFixed(2)}
- Total de Saídas: R$ ${totalSaidas.toFixed(2)}
- Saldo: R$ ${saldo.toFixed(2)}
- Número de Despesas Registradas: ${despesas.length}
- Despesas por Categoria: ${JSON.stringify(despesasCategoria)}

Tarefas:
- Total de Tarefas: ${tarefas.length}
- Pendentes: ${tarefasPendentes}
- Concluídas: ${tarefasConcluidas}
- Taxa de Conclusão: ${dadosParaAnalise.tarefas.taxaConclusao}%

Eventos/Agenda:
- Total de Eventos Agendados: ${eventos.length}
- Próximos Eventos: ${proximosEventos.length}

FORNEÇA UMA ANÁLISE ESTRUTURADA EM 4 SEÇÕES (máximo 600 caracteres no total):

1. Saúde Financeira (1-2 frases)
2. Produtividade (1-2 frases)
3. Alertas (1-2 frases sobre riscos ou problemas)
4. Recomendações (2-3 ações práticas)

Seja direto, prático e focado em small business brasileiro. Use emojis para destacar pontos importantes.`;

      // Chamar API do Claude (Anthropic)
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar análise com IA');
      }

      const data = await response.json();
      const analise = data.content[0].text;
      
      setAnaliseIA(analise);
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
      setAnaliseIA('⚠️ Não foi possível gerar a análise no momento. Tente novamente mais tarde.');
    } finally {
      setLoadingIA(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: colors.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
          <div style={{ color: colors.purple, fontSize: '18px', fontWeight: 'bold' }}>Carregando KasBook...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bg, color: colors.text }}>
      <img src={logoBag} style={{ position: 'fixed', bottom: '20px', right: '20px', width: '100px', opacity: 0.05, pointerEvents: 'none' }} alt="" />

      {/* Sidebar com gradiente */}
      <aside style={{ 
        width: '260px', 
        background: `linear-gradient(180deg, ${colors.purple} 0%, ${colors.pink} 100%)`,
        padding: '30px 20px', 
        display: 'flex', 
        flexDirection: 'column', 
        color: '#FFF', 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        overflowY: 'auto',
        boxShadow: '4px 0 20px rgba(187, 37, 166, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src={logoKaslee} style={{ width: '160px' }} alt="Kaslee" />
          <div style={{ 
            marginTop: '15px', 
            fontSize: '16px', 
            fontWeight: 'bold',
            color: '#FFF',
            letterSpacing: '3px',
            opacity: 0.9
          }}>
            KASBOOK
          </div>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <MenuItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Dashboard" />
          <MenuItem active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} label="Agenda" />
          <MenuItem active={activeTab === 'despesas'} onClick={() => setActiveTab('despesas')} label="Despesas" />
          <MenuItem active={activeTab === 'financeiro'} onClick={() => setActiveTab('financeiro')} label="Financeiro" />
          <MenuItem active={activeTab === 'tarefas'} onClick={() => setActiveTab('tarefas')} label="Tarefas" />
          <MenuItem active={activeTab === 'dicas'} onClick={() => setActiveTab('dicas')} label="Estratégias de Crescimento" />
          <MenuItem active={activeTab === 'analise-ia'} onClick={() => setActiveTab('analise-ia')} label="Análise IA" />
        </nav>

        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            marginTop: 'auto',
            background: 'none',
            border: '1px solid #FFF5',
            color: '#FFF',
            padding: '10px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {isDark ? 'MODO CLARO' : 'MODO ESCURO'}
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'agenda' && renderAgenda()}
        {activeTab === 'despesas' && renderDespesas()}
        {activeTab === 'financeiro' && renderFinanceiro()}
        {activeTab === 'tarefas' && renderTarefas()}
        {activeTab === 'dicas' && renderDicas()}
        {activeTab === 'analise-ia' && renderAnaliseIA()}
      </main>

      {/* Modais */}
      {showEventoModal && (
        <ModalEvento
          onClose={() => {
            setShowEventoModal(false);
            setEventoSelecionado(null);
            setSelectedDate(null);
          }}
          onSave={salvarEvento}
          evento={eventoSelecionado}
          dataSelecionada={selectedDate}
          colors={colors}
        />
      )}

      {/* Modal do Dia */}
      {showModalDia && dataSelecionada && (
        <ModalDia
          data={dataSelecionada}
          user={user}
          onClose={() => {
            setShowModalDia(false);
            setDataSelecionada(null);
            if (user) carregarDados(user.id);
          }}
          isDark={isDark}
          colors={colors}
        />
      )}

      {showDespesaModal && (
        <ModalDespesa
          onClose={() => setShowDespesaModal(false)}
          onSave={salvarDespesa}
          colors={colors}
        />
      )}

      {showTarefaModal && (
        <ModalTarefa
          onClose={() => setShowTarefaModal(false)}
          onSave={salvarTarefa}
          colors={colors}
        />
      )}
    </div>
  );
};

// Componentes auxiliares
const MenuItem = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      textAlign: 'left',
      padding: '12px 15px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: active ? '#BB25A6' : 'transparent',
      color: '#FFF',
      fontWeight: active ? 'bold' : 'normal',
      fontSize: '15px',
      transition: '0.2s'
    }}
  >
    {label}
  </button>
);

const KPICard = ({ titulo, valor, cor, isDark }) => (
  <div style={{
    backgroundColor: isDark ? '#2B2F38' : '#FFF',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    borderLeft: `5px solid ${cor}`
  }}>
    <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>{titulo}</div>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: cor }}>{valor}</div>
  </div>
);

// Modal Evento
const ModalEvento = ({ onClose, onSave, evento, dataSelecionada, colors }) => {
  const [formData, setFormData] = useState({
    titulo: evento?.titulo || '',
    descricao: evento?.descricao || '',
    data: evento?.data || dataSelecionada || '',
    categoria: evento?.categoria || 'outro'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#FFF',
        padding: '30px',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ color: colors.purple, marginBottom: '20px' }}>
          {evento ? 'Editar Evento' : 'Novo Evento'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Título</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data</label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoria</label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="promocao">Promoção</option>
              <option value="reuniao">Reunião</option>
              <option value="entrega">Entrega</option>
              <option value="pagamento">Pagamento</option>
              <option value="evento">Evento</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: colors.pink,
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#999',
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Despesa
const ModalDespesa = ({ onClose, onSave, colors }) => {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    categoria: 'outros',
    empresa: '',
    descricao: '',
    valor: '',
    nota_url: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#FFF',
        padding: '30px',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ color: colors.purple, marginBottom: '20px' }}>Nova Despesa</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data</label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoria</label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="transporte">Transporte</option>
              <option value="hospedagem">Hospedagem</option>
              <option value="alimentacao">Alimentação</option>
              <option value="compras">Compras</option>
              <option value="servicos">Serviços</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Empresa</label>
            <input
              type="text"
              value={formData.empresa}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descrição</label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Link da Nota (opcional)</label>
            <input
              type="url"
              value={formData.nota_url}
              onChange={(e) => setFormData({ ...formData, nota_url: e.target.value })}
              placeholder="https://..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: colors.pink,
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#999',
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Tarefa
const ModalTarefa = ({ onClose, onSave, colors }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    status: 'pendente',
    deadline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#FFF',
        padding: '30px',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ color: colors.purple, marginBottom: '20px' }}>Nova Tarefa</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Título</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Prioridade</label>
            <select
              value={formData.prioridade}
              onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Prazo (opcional)</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: colors.pink,
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#999',
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KasBook;