// shared/components/Button.jsx
import React from 'react';
import { COLORS, BORDER_RADIUS } from '../styles/theme';

const Button = ({ children, variant = 'primary', onClick, ...props }) => {
    const styles = {
        primary: {
            backgroundColor: COLORS.primary,
            color: COLORS.white,
        },
        success: {
            backgroundColor: COLORS.success,
            color: COLORS.white,
        },
        // ... outros variants
    };

    return (
        <button
            onClick={onClick}
            style={{
                ...styles[variant],
                padding: '10px 20px',
                borderRadius: BORDER_RADIUS.md,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;