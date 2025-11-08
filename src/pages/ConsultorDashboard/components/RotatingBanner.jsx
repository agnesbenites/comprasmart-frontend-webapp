// web-consultor/src/components/RotatingBanner.jsx

import React, { useState, useEffect } from 'react';

// Frases Mockadas (Substituiremos por URLs de Imagem ou Objetos complexos depois)
const FOCAL_MESSAGES = [
    { text: "Seu foco é a Satisfação do Cliente. Lembre-se da LGPD!", style: { color: '#1b3670', backgroundColor: '#e6e6fa' } },
    { text: "Busque o Produto Perfeito! Use o Alerta de Preços para fechar a venda.", style: { color: '#0062cc', backgroundColor: '#e0f7fa' } },
    { text: "Conecte-se: Vídeo Chamada gera mais Confiança e Conversão.", style: { color: '#28a744', backgroundColor: '#e8f5e9' } },
    { text: "Atendimento Rápido e Objetivo: Seu Tempo Médio de Atendimento é uma Métrica Chave.", style: { color: '#dc3545', backgroundColor: '#f8d7da' } },
];

const RotatingBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Efeito para rodar o banner a cada 7 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => 
                (prevIndex + 1) % FOCAL_MESSAGES.length
            );
        }, 7000); // Roda a cada 7 segundos
        
        // Limpeza do intervalo ao desmontar o componente
        return () => clearInterval(interval);
    }, []);

    const currentMessage = FOCAL_MESSAGES[currentIndex];

    return (
        <div style={{...styles.bannerContainer, ...currentMessage.style}}>
            <p style={styles.bannerText}>
                {currentMessage.text}
            </p>
        </div>
    );
};

const styles = {
    bannerContainer: {
        width: '100%',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center',
        transition: 'background-color 1s ease-in-out',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minHeight: '80px', // Garante altura mínima
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerText: {
        fontSize: '18px',
        fontWeight: 'bold',
        margin: 0,
    }
};

export default RotatingBanner;