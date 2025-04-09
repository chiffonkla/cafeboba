// src/SearchBar.js
import React, { useState } from 'react';
import './SearchBar.css'; 

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('cafe');
  const [filters, setFilters] = useState({
    freeWiFi: false,
    quiet: false,
    outdoorSeating: false,
  });

  const handleSearch = () => {
    onSearch(location, category, filters);
  };

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter city location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="search-input"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="search-select"
      >
        <option value="cafe">Cafe</option>
        <option value="study spot">Study Spot</option>
        <option value="bakery">Bakery</option>
        <option value="milk tea">Milk Tea</option>
        <option value="fruit tea">Fruit Tea</option>
        <option value="coffee">Coffee</option>
      </select>
      <div className="filters">
        <label>
          <input
            type="checkbox"
            name="freeWiFi"
            checked={filters.freeWiFi}
            onChange={handleFilterChange}
          />
          Free Wi-Fi
        </label>
        <label>
          <input
            type="checkbox"
            name="quiet"
            checked={filters.quiet}
            onChange={handleFilterChange}
          />
          Quiet Atmosphere
        </label>
        <label>
          <input
            type="checkbox"
            name="outdoorSeating"
            checked={filters.outdoorSeating}
            onChange={handleFilterChange}
          />
          Outdoor Seating
        </label>
      </div>
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
