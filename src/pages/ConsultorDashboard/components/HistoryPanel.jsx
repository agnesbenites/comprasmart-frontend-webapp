import React, { useState } from 'react';
// Importacao de Hooks e Constantes de Mock (para o contexto do arquivo unico)

// --- Constantes de Mock (Assumidas como disponiveis no App.jsx) ---
const QR_CODE_PLACEHOLDER = "https://placehold.co/128x128/2563eb/ffffff?text=QR+CODE";
const PRIMARY_COLOR = "bg-blue-600";

// Mock de dados historicos de atendimentos
const MOCK_HISTORY = [
    {
        id: 'ATT-20230520-001',
        clientId: 'CLI-001',
        clienteNome: 'Cliente Alpha',
        data: '20/05/2023',
        horario: '14:30',
        duracao: '15 min',
        venda: true,
        valor: 350.00,
        comissao: 17.50, // 5% de comissao
        statusPagamento: 'Pago',
        qrCodeId: 'QR-345678',
        produtos: [{nome: 'Smartwatch X', quantidade: 1, preco: 350.00}],
        mesAno: 'Maio/2023',
    },
    {
        id: 'ATT-20230519-002',
        clientId: 'CLI-002',
        clienteNome: 'Cliente Beta (An´nimo)',
        data: '19/05/2023',
        horario: '09:00',
        duracao: '30 min',
        venda: false,
        valor: 0.00,
        comissao: 0.00,
        statusPagamento: 'N/A',
        qrCodeId: null,
        produtos: [],
        mesAno: 'Maio/2023',
    },
    {
        id: 'ATT-20230410-003',
        clientId: 'CLI-003',
        clienteNome: 'Cliente Gama',
        data: '10/04/2023',
        horario: '17:45',
        duracao: '10 min',
        venda: true,
        valor: 285.00,
        comissao: 14.25,
        statusPagamento: 'Pendente',
        qrCodeId: 'QR-123456',
        produtos: [{nome: 'Fone Bluetooth', quantidade: 2, preco: 120.00}, {nome: 'Capa Protetora', quantidade: 1, preco: 45.00}],
        mesAno: 'Abril/2023',
    },
];

// Funcao para agrupar o historico por Mas/Ano
const groupHistoryByMonth = (history) => {
    return history.reduce((acc, item) => {
        const key = item.mesAno;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});
};

// Componente auxiliar para mensagens vazias (assumido)
const EmptyState = ({ icon, title, subtitle }) => (
    <div className="text-center p-10 bg-gray-50 rounded-xl shadow-inner mt-6">
        <div className="text-6xl mb-4">{icon}</div>
        <p className="text-xl font-semibold text-gray-700 mb-2">{title}</p>
        <p className="text-md text-gray-500">{subtitle}</p>
    </div>
);

// --- Componente Principal ---
const HistoryPanel = () => {
    const groupedHistory = groupHistoryByMonth(MOCK_HISTORY);

    const handleReportProblem = (attendanceId) => {
        // Logica: Abrir modal de formulario ou navegar para a pagina de relatorio
        alert(`Relatorio de problema iniciado para o Atendimento ID: ${attendanceId}.`);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-6"> Historico de Atendimentos</h1>
            <p className="text-gray-600 mb-6">Visao detalhada de todas as interacoes e vendas, organizada por mas (similar a um extrato).</p>
            
            {Object.keys(groupedHistory).length === 0 ? (
                <EmptyState icon="" title="Nenhum Historico Encontrado" subtitle="Comece a atender clientes para popular seu historico." />
            ) : (
                <div className="space-y-8">
                    {Object.keys(groupedHistory).map((mesAno) => (
                        <div key={mesAno} className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Cabecalho do Mas (Extrato) */}
                            <div className={`p-4 ${PRIMARY_COLOR} text-white font-bold text-lg`}>
                                {mesAno}
                            </div>

                            {/* Detalhes dos Atendimentos */}
                            <div className="divide-y divide-gray-100">
                                {groupedHistory[mesAno].map((item, index) => (
                                    <details key={item.id} className="group cursor-pointer hover:bg-blue-50 transition-colors">
                                        <summary className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                                            
                                            {/* Coluna 1: ID e Data (Sempre visivel) */}
                                            <div className="w-full md:w-1/4 mb-2 md:mb-0">
                                                <p className="text-sm font-semibold text-gray-900">ID: {item.id}</p>
                                                <p className="text-xs text-gray-500">{item.data}  s {item.horario}</p>
                                            </div>

                                            {/* Coluna 2: Venda e Comissao (Sempre visivel) */}
                                            <div className="flex w-full md:w-1/4 justify-between md:justify-start gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-700">Venda:</p>
                                                    <p className={`font-bold ${item.venda ? 'text-green-600' : 'text-gray-500'}`}>R$ {item.valor.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-700">Comissao:</p>
                                                    <p className="font-bold text-yellow-600">R$ {item.comissao.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            {/* Coluna 3: Status e Cliente (Sempre visivel) */}
                                            <div className="w-full md:w-1/4 mt-2 md:mt-0">
                                                <p className="text-xs font-semibold text-gray-700">Status:</p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    item.statusPagamento === 'Pago' ? 'bg-green-100 text-green-700' :
                                                    item.statusPagamento === 'Pendente' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {item.statusPagamento}
                                                </span>
                                            </div>

                                            {/* Botao de Expansao (Sempre visivel) */}
                                            <div className="w-full md:w-auto mt-2 md:mt-0 text-right">
                                                <span className={`text-blue-600 font-semibold text-sm`}>
                                                    Detalhes {item.produtos.length > 0 ? '(Venda)' : '(Atendimento)'}
                                                </span>
                                            </div>
                                        </summary>

                                        {/* Detalhes Expansiveis (Menu Suspenso) */}
                                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                
                                                {/* Informacoes do Cliente (Protegidas) */}
                                                <div>
                                                    <h4 className="font-bold text-gray-800 mb-2"> Dados do Atendimento</h4>
                                                    <p className="text-sm text-gray-600"><strong>Cliente:</strong> {item.clienteNome}</p>
                                                    {/* Ocultando a maior parte do ID para privacidade */}
                                                    <p className="text-sm text-gray-600"><strong>ID Cliente:</strong> {item.clientId.replace(/(\w{3})\w+(\w{3})/, '$1****$2')}</p> 
                                                    <p className="text-sm text-gray-600"><strong>Duracao:</strong> {item.duracao}</p>
                                                </div>

                                                {/* Produtos Vendidos (Menu Suspenso) */}
                                                <div>
                                                    <h4 className="font-bold text-gray-800 mb-2"> Produtos Vendidos</h4>
                                                    {item.produtos.length > 0 ? (
                                                        <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                                            {item.produtos.map((p, pIndex) => (
                                                                <li key={pIndex}>{p.nome} ({p.quantidade}x) - R$ {p.preco.toFixed(2)}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">Nenhum produto registrado.</p>
                                                    )}
                                                </div>

                                                {/* QR Code e Acoes */}
                                                <div className="text-center md:text-left">
                                                    <h4 className="font-bold text-gray-800 mb-2"> QR Code (Venda)</h4>
                                                    {item.qrCodeId ? (
                                                        <>
                                                            <img src={QR_CODE_PLACEHOLDER} alt="QR Code" className="w-20 h-20 mx-auto md:mx-0 p-1 border border-gray-300 rounded" />
                                                            <p className="text-xs text-gray-500 mt-1">Ref. {item.qrCodeId}</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">Nao aplicavel.</p>
                                                    )}
                                                    
                                                    <button
                                                        onClick={() => handleReportProblem(item.id)}
                                                        className="mt-4 w-full md:w-auto bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                                                    >
                                                         Reportar Problema
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default HistoryPanel;

