// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'; 
import logo from './assets/teacoffee.png'; 
import MapContainer from './components/MapContainer';
import SearchBar from './components/SearchBar';
import { getCafesAndBobaSpots } from './services/yelpService';

const mapStyles = {
  streets: 'mapbox://styles/mapbox/streets-v11',
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
};

const App = () => {
  const [cafes, setCafes] = useState([]);
  const [bookmarkedCafes, setBookmarkedCafes] = useState([]); 
  const [notes, setNotes] = useState({}); 
  const [icons, setIcons] = useState({});  
  const [mapCenter, setMapCenter] = useState({ lat: 33.6846, lng: -117.8265 }); 
  const [mapStyle, setMapStyle] = useState(mapStyles.streets);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedCafes'));
    if (savedBookmarks) {
      setBookmarkedCafes(savedBookmarks);
    }

    const savedNotes = JSON.parse(localStorage.getItem('cafeNotes'));
    if (savedNotes) {
      setNotes(savedNotes);
    }

    const savedIcons = JSON.parse(localStorage.getItem('cafeIcons'));
    if (savedIcons) {
      setIcons(savedIcons);
    }
  }, []);

  const handleSearch = async (location, category, filters) => {
    const results = await getCafesAndBobaSpots(location, category, filters);
    setCafes(results);

    if (results.length > 0) {
      const { latitude, longitude } = results[0].coordinates;
      setMapCenter({ lat: latitude, lng: longitude });
    }
  };

  const handleStyleChange = (styleKey) => {
    setMapStyle(mapStyles[styleKey]);
  };

  const handleBookmark = (cafe) => {
    let updatedBookmarks;
    let updatedIcons = { ...icons };

    if (bookmarkedCafes.some(bookmarkedCafe => bookmarkedCafe.id === cafe.id)) {
      updatedBookmarks = bookmarkedCafes.filter(bookmarkedCafe => bookmarkedCafe.id !== cafe.id);

      if (updatedIcons[cafe.id]) {
        delete updatedIcons[cafe.id];
      }
    } else {
      updatedBookmarks = [...bookmarkedCafes, cafe];
    }

    setBookmarkedCafes(updatedBookmarks);
    setIcons(updatedIcons); 

    localStorage.setItem('bookmarkedCafes', JSON.stringify(updatedBookmarks)); 
    localStorage.setItem('cafeIcons', JSON.stringify(updatedIcons)); 
  };

  const handleAddNote = (cafeId, note) => {
    const updatedNotes = { ...notes, [cafeId]: note };
    setNotes(updatedNotes);
    localStorage.setItem('cafeNotes', JSON.stringify(updatedNotes)); 
  };

  const handleSelectIcon = (cafeId, icon) => {
    const updatedIcons = { ...icons, [cafeId]: icon };
    setIcons(updatedIcons);
    localStorage.setItem('cafeIcons', JSON.stringify(updatedIcons)); 
  };

  return (
    <div className="app">
      <header className="app-header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="app-logo" />
        <h1>Lattea Love</h1>
      </div>
        <div className="theme-dropdown">
          <label>
            Map Style:
            <select onChange={(e) => handleStyleChange(e.target.value)}>
              <option value="streets">Streets</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="outdoors">Outdoors</option>
              <option value="satellite">Satellite</option>
            </select>
          </label>
        </div>
      </header>

      <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="map-and-bookmarks">
        <MapContainer
          cafes={cafes}
          onBookmark={handleBookmark}
          bookmarkedCafes={bookmarkedCafes}
          onAddNote={handleAddNote}
          notes={notes}
          onSelectIcon={handleSelectIcon}
          icons={icons}
          mapCenter={mapCenter} 
          mapStyle={mapStyle}  
        />
        <div className="bookmarks">
          <h2>Bookmarked</h2>
          <ul>
            {bookmarkedCafes.map((cafe) => (
              <li key={cafe.id}>
                {/* Add a link to the Yelp page */}
                <a href={cafe.url} target="_blank" rel="noopener noreferrer" className="restaurant-name">
                  {cafe.name}
                </a>
                <br />
                <small>{notes[cafe.id]}</small> {/* Display the note if available */}
                <br />
                <img src={icons[cafe.id]} alt="Selected Icon" style={{ width: '20px', height: '20px' }} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="footer">
        © 2024 Lattea Love. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
