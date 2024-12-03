import React, { useState } from "react";

function SearchInput({
  placeholder = "Search...",
  suggestions = [],
  onSearch,
}) {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.trim()) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    if (onSearch) onSearch(suggestion);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setShowSuggestions(false);
    if (onSearch) onSearch(inputValue);
  };

  const renderSuggestions = () =>
    filteredSuggestions.map((suggestion, index) => (
      <li
        key={index}
        className="list-group-item list-group-item-action"
        onClick={() => handleSuggestionClick(suggestion)}
      >
        {suggestion}
      </li>
    ));

  return (
    <div className="position-relati ve w-25">
      <form onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
          />

          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
      {showSuggestions && (
        <ul className="list-group position-absolute w-25 mt-1 z-index-100">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
}

export default SearchInput;
