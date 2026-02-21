// src/pages/ConsultorDashboard/components/ProfilePanel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import {
  User, Envelope, Phone, IdentificationCard, Calendar, MapPin,
  House, Buildings, SignOut, PencilSimple, FloppyDisk, X,
  FilePdf, DownloadSimple, UploadSimple, ChartBar, CurrencyDollar,
  Star, Storefront, Plus, Trash, Spinner
} from '@phosphor-icons/react';

const PRIMARY = '#2f0d51';
const ACCENT = '#bb25a6';

const SEGMENTOS_DISPONIVEIS = [
  { id: 'Smartphones',      nome: 'Smartphones',      cor: '#bb25a6' },
  { id: 'Notebooks',        nome: 'Notebooks',         cor: '#9b59b6' },
  { id: 'TVs',              nome: 'TVs',               cor: '#e74c3c' },
  { id: 'Informática',      nome: 'Informática',       cor: '#2f0d51' },
  { id: 'Games',            nome: 'Games',             cor: '#e67e22' },
  { id: 'Áudio',            nome: 'Áudio',             cor: '#16a085' },
  { id: 'Móveis',           nome: 'Móveis',            cor: '#8e44ad' },
  { id: 'Decoração',        nome: 'Decoração',         cor: '#bb25a6' },
  { id: 'Iluminação',       nome: 'Iluminação',        cor: '#f39c12' },
  { id: 'Eletrodomésticos', nome: 'Eletrodomésticos',  cor: '#2f0d51' },
  { id: 'Moda',             nome: 'Moda',              cor: '#c0392b' },
  { id: 'Beleza',           nome: 'Beleza',            cor: '#f53342' },
  { id: 'Esportes',         nome: 'Esportes',          cor: '#ff5722' },
  { id: 'Livros',           nome: 'Livros',            cor: '#795548' },
];

const ProfilePanel = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingCurriculo, setUploadingCurriculo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddSegmento, setShowAddSegmento] = useState(false);

  const empty = {
    nome: '', email: '', telefone: '', cpf: '', dataNascimento: '',
    endereco: '', bairro: '', cidade: '', estado: '', cep: '',
    bio: '', curriculoUrl: null, curriculoNome: null,
    dataUploadCurriculo: null, segmentosAtendidos: [],
  };
  const [perfil, setPerfil] = useState(empty);
  const [editedPerfil, setEditedPerfil] = useState(empty);

  useEffect(() => { carregarPerfil(); }, []);

  const carregarPerfil = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/consultor/login'); return; }
      const { data: c, error } = await supabase.from('consultores').select('*').eq('user_id', user.id).single();
      if (error) throw error;
      const p = {
        nome: c.nome || '', email: user.email || '', telefone: c.telefone || '',
        cpf: c.cpf || '', dataNascimento: c.data_nascimento || '',
        endereco: c.endereco || '', bairro: c.bairro || '', cidade: c.cidade || '',
        estado: c.estado || '', cep: c.cep || '', bio: c.bio || '',
        curriculoUrl: c.curriculo_url || null, curriculoNome: c.curriculo_nome || null,
        dataUploadCurriculo: c.curriculo_upload_data || null,
        segmentosAtendidos: c.segmentos_atendidos || [],
      };
      setPerfil(p); setEditedPerfil(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('consultores').update({
        nome: editedPerfil.nome, telefone: editedPerfil.telefone, cpf: editedPerfil.cpf,
        data_nascimento: editedPerfil.dataNascimento, endereco: editedPerfil.endereco,
        bairro: editedPerfil.bairro, cidade: editedPerfil.cidade, estado: editedPerfil.estado,
        cep: editedPerfil.cep, bio: editedPerfil.bio,
        segmentos_atendidos: editedPerfil.segmentosAtendidos,
      }).eq('user_id', user.id);
      if (error) throw error;
      setPerfil({ ...editedPerfil });
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (e) { console.error(e); alert('Erro ao salvar perfil.'); }
  };

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/consultor/login');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { alert('Formato inválido. Use PDF, DOC ou DOCX.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Arquivo muito grande. Máximo 5MB.'); return; }
    setUploadingCurriculo(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const fileName = `curriculos/${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('documentos').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('documentos').getPublicUrl(fileName);
      await supabase.from('consultores').update({
        curriculo_url: urlData.publicUrl, curriculo_nome: file.name,
        curriculo_upload_data: new Date().toISOString(),
      }).eq('user_id', user.id);
      setPerfil({ ...perfil, curriculoUrl: urlData.publicUrl, curriculoNome: file.name, dataUploadCurriculo: new Date().toISOString() });
      alert('Currículo enviado com sucesso!');
    } catch (e) { console.error(e); alert('Erro ao enviar currículo.'); }
    finally { setUploadingCurriculo(false); }
  };

  const adicionarSegmento = (seg) => {
    if (!editedPerfil.segmentosAtendidos.includes(seg.id))
      setEditedPerfil({ ...editedPerfil, segmentosAtendidos: [...editedPerfil.segmentosAtendidos, seg.id] });
    setShowAddSegmento(false);
  };
  const removerSegmento = (id) => setEditedPerfil({
    ...editedPerfil, segmentosAtendidos: editedPerfil.segmentosAtendidos.filter(s => s !== id)
  });
  const getSegData = (id) => SEGMENTOS_DISPONIVEIS.find(s => s.id === id) || { id, nome: id, cor: '#95a5a6' };

  const up = (field) => (value) => setEditedPerfil({ ...editedPerfil, [field]: value });
  const cur = (field) => isEditing ? editedPerfil[field] : perfil[field];

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16 }}>
      <Spinner size={48} color={PRIMARY} style={{ animation:'spin 1s linear infinite' }} />
      <p style={{ color:'#666' }}>Carregando perfil...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor:'#f8f9fa', minHeight:'100vh', padding:'24px' }}>

      {/* Header */}
      <div style={S.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:`linear-gradient(135deg,${PRIMARY},${ACCENT})`, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:'bold' }}>
              {perfil.nome.charAt(0) || 'C'}
            </div>
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:PRIMARY, margin:'0 0 4px 0' }}>{perfil.nome || 'Consultor'}</h1>
              <p style={{ color:'#666', margin:0, display:'flex', alignItems:'center', gap:6 }}>
                <Envelope size={14} /> {perfil.email}
              </p>
            </div>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {!isEditing ? (
              <>
                <button onClick={() => { setIsEditing(true); setEditedPerfil({...perfil}); }} style={S.btnPrimary}>
                  <PencilSimple size={16} weight="duotone" /> Editar
                </button>
                <button onClick={handleLogout} style={S.btnDanger}>
                  <SignOut size={16} weight="duotone" /> Sair
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} style={S.btnSuccess}>
                  <FloppyDisk size={16} weight="duotone" /> Salvar
                </button>
                <button onClick={() => { setIsEditing(false); setEditedPerfil({...perfil}); }} style={S.btnGray}>
                  <X size={16} /> Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Segmentos */}
      <div style={{ ...S.card, border:`2px solid ${PRIMARY}`, marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:PRIMARY, margin:0, display:'flex', alignItems:'center', gap:8 }}>
            <Storefront size={22} weight="duotone" color={ACCENT} /> Segmentos Atendidos
          </h2>
          {isEditing && (
            <button onClick={() => setShowAddSegmento(!showAddSegmento)} style={S.btnPrimary}>
              <Plus size={16} /> Adicionar
            </button>
          )}
        </div>

        {showAddSegmento && isEditing && (
          <div style={{ background:'#f8f9fa', borderRadius:10, padding:14, marginBottom:16 }}>
            <p style={{ fontSize:13, color:'#666', marginBottom:10 }}>Clique para adicionar:</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {SEGMENTOS_DISPONIVEIS.filter(s => !editedPerfil.segmentosAtendidos.includes(s.id)).map(seg => (
                <button key={seg.id} onClick={() => adicionarSegmento(seg)} style={{ border:`2px solid ${seg.cor}`, background:'white', borderRadius:20, padding:'6px 14px', fontSize:13, fontWeight:500, cursor:'pointer', color:seg.cor }}>
                  {seg.nome}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display:'flex', flexWrap:'wrap', gap:10, minHeight:48 }}>
          {(isEditing ? editedPerfil.segmentosAtendidos : perfil.segmentosAtendidos).length === 0
            ? <p style={{ color:'#aaa', padding:'12px 0' }}>Nenhum segmento selecionado</p>
            : (isEditing ? editedPerfil.segmentosAtendidos : perfil.segmentosAtendidos).map(id => {
                const seg = getSegData(id);
                return (
                  <div key={id} style={{ background:seg.cor+'18', border:`2px solid ${seg.cor}`, borderRadius:20, padding:'6px 14px', display:'flex', alignItems:'center', gap:8, fontSize:14, fontWeight:600 }}>
                    <span style={{ color:seg.cor }}>{seg.nome}</span>
                    {isEditing && (
                      <button onClick={() => removerSegmento(id)} style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', color:'#dc3545' }}>
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                );
              })
          }
        </div>
      </div>

      {/* Conteúdo em 2 colunas */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))', gap:24 }}>

        {/* Coluna esquerda */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          <Section title="Dados Pessoais" icon={<User size={20} weight="duotone" color={ACCENT} />}>
            <InfoGrid>
              <InfoField label="Nome Completo" icon={<User size={14}/>} value={cur('nome')} isEditing={isEditing} onChange={up('nome')} />
              <InfoField label="E-mail" icon={<Envelope size={14}/>} value={cur('email')} isEditing={false} onChange={() => {}} />
              <InfoField label="Telefone" icon={<Phone size={14}/>} value={cur('telefone')} isEditing={isEditing} onChange={up('telefone')} />
              <InfoField label="CPF" icon={<IdentificationCard size={14}/>} value={cur('cpf')} isEditing={isEditing} onChange={up('cpf')} />
              <InfoField label="Data de Nascimento" icon={<Calendar size={14}/>} value={cur('dataNascimento')} isEditing={isEditing} onChange={up('dataNascimento')} />
              <InfoField label="CEP" icon={<MapPin size={14}/>} value={cur('cep')} isEditing={isEditing} onChange={up('cep')} />
            </InfoGrid>
          </Section>

          <Section title="Endereço" icon={<House size={20} weight="duotone" color={ACCENT} />}>
            <InfoGrid>
              <InfoField label="Rua" value={cur('endereco')} isEditing={isEditing} onChange={up('endereco')} />
              <InfoField label="Bairro" value={cur('bairro')} isEditing={isEditing} onChange={up('bairro')} />
              <InfoField label="Cidade" value={cur('cidade')} isEditing={isEditing} onChange={up('cidade')} />
              <InfoField label="Estado" value={cur('estado')} isEditing={isEditing} onChange={up('estado')} />
            </InfoGrid>
          </Section>

          <Section title="Biografia" icon={<IdentificationCard size={20} weight="duotone" color={ACCENT} />}>
            {isEditing
              ? <textarea value={editedPerfil.bio} onChange={e => setEditedPerfil({...editedPerfil, bio: e.target.value})}
                  style={{ width:'100%', padding:'10px 12px', border:'2px solid #e0e0e0', borderRadius:8, fontSize:'0.95rem', fontFamily:'inherit', resize:'vertical', boxSizing:'border-box' }} rows={4}
                  placeholder="Conte um pouco sobre sua experiência..." />
              : <p style={{ color:'#555', lineHeight:1.7, margin:0 }}>{perfil.bio || 'Nenhuma biografia adicionada ainda.'}</p>
            }
          </Section>
        </div>

        {/* Coluna direita */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          <Section title="Currículo" icon={<FilePdf size={20} weight="duotone" color={ACCENT} />}>
            {perfil.curriculoUrl ? (
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:14, background:'#f8f9fa', borderRadius:10, marginBottom:14 }}>
                <FilePdf size={36} weight="duotone" color={ACCENT} />
                <div style={{ flex:1 }}>
                  <p style={{ margin:'0 0 4px', fontWeight:600, color:'#333', fontSize:14 }}>{perfil.curriculoNome}</p>
                  <p style={{ margin:0, fontSize:12, color:'#888' }}>
                    Enviado em: {new Date(perfil.dataUploadCurriculo).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <a href={perfil.curriculoUrl} download target="_blank" rel="noopener noreferrer"
                  style={{ background:PRIMARY, color:'white', borderRadius:8, padding:'8px 14px', textDecoration:'none', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                  <DownloadSimple size={16} /> Baixar
                </a>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:32, background:'#f8f9fa', borderRadius:10, marginBottom:14, color:'#aaa' }}>
                <FilePdf size={40} weight="duotone" color="#ccc" />
                <p style={{ marginTop:10 }}>Nenhum currículo enviado</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} style={{ display:'none' }} />
            <button onClick={() => fileInputRef.current.click()} disabled={uploadingCurriculo}
              style={{ ...S.btnPrimary, width:'100%', justifyContent:'center', marginBottom:8 }}>
              <UploadSimple size={16} weight="duotone" />
              {uploadingCurriculo ? 'Enviando...' : 'Substituir Currículo'}
            </button>
            <p style={{ fontSize:12, color:'#999', textAlign:'center', margin:0 }}>PDF, DOC, DOCX (máx. 5MB)</p>
          </Section>

          <Section title="Estatísticas Rápidas" icon={<ChartBar size={20} weight="duotone" color={ACCENT} />}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                { icon: <ChartBar size={28} weight="duotone" color={ACCENT} />, label:'Vendas no Mês', value:'156' },
                { icon: <CurrencyDollar size={28} weight="duotone" color={ACCENT} />, label:'Comissão Acumulada', value:'R$ 6.240' },
                { icon: <Star size={28} weight="duotone" color={ACCENT} />, label:'Avaliação Média', value:'4.8' },
                { icon: <Storefront size={28} weight="duotone" color={ACCENT} />, label:'Segmentos Ativos', value: perfil.segmentosAtendidos.length },
              ].map((s, i) => (
                <div key={i} style={{ padding:'18px 14px', background:'#f8f9fa', borderRadius:10, textAlign:'center' }}>
                  <div style={{ marginBottom:8 }}>{s.icon}</div>
                  <p style={{ fontSize:12, color:'#888', margin:'0 0 6px' }}>{s.label}</p>
                  <p style={{ fontSize:'1.2rem', fontWeight:700, color:PRIMARY, margin:0 }}>{s.value}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div style={{ background:'white', borderRadius:12, padding:24, boxShadow:'0 2px 10px rgba(0,0,0,0.07)' }}>
    <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'#333', marginBottom:16, paddingBottom:10, borderBottom:'2px solid #f0f0f0', display:'flex', alignItems:'center', gap:8 }}>
      {icon} {title}
    </h3>
    {children}
  </div>
);

const InfoGrid = ({ children }) => (
  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14 }}>
    {children}
  </div>
);

const InfoField = ({ label, icon, value, isEditing, onChange }) => (
  <div>
    <label style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.8rem', color:'#888', fontWeight:600, marginBottom:4 }}>
      {icon} {label}
    </label>
    {isEditing
      ? <input type="text" value={value} onChange={e => onChange(e.target.value)}
          style={{ width:'100%', padding:'8px 12px', border:'2px solid #e0e0e0', borderRadius:8, fontSize:'0.95rem', boxSizing:'border-box' }} />
      : <p style={{ margin:0, color:'#333', fontSize:'0.95rem' }}>{value || '—'}</p>
    }
  </div>
);

const S = {
  card: { background:'white', borderRadius:12, padding:24, boxShadow:'0 2px 10px rgba(0,0,0,0.07)', marginBottom:24 },
  btnPrimary: { background:`linear-gradient(135deg,${PRIMARY},${ACCENT})`, color:'white', border:'none', padding:'10px 18px', borderRadius:8, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontSize:14 },
  btnSuccess: { background:'#059669', color:'white', border:'none', padding:'10px 18px', borderRadius:8, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontSize:14 },
  btnDanger: { background:'#dc3545', color:'white', border:'none', padding:'10px 18px', borderRadius:8, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontSize:14 },
  btnGray: { background:'#6c757d', color:'white', border:'none', padding:'10px 18px', borderRadius:8, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontSize:14 },
};

export default ProfilePanel;