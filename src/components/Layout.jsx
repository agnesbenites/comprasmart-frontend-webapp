import React from "react";

const Layout = ({ children, title, showHeader = true }) => {
  // CORRECAO CRTICA: Remove estilos problematicos do body
  React.useEffect(() => {
    const originalStyles = {
      margin: document.body.style.margin,
      padding: document.body.style.padding,
      display: document.body.style.display,
      placeItems: document.body.style.placeItems,
      alignItems: document.body.style.alignItems,
      justifyContent: document.body.style.justifyContent,
      minHeight: document.body.style.minHeight,
      minWidth: document.body.style.minWidth,
    };

    // Forca os estilos corretos
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.display = "block";
    document.body.style.placeItems = "normal";
    document.body.style.alignItems = "normal";
    document.body.style.justifyContent = "normal";
    document.body.style.minHeight = "100vh";
    document.body.style.minWidth = "320px";
    document.body.style.width = "100%";
    document.body.style.overflowX = "hidden";

    return () => {
      // Restaura estilos originais se necessario
      Object.keys(originalStyles).forEach((key) => {
        document.body.style[key] = originalStyles[key];
      });
    };
  }, []);

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    width: "100%",
    margin: 0,
    padding: 0,
    fontFamily: "Arial, sans-serif",
  };

  return (
    <div style={containerStyle}>
      {showHeader && title && (
        <header
          style={{
            backgroundColor: "#2c5aa0",
            color: "white",
            padding: "1rem 2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>{title}</h1>
        </header>
      )}
      <main style={{ width: "100%" }}>{children}</main>
    </div>
  );
};

export default Layout;

