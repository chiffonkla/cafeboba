// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'; 
import MapContainer from './components/MapContainer';
import SearchBar from './components/SearchBar';
import { getCafesAndBobaSpots } from './services/yelpService';
import { defaultTheme, darkTheme, retroTheme } from './mapThemes'; 

const App = () => {
  const [cafes, setCafes] = useState([]);
  const [bookmarkedCafes, setBookmarkedCafes] = useState([]); 
  const [notes, setNotes] = useState({}); 
  const [icons, setIcons] = useState({}); 
  const [selectedRoute, setSelectedRoute] = useState([]); 
  const [directions, setDirections] = useState(null); 
  const [travelMode, setTravelMode] = useState('DRIVING'); 
  const [directionsList, setDirectionsList] = useState([]); 
  const [mapCenter, setMapCenter] = useState({ lat: 33.6846, lng: -117.8265 }); 
  const [mapTheme, setMapTheme] = useState(defaultTheme); 

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

  const handleThemeChange = (theme) => {
    switch (theme) {
      case 'dark':
        setMapTheme(darkTheme);
        break;
      case 'retro':
        setMapTheme(retroTheme);
        break;
      default:
        setMapTheme(defaultTheme);
        break;
    }
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

  const handleAddToRoute = (cafe) => {
    if (!selectedRoute.includes(cafe)) {
      setSelectedRoute([...selectedRoute, cafe]);
    }
  };

  const calculateRoute = () => {
    if (selectedRoute.length < 2) {
      alert('Please select at least two spots to plan a route.');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const waypoints = selectedRoute.map(spot => ({
      location: { lat: spot.coordinates.latitude, lng: spot.coordinates.longitude },
      stopover: true
    }));
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode[travelMode], 
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          extractDirections(result); 
        } else {
          console.error(`Error fetching directions: ${result}`);
        }
      }
    );
  };

  const extractDirections = (result) => {
    const steps = [];
    const legs = result.routes[0].legs;
    legs.forEach((leg) => {
      leg.steps.forEach((step) => {
        const distance = step.distance.text; 
        const instruction = step.instructions;
        steps.push(`${instruction} (${distance})`); 
      });
    });
    setDirectionsList(steps);
  };

  const clearRoute = () => {
    setSelectedRoute([]); 
    setDirections(null);  
    setDirectionsList([]); 
  };

  const moveRouteItem = (index, direction) => {
    const newRoute = [...selectedRoute];
    const [removed] = newRoute.splice(index, 1);
    newRoute.splice(index + direction, 0, removed);
    setSelectedRoute(newRoute);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Café and Boba Spot Explorer</h1>
        <div className="theme-dropdown">
          <label>
            Map Theme:
            <select onChange={(e) => handleThemeChange(e.target.value)}>
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="retro">Retro</option>
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
          onAddToRoute={handleAddToRoute}
          directions={directions}
          mapCenter={mapCenter} 
          mapTheme={mapTheme} 
          containerStyle={{ width: '70%', height: '500px' }} 
        />
        <div className="bookmarks">
          <h2>Bookmarked Cafes</h2>
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

      <div className="route-planner">
        <h2>Selected Route</h2>
        <ul>
          {selectedRoute.map((cafe, index) => (
            <li key={cafe.id}>
              {String.fromCharCode(65 + index)}. {cafe.name} {/* Display label (A, B, C, ...) */}
              <button disabled={index === 0} onClick={() => moveRouteItem(index, -1)}>↑</button>
              <button disabled={index === selectedRoute.length - 1} onClick={() => moveRouteItem(index, 1)}>↓</button>
            </li>
          ))}
        </ul>
        <label>
          Travel Mode:
          <select value={travelMode} onChange={(e) => setTravelMode(e.target.value)}>
            <option value="DRIVING">Driving</option>
            <option value="BICYCLING">Bicycling</option>
            <option value="WALKING">Walking</option>
          </select>
        </label>
        <button onClick={calculateRoute}>Calculate Route</button>
        <button onClick={clearRoute}>Clear Route</button>
      </div>
      
      {directionsList.length > 0 && (
        <div className="directions-list">
          <h2>Directions</h2>
          <ol>
            {directionsList.map((instruction, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: instruction }}></li>
            ))}
          </ol>
        </div>
      )}

      <footer className="footer">
        © 2024 Café and Boba Spot Explorer. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
