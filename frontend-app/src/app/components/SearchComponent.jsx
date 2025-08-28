import { Clear, Search } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";
import React, { useEffect } from "react";

const SearchComponent = ({
  searchTerm,
  handleSearchChange,
  handleSearchButton,
  handleClearSearch,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchButton();
    }
  };
  useEffect(() => {
    if (searchTerm.length == 0) {
      handleClearSearch();
    }
  }, [searchTerm]);
  return (
    <Paper
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 250,
        borderRadius: 1,
        boxShadow: 2,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        inputProps={{ "aria-label": "search" }}
      />
      {searchTerm && (
        <IconButton
          size="small"
          sx={{ p: "10px" }}
          onClick={handleClearSearch}
          aria-label="clear"
        >
          <Clear />
        </IconButton>
      )}
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={handleSearchButton}
      >
        <Search />
      </IconButton>
    </Paper>
  );
};

export default SearchComponent;
