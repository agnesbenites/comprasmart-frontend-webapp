// /src/pages/api/arena/mensagem.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { sessaoId, mensagem } = req.body;

    if (!sessaoId || !mensagem) {
      return res.status(400).json({ error: 'sessaoId e mensagem são obrigatórios' });
    }

    // --- SIMULAÇÃO DE RESPOSTA DO CLIENTE ---
    // Aqui você pode colocar lógica real de IA ou regras de negócio
    const respostas = [
      "Interessante, me conte mais sobre esse produto.",
      "Qual a diferença em relação a outros modelos?",
      "Estou quase decidindo, precisa de mais detalhes.",
      "Pode me dar mais informações sobre cores e modelos?"
    ];

    // Simula pegar uma resposta aleatória
    const mensagem_cliente = respostas[Math.floor(Math.random() * respostas.length)];

    // --- SIMULAÇÃO DE TURNOS ---
    // Você pode armazenar em banco real, aqui apenas decrementamos 1
    let turnos_restantes = 8; // valor inicial
    if (req.body.turnos_restantes !== undefined) {
      turnos_restantes = Math.max(0, req.body.turnos_restantes - 1);
    } else {
      turnos_restantes = 7;
    }

    // --- SIMULAÇÃO DE FINALIZAÇÃO ---
    const finalizada = turnos_restantes === 0 || Math.random() < 0.1; // 10% chance de fechar a venda

    // --- SIMULAÇÃO DE FEEDBACK ---
    const feedback = finalizada ? {
      pontuacao: Math.floor(Math.random() * 10) + 1,
      resumo: "Simulação finalizada. Avalie sua performance!",
      areas_bem: ["Apresentação clara do produto", "Escuta ativa do cliente"],
      areas_melhorar: ["Fornecer mais detalhes técnicos", "Fazer perguntas abertas"],
      dicas: ["Use exemplos práticos", "Explore mais benefícios do produto"]
    } : null;

    res.status(200).json({
      mensagem_cliente,
      turnos_restantes,
      finalizada,
      feedback,
      fechou: finalizada && Math.random() < 0.5, // aleatório se fechou ou desistiu
      desistiu: finalizada ? Math.random() < 0.5 : false
    });

  } catch (err) {
    console.error('[API ArenaMensagem] erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
