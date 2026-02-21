// src/pages/ConsultorDashboard/pages/MinhaAgenda.jsx
// 📅 GERENCIAR DISPONIBILIDADE - CONSULTOR

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

const MinhaAgenda = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [horarios, setHorarios] = useState([]);
    const [editando, setEditando] = useState(null);
    const [novoHorario, setNovoHorario] = useState({
        dia_semana: 1,
        hora_inicio: '09:00',
        hora_fim: '18:00',
        ativo: true
    });

    const diasSemana = [
        { value: 0, label: 'Domingo' },
        { value: 1, label: 'Segunda-feira' },
        { value: 2, label: 'Terça-feira' },
        { value: 3, label: 'Quarta-feira' },
        { value: 4, label: 'Quinta-feira' },
        { value: 5, label: 'Sexta-feira' },
        { value: 6, label: 'Sábado' }
    ];

    useEffect(() => {
        if (user?.id) {
            carregarHorarios();
        }
    }, [user]);

    const carregarHorarios = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('horarios_consultores')
                .select('*')
                .eq('consultor_id', user.id)
                .order('dia_semana')
                .order('hora_inicio');

            if (error) throw error;

            setHorarios(data || []);
        } catch (error) {
            console.error('Erro ao carregar horários:', error);
        } finally {
            setLoading(false);
        }
    };

    const adicionarHorario = async () => {
        if (!user?.id) return;

        try {
            const { error } = await supabase
                .from('horarios_consultores')
                .insert({
                    consultor_id: user.id,
                    dia_semana: parseInt(novoHorario.dia_semana),
                    hora_inicio: novoHorario.hora_inicio,
                    hora_fim: novoHorario.hora_fim,
                    ativo: true
                });

            if (error) throw error;

            alert(' Horário adicionado com sucesso!');
            setNovoHorario({
                dia_semana: 1,
                hora_inicio: '09:00',
                hora_fim: '18:00',
                ativo: true
            });
            carregarHorarios();

        } catch (error) {
            console.error('Erro ao adicionar horário:', error);
            alert(' Erro ao adicionar horário. Verifique se não há conflito.');
        }
    };

    const toggleHorario = async (horarioId, ativoAtual) => {
        try {
            const { error } = await supabase
                .from('horarios_consultores')
                .update({ ativo: !ativoAtual })
                .eq('id', horarioId);

            if (error) throw error;

            carregarHorarios();
        } catch (error) {
            console.error('Erro ao atualizar:', error);
        }
    };

    const removerHorario = async (horarioId) => {
        if (!confirm('Tem certeza que deseja remover este horário?')) return;

        try {
            const { error } = await supabase
                .from('horarios_consultores')
                .delete()
                .eq('id', horarioId);

            if (error) throw error;

            alert(' Horário removido com sucesso!');
            carregarHorarios();

        } catch (error) {
            console.error('Erro ao remover:', error);
            alert(' Erro ao remover horário.');
        }
    };

    const copiarSemana = async () => {
        if (!confirm('Copiar horários de Segunda para Terça a Sexta?')) return;

        try {
            const segundaHorarios = horarios.filter(h => h.dia_semana === 1);

            if (segundaHorarios.length === 0) {
                alert('⚠️ Nenhum horário cadastrado para Segunda-feira.');
                return;
            }

            const novosHorarios = [];
            for (let dia = 2; dia <= 5; dia++) {
                for (const horario of segundaHorarios) {
                    novosHorarios.push({
                        consultor_id: user.id,
                        dia_semana: dia,
                        hora_inicio: horario.hora_inicio,
                        hora_fim: horario.hora_fim,
                        ativo: true
                    });
                }
            }

            // Remover horários existentes de terça a sexta
            await supabase
                .from('horarios_consultores')
                .delete()
                .eq('consultor_id', user.id)
                .in('dia_semana', [2, 3, 4, 5]);

            // Inserir novos
            const { error } = await supabase
                .from('horarios_consultores')
                .insert(novosHorarios);

            if (error) throw error;

            alert(' Horários copiados com sucesso!');
            carregarHorarios();

        } catch (error) {
            console.error('Erro ao copiar:', error);
            alert(' Erro ao copiar horários.');
        }
    };

    const getDiaNome = (dia) => {
        return diasSemana.find(d => d.value === dia)?.label || 'Desconhecido';
    };

    const horariosAgrupados = diasSemana.map(dia => ({
        dia: dia.value,
        nome: dia.label,
        horarios: horarios.filter(h => h.dia_semana === dia.value)
    }));

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Carregando agenda...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>📅 Minha Disponibilidade</h2>
                <button onClick={copiarSemana} style={styles.copiarBtn}>
                     Copiar Segunda → Ter a Sex
                </button>
            </div>

            <div style={styles.infoBox}>
                <div style={styles.infoIcon}></div>
                <div>
                    <strong>Como funciona:</strong>
                    <p style={styles.infoText}>
                        Defina os horários em que você está disponível para atender clientes. 
                        Os clientes só poderão agendar nos horários que você configurar aqui.
                    </p>
                </div>
            </div>

            {/* ADICIONAR NOVO HORÁRIO */}
            <div style={styles.addCard}>
                <h3 style={styles.cardTitle}>➕ Adicionar Horário</h3>
                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Dia da Semana</label>
                        <select
                            value={novoHorario.dia_semana}
                            onChange={(e) => setNovoHorario({ ...novoHorario, dia_semana: e.target.value })}
                            style={styles.input}
                        >
                            {diasSemana.map(dia => (
                                <option key={dia.value} value={dia.value}>{dia.label}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Hora Início</label>
                        <input
                            type="time"
                            value={novoHorario.hora_inicio}
                            onChange={(e) => setNovoHorario({ ...novoHorario, hora_inicio: e.target.value })}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Hora Fim</label>
                        <input
                            type="time"
                            value={novoHorario.hora_fim}
                            onChange={(e) => setNovoHorario({ ...novoHorario, hora_fim: e.target.value })}
                            style={styles.input}
                        />
                    </div>

                    <button onClick={adicionarHorario} style={styles.addBtn}>
                        ✓ Adicionar
                    </button>
                </div>
            </div>

            {/* LISTA DE HORÁRIOS POR DIA */}
            <div style={styles.diasGrid}>
                {horariosAgrupados.map(diaGrupo => (
                    <div key={diaGrupo.dia} style={styles.diaCard}>
                        <div style={styles.diaHeader}>
                            <h4 style={styles.diaNome}>{diaGrupo.nome}</h4>
                            <span style={styles.contador}>
                                {diaGrupo.horarios.filter(h => h.ativo).length} ativo(s)
                            </span>
                        </div>

                        {diaGrupo.horarios.length === 0 ? (
                            <p style={styles.semHorarios}>Sem horários cadastrados</p>
                        ) : (
                            <div style={styles.horariosList}>
                                {diaGrupo.horarios.map(horario => (
                                    <div
                                        key={horario.id}
                                        style={{
                                            ...styles.horarioItem,
                                            opacity: horario.ativo ? 1 : 0.5
                                        }}
                                    >
                                        <div style={styles.horarioTime}>
                                            🕐 {horario.hora_inicio} - {horario.hora_fim}
                                        </div>
                                        <div style={styles.horarioActions}>
                                            <button
                                                onClick={() => toggleHorario(horario.id, horario.ativo)}
                                                style={{
                                                    ...styles.toggleBtn,
                                                    backgroundColor: horario.ativo ? '#ffc107' : '#bb25a6'
                                                }}
                                            >
                                                {horario.ativo ? '⏸ Pausar' : '▶ Ativar'}
                                            </button>
                                            <button
                                                onClick={() => removerHorario(horario.id)}
                                                style={styles.removeBtn}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '20px' },
    spinner: { width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #2f0d51', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
    title: { fontSize: '2rem', color: '#2f0d51', margin: 0 },
    copiarBtn: { backgroundColor: '#bb25a6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
    infoBox: { backgroundColor: '#f3e8ff', border: '1px solid #f3e8ff', borderRadius: '8px', padding: '15px', marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'flex-start' },
    infoIcon: { fontSize: '2rem' },
    infoText: { fontSize: '14px', color: '#555', margin: '5px 0 0 0', lineHeight: '1.5' },
    addCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '30px' },
    cardTitle: { fontSize: '1.2rem', color: '#2f0d51', marginBottom: '20px', fontWeight: '600' },
    formGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '15px', alignItems: 'end' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '14px', fontWeight: '600', color: '#555', marginBottom: '8px' },
    input: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
    addBtn: { backgroundColor: '#bb25a6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', height: '45px' },
    diasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    diaCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    diaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #e0e0e0' },
    diaNome: { fontSize: '1.1rem', fontWeight: 'bold', color: '#2f0d51', margin: 0 },
    contador: { fontSize: '13px', color: '#6c757d', fontWeight: '600' },
    semHorarios: { fontSize: '14px', color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' },
    horariosList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    horarioItem: { backgroundColor: '#f8f9fa', padding: '12px 15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e0e0e0' },
    horarioTime: { fontSize: '14px', fontWeight: '600', color: '#2f0d51' },
    horarioActions: { display: 'flex', gap: '8px' },
    toggleBtn: { color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
    removeBtn: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }
};

export default MinhaAgenda;
