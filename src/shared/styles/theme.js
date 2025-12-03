// app-frontend/src/shared/styles/theme.js

// ====================================
// TEMA GLOBAL - USADO POR TODOS
// ====================================

export const COLORS = {
    primary: "#2c5aa0",
    primaryLight: "#eaf2ff",
    primaryDark: "#1c3d73",
    
    secondary: "#495057",
    success: "#28a745",
    warning: "#ffc107",
    danger: "#dc3545",
    info: "#17a2b8",
    
    white: "#FFFFFF",
    lightGrey: "#f8f9fa",
    grey: "#6c757d",
    darkGrey: "#495057",
    
    border: "#e9ecef",
    shadow: "rgba(0, 0, 0, 0.1)",
};

export const FONTS = {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    sizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.25rem",
        xl: "1.5rem",
        xxl: "2rem",
    },
    weights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
};

export const SPACING = {
    xs: "5px",
    sm: "10px",
    md: "15px",
    lg: "20px",
    xl: "30px",
    xxl: "40px",
};

export const SHADOWS = {
    sm: "0 2px 4px rgba(0, 0, 0, 0.05)",
    md: "0 4px 12px rgba(0, 0, 0, 0.1)",
    lg: "0 8px 30px rgba(0, 0, 0, 0.15)",
};

export const BORDER_RADIUS = {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    round: "50px",
    circle: "50%",
};

// ====================================
// ESTILOS DE DASHBOARD COMPARTILHADOS
// ====================================

export const dashboardStyles = {
    sidebar: {
        width: "250px",
        backgroundColor: COLORS.white,
        boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
    },
    
    menuItem: {
        display: "block",
        padding: "12px 20px",
        color: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
        borderRadius: "0 50px 50px 0",
        marginRight: "20px",
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.normal,
        textDecoration: "none",
        transition: "all 0.2s",
        borderLeft: "3px solid transparent",
    },
    
    menuItemActive: {
        backgroundColor: COLORS.white,
        fontWeight: FONTS.weights.bold,
        borderLeft: `3px solid ${COLORS.primary}`,
    },
    
    header: {
        backgroundColor: COLORS.white,
        padding: "20px 30px",
        borderBottom: `1px solid ${COLORS.border}`,
        boxShadow: SHADOWS.sm,
    },
    
    card: {
        backgroundColor: COLORS.white,
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.lg,
        boxShadow: SHADOWS.md,
        border: `1px solid ${COLORS.border}`,
    },
};

export default {
    COLORS,
    FONTS,
    SPACING,
    SHADOWS,
    BORDER_RADIUS,
    dashboardStyles,
};