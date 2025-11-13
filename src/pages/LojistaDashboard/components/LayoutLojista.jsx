import React from "react";
import SidebarLojista from "./SidebarLojista";
import HeaderLojista from "./HeaderLojista";

const LayoutLojista = ({ children, usuario }) => {
  return (
    <div style={styles.container}>
      <SidebarLojista />
      <div style={styles.main}>
        <HeaderLojista usuario={usuario} />
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
  },
};

export default LayoutLojista;