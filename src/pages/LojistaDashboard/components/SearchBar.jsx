import React, { useState } from "react";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Pesquisar...",
  filtros = [],
  onFiltroChange 
}) => {
  const [termo, setTermo] = useState("");

  const handleSearch = (e) => {
    const valor = e.target.value;
    setTermo(valor);
    onSearch(valor);
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        <div style={styles.searchIcon}></div>
        <input
          type="text"
          value={termo}
          onChange={handleSearch}
          placeholder={placeholder}
          style={styles.input}
        />
      </div>
      
      {filtros.length > 0 && (
        <div style={styles.filtros}>
          {filtros.map((filtro, index) => (
            <select
              key={index}
              onChange={(e) => onFiltroChange(filtro.chave, e.target.value)}
              style={styles.select}
            >
              <option value="">{filtro.label}</option>
              {filtro.opcoes.map((opcao, opIndex) => (
                <option key={opIndex} value={opcao.valor}>
                  {opcao.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchContainer: {
    position: "relative",
    flex: 1,
    minWidth: "250px",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#666",
    fontSize: "1rem",
  },
  input: {
    width: "100%",
    padding: "12px 12px 12px 40px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "0.9rem",
  },
  filtros: {
    display: "flex",
    gap: "10px",
  },
  select: {
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "0.9rem",
    backgroundColor: "white",
    cursor: "pointer",
    minWidth: "150px",
  },
};

export default SearchBar;