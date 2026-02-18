import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/**
 * 👥 MEUS CLIENTES - CONSULTOR
 * 
 * ✅ CPF usado APENAS como filtro interno (não exibe)
 * ✅ Emojis em todos os títulos
 */

const MeusClientes = () => {
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState('mensal');
    const [consultorId, setConsultorId] = useState(null);
    
    const [metricas, setMetricas] = useState({
        totalClientes: 0,
        clientesRecorrentes: 0,
        taxaRetorno: 0,
        valorMedioPorCliente: 0,
        topClientes: [],
        distribuicaoAtendimentos: [],
        clientesNovosVsAntigos: []
    });

    useEffect(() => {
        carregarDados();
    }, [periodo]);

    const carregarDados = async () => {
        setLoading(true);
        
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            
            setConsultorId(user.id);

            const { dataInicio, dataFim } = calcularPeriodo(periodo);

            const { data: todosPedidos } = await supabase
                .from('pedidos')
                .select(`
                    *,
                    clientes:cliente_id (
                        id,
                        nome,
                        cpf,
                        email,
                        telefone,
                        created_at
                    ),
                    lojas_corrigida:loja_id (
                        nome
                    )
                `)
                .eq('consultor_id', user.id)
                .eq('status_separacao', 'Retirado pelo Cliente');

            const { data: pedidosPeriodo } = await supabase
                .from('pedidos')
                .select(`
                    *,
                    clientes:cliente_id (
                        id,
                        nome,
                        cpf,
                        created_at
                    )
                `)
                .eq('consultor_id', user.id)
                .eq('status_separacao', 'Retirado pelo Cliente')
                .gte('data_pedido', dataInicio)
                .lte('data_pedido', dataFim);

            processarMetricas(todosPedidos || [], pedidosPeriodo || [], dataInicio);

        } catch (error) {
            console.error('[MeusClientes] Erro:', error);
        } finally {
            setLoading(false);
        }
    };

    const calcularPeriodo = (tipo) => {
        const agora = new Date();
        let dataInicio = new Date();
        
        switch(tipo) {
            case 'semanal':
                dataInicio.setDate(agora.getDate() - 7);
                break;
            case 'mensal':
                dataInicio.setMonth(agora.getMonth() - 1);
                break;
            case 'trimestral':
                dataInicio.setMonth(agora.getMonth() - 3);
                break;
            case 'anual':
                dataInicio.setFullYear(agora.getFullYear() - 1);
                break;
        }
        
        return {
            dataInicio: dataInicio.toISOString(),
            dataFim: agora.toISOString()
        };
    };

    const processarMetricas = (todosPedidos, pedidosPeriodo, dataInicio) => {
        // ============================================
        // AGRUPAR POR CPF (uso interno apenas!)
        // ============================================
        const clientesMap = {};
        
        todosPedidos.forEach(pedido => {
            const cliente = pedido.clientes;
            const loja = pedido.lojas_corrigida;
            if (!cliente || !cliente.cpf) return;
            
            const cpf = cliente.cpf; // ✅ USA CPF como chave interna
            
            if (!clientesMap[cpf]) {
                clientesMap[cpf] = {
                    id: cliente.id,
                    nome: cliente.nome || 'Cliente sem nome',
                    // ❌ NÃO GUARDA CPF AQUI!
                    email: cliente.email,
                    telefone: cliente.telefone,
                    primeiroAtendimento: pedido.data_pedido,
                    ultimoAtendimento: pedido.data_pedido,
                    totalAtendimentos: 0,
                    comissaoTotal: 0,
                    lojas: new Set(),
                    pedidos: []
                };
            }
            
            clientesMap[cpf].totalAtendimentos += 1;
            
            const comissao = pedido.valor_comissao || ((pedido.valor_total || 0) * (pedido.percentual_comissao || 10) / 100);
            clientesMap[cpf].comissaoTotal += comissao;
            
            if (loja) clientesMap[cpf].lojas.add(loja.nome);
            clientesMap[cpf].pedidos.push(pedido);
            
            if (new Date(pedido.data_pedido) < new Date(clientesMap[cpf].primeiroAtendimento)) {
                clientesMap[cpf].primeiroAtendimento = pedido.data_pedido;
            }
            if (new Date(pedido.data_pedido) > new Date(clientesMap[cpf].ultimoAtendimento)) {
                clientesMap[cpf].ultimoAtendimento = pedido.data_pedido;
            }
        });

        Object.values(clientesMap).forEach(cliente => {
            cliente.valorMedio = cliente.totalAtendimentos > 0 ? cliente.comissaoTotal / cliente.totalAtendimentos : 0;
            cliente.lojas = Array.from(cliente.lojas);
        });

        const totalClientes = Object.keys(clientesMap).length;
        const clientesRecorrentes = Object.values(clientesMap).filter(c => c.totalAtendimentos > 1).length;
        const taxaRetorno = totalClientes > 0 ? ((clientesRecorrentes / totalClientes) * 100).toFixed(1) : 0;
        const valorMedioPorCliente = totalClientes > 0 ? Object.values(clientesMap).reduce((sum, c) => sum + c.comissaoTotal, 0) / totalClientes : 0;

        // ============================================
        // TOP 10 CLIENTES (SEM CPF!)
        // ============================================
        const topClientes = Object.values(clientesMap)
            .sort((a, b) => b.totalAtendimentos - a.totalAtendimentos)
            .slice(0, 10)
            .map(c => ({
                nome: c.nome,
                email: c.email,
                telefone: c.telefone,
                totalAtendimentos: c.totalAtendimentos,
                comissaoTotal: c.comissaoTotal,
                valorMedio: c.valorMedio,
                lojas: c.lojas.join(', '),
                primeiroAtendimento: new Date(c.primeiroAtendimento).toLocaleDateString('pt-BR'),
                ultimoAtendimento: new Date(c.ultimoAtendimento).toLocaleDateString('pt-BR'),
                diasDesdeUltimo: Math.floor((new Date() - new Date(c.ultimoAtendimento)) / (1000 * 60 * 60 * 24))
            }));

        const distribuicaoMap = {
            '1 vez': 0,
            '2-3 vezes': 0,
            '4-5 vezes': 0,
            '6-10 vezes': 0,
            '11+ vezes': 0
        };
        
        Object.values(clientesMap).forEach(cliente => {
            if (cliente.totalAtendimentos === 1) distribuicaoMap['1 vez']++;
            else if (cliente.totalAtendimentos <= 3) distribuicaoMap['2-3 vezes']++;
            else if (cliente.totalAtendimentos <= 5) distribuicaoMap['4-5 vezes']++;
            else if (cliente.totalAtendimentos <= 10) distribuicaoMap['6-10 vezes']++;
            else distribuicaoMap['11+ vezes']++;
        });
        
        const distribuicaoAtendimentos = Object.entries(distribuicaoMap).map(([faixa, qtd]) => ({
            faixa,
            quantidade: qtd,
            percentual: totalClientes > 0 ? ((qtd / totalClientes) * 100).toFixed(1) : 0
        }));

        const clientesNovos = Object.values(clientesMap).filter(c => new Date(c.primeiroAtendimento) >= new Date(dataInicio)).length;
        const clientesAntigos = totalClientes - clientesNovos;
        
        const clientesNovosVsAntigos = [
            { categoria: 'Novos', quantidade: clientesNovos },
            { categoria: 'Antigos', quantidade: clientesAntigos }
        ];

        setMetricas({
            totalClientes,
            clientesRecorrentes,
            taxaRetorno,
            valorMedioPorCliente,
            topClientes,
            distribuicaoAtendimentos,
            clientesNovosVsAntigos
        });
    };

    const exportarMeusClientes = () => {
        const csv = [
            ['Nome', 'Email', 'Telefone', 'Atendimentos', 'Comissão Total', 'Valor Médio', 'Lojas', 'Primeiro Atendimento', 'Último Atendimento', 'Dias'].join(';'),
            ...metricas.topClientes.map(c => 
                [c.nome, c.email, c.telefone, c.totalAtendimentos, c.comissaoTotal.toFixed(2), c.valorMedio.toFixed(2), c.lojas, c.primeiroAtendimento, c.ultimoAtendimento, c.diasDesdeUltimo].join(';')
            )
        ].join('\n');
        
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `meus_clientes_${periodo}.csv`;
        link.click();
    };
    
    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Carregando meus clientes...</p>
            </div>
        );
    }

    const COLORS = ['#364fab', '#bb25a6', '#ffc107', '#dc3545', '#17a2b8'];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>👥 Meus Clientes</h2>
                
                <div style={styles.filters}>
                    <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} style={styles.select}>
                        <option value="semanal">Última Semana</option>
                        <option value="mensal">Último Mês</option>
                        <option value="trimestral">Último Trimestre</option>
                        <option value="anual">Último Ano</option>
                    </select>

                    <button onClick={exportarMeusClientes} style={styles.exportButton}>
                        📥 Exportar Lista
                    </button>
                </div>
            </div>

            <div style={styles.cardsGrid}>
                <MetricCard title="Total de Clientes" value={metricas.totalClientes} icon="👥" color="#364fab" />
                <MetricCard title="Clientes Recorrentes" value={metricas.clientesRecorrentes} icon="🔄" color="#bb25a6" />
                <MetricCard title="Taxa de Retorno" value={`${metricas.taxaRetorno}%`} icon="📈" color="#ffc107" />
                <MetricCard title="Comissão Média/Cliente" value={`R$ ${metricas.valorMedioPorCliente.toFixed(2)}`} icon="💰" color="#bb25a6" />
            </div>

            <div style={styles.chartsGrid}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>📊 Distribuição de Atendimentos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={metricas.distribuicaoAtendimentos}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({faixa, percentual}) => `${faixa}: ${percentual}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="quantidade"
                            >
                                {metricas.distribuicaoAtendimentos.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>🆕 Clientes Novos vs Antigos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={metricas.clientesNovosVsAntigos}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="categoria" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quantidade" fill="#364fab" name="Clientes" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={styles.card}>
                <h3 style={styles.cardTitle}>🏆 Meus Top 10 Clientes</h3>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>#</th>
                                <th style={styles.th}>Nome</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Telefone</th>
                                <th style={styles.thCenter}>Atendimentos</th>
                                <th style={styles.thRight}>Comissão Total</th>
                                <th style={styles.thRight}>Valor Médio</th>
                                <th style={styles.th}>Lojas</th>
                                <th style={styles.th}>Primeiro</th>
                                <th style={styles.th}>Último</th>
                                <th style={styles.thCenter}>Dias</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metricas.topClientes.map((cliente, index) => (
                                <tr key={index} style={index % 2 === 0 ? styles.trEven : {}}>
                                    <td style={styles.td}>
                                        <span style={styles.rank}>{index + 1}</span>
                                    </td>
                                    <td style={styles.td}>{cliente.nome}</td>
                                    <td style={styles.td}><small>{cliente.email}</small></td>
                                    <td style={styles.td}><small>{cliente.telefone}</small></td>
                                    <td style={styles.tdCenter}>
                                        <span style={styles.badge}>{cliente.totalAtendimentos}</span>
                                    </td>
                                    <td style={styles.tdRight}>
                                        <strong>R$ {cliente.comissaoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                                    </td>
                                    <td style={styles.tdRight}>
                                        R$ {cliente.valorMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td style={styles.td}><small>{cliente.lojas}</small></td>
                                    <td style={styles.td}>{cliente.primeiroAtendimento}</td>
                                    <td style={styles.td}>{cliente.ultimoAtendimento}</td>
                                    <td style={styles.tdCenter}>
                                        <span style={{...styles.dias, color: cliente.diasDesdeUltimo > 30 ? '#dc3545' : '#bb25a6'}}>
                                            {cliente.diasDesdeUltimo}d
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={styles.card}>
                <h3 style={styles.cardTitle}>💡 Dicas para Fidelizar</h3>
                <div style={styles.insightsList}>
                    <div style={styles.insightItem}>
                        <span style={styles.insightIcon}>🎯</span>
                        <div>
                            <strong>Retenção:</strong> {metricas.clientesRecorrentes} clientes ({metricas.taxaRetorno}%) voltaram com você!
                            {metricas.taxaRetorno < 30 && ' Tente entrar em contato com quem atendeu só 1 vez.'}
                        </div>
                    </div>
                    <div style={styles.insightItem}>
                        <span style={styles.insightIcon}>📞</span>
                        <div>
                            <strong>Reengajamento:</strong> {metricas.topClientes.filter(c => c.diasDesdeUltimo > 30).length} clientes fiéis sem atender há mais de 30 dias.
                            {metricas.topClientes.filter(c => c.diasDesdeUltimo > 30).length > 0 && ' Mande uma mensagem para eles!'}
                        </div>
                    </div>
                    <div style={styles.insightItem}>
                        <span style={styles.insightIcon}>💰</span>
                        <div>
                            <strong>Oportunidade:</strong> Clientes recorrentes geram R$ {metricas.valorMedioPorCliente.toFixed(2)} em comissão em média.
                            Quanto mais você fidelizar, mais ganha!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon, color }) => (
    <div style={styles.metricCard}>
        <div style={styles.metricIcon}>{icon}</div>
        <div style={styles.metricContent}>
            <span style={styles.metricTitle}>{title}</span>
            <span style={{...styles.metricValue, color}}>{value}</span>
        </div>
    </div>
);

const styles = {
    container: { padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif', overflowY: 'auto' },
    loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '20px' },
    spinner: { width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #364fab', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' },
    title: { fontSize: '1.8rem', color: '#2f0d51', margin: 0 },
    filters: { display: 'flex', gap: '15px' },
    select: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', cursor: 'pointer', backgroundColor: 'white' },
    exportButton: { padding: '10px 20px', backgroundColor: '#bb25a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
    cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minimin(220px, 1fr))', gap: '20px', marginBottom: '30px' },
    metricCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', gap: '15px', alignItems: 'center' },
    metricIcon: { fontSize: '2rem' },
    metricContent: { display: 'flex', flexDirection: 'column' },
    metricTitle: { fontSize: '13px', color: '#6c757d', marginBottom: '5px' },
    metricValue: { fontSize: '22px', fontWeight: 'bold' },
    chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px', marginBottom: '30px' },
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '30px' },
    cardTitle: { fontSize: '1.2rem', color: '#2f0d51', marginBottom: '20px', fontWeight: '600' },
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#495057', fontSize: '14px' },
    thCenter: { padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#495057', fontSize: '14px' },
    thRight: { padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#495057', fontSize: '14px' },
    td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' },
    tdCenter: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', fontSize: '14px' },
    tdRight: { padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee', fontSize: '14px' },
    trEven: { backgroundColor: '#f8f9fa' },
    rank: { display: 'inline-block', width: '28px', height: '28px', lineHeight: '28px', textAlign: 'center', backgroundColor: '#364fab', color: 'white', borderRadius: '50%', fontWeight: 'bold', fontSize: '13px' },
    badge: { display: 'inline-block', padding: '4px 12px', backgroundColor: '#364fab', color: 'white', borderRadius: '12px', fontSize: '13px', fontWeight: '600' },
    dias: { fontWeight: '600', fontSize: '13px' },
    insightsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    insightItem: { display: 'flex', gap: '15px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #364fab', alignItems: 'flex-start' },
    insightIcon: { fontSize: '2rem' }
};

export default MeusClientes;