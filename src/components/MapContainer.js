// src/components/MapContainer.js
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import './MapContainer.css'; 
//import bookmarkedIcon from '../assets/Macrons.png'; 
import defaultIcon from '../assets/01_dish.png'; 
import teaIcon from '../assets/cocktail_2.png'; 
import coffeeIcon from '../assets/CherryChocolatePot.png'; 
import bobaIcon from '../assets/Bubble Milk Tea.png'; 

const containerStyle = {
  width: '100%',
  height: '600px',
};

const MapContainer = ({ cafes, onBookmark, bookmarkedCafes, onAddNote, notes, onSelectIcon, icons, onAddToRoute, directions, mapCenter, mapTheme }) => {
  const [selectedCafe, setSelectedCafe] = useState(null); 
  const [noteInput, setNoteInput] = useState('');

  const isBookmarked = (cafe) => {
    return bookmarkedCafes.some(bookmarkedCafe => bookmarkedCafe.id === cafe.id);
  };

  const getMarkerIcon = (cafe) => {
    return icons[cafe.id] || defaultIcon; 
  };

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    if (selectedCafe) {
      onAddNote(selectedCafe.id, noteInput);
      setNoteInput(''); 
    }
  };

  const handleIconChange = (event, cafeId) => {
    const icon = event.target.value;
    onSelectIcon(cafeId, icon);
  };

  const handleMapClick = () => {
    setSelectedCafe(null); 
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDTm1vIojMN4RA2iyTa4BlOzDaIxES-9OE">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter} 
        zoom={13}
        onClick={handleMapClick} 
        options={{ styles: mapTheme }} 
      >
        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            position={{
              lat: cafe.coordinates.latitude,
              lng: cafe.coordinates.longitude,
            }}
            title={cafe.name}
            icon={getMarkerIcon(cafe)}
            onClick={() => {
              setSelectedCafe(cafe);
              setNoteInput(notes[cafe.id] || ''); 
            }}
          />
        ))}
        {selectedCafe && (
          <InfoWindow
            position={{
              lat: selectedCafe.coordinates.latitude,
              lng: selectedCafe.coordinates.longitude,
            }}
            onCloseClick={() => setSelectedCafe(null)}
          >
            <div className="info-window">
              <h2>{selectedCafe.name}</h2>
              <p>{selectedCafe.location.address1}</p>
              <p>Rating: {selectedCafe.rating} / 5</p>
              <button onClick={() => onBookmark(selectedCafe)}>
                {isBookmarked(selectedCafe) ? 'Remove Bookmark' : 'Add to Bookmarks'}
              </button>
              <button onClick={() => onAddToRoute(selectedCafe)}>Add to Route</button>
              <form onSubmit={handleNoteSubmit}>
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add a note or tag"
                  className="note-textarea"
                />
                <button type="submit">Save Note</button>
              </form>
              <div className="icon-selection">
                <label>Select Icon:</label>
                <select value={icons[selectedCafe.id] || ''} onChange={(e) => handleIconChange(e, selectedCafe.id)}>
                  <option value={defaultIcon}>Default</option>
                  <option value={teaIcon}>Tea</option>
                  <option value={coffeeIcon}>Coffee</option>
                  <option value={bobaIcon}>Boba</option>
                </select>
              </div>
              <a href={selectedCafe.url} target="_blank" rel="noopener noreferrer" className="yelp-link">
                View more on Yelp
              </a>
            </div>
          </InfoWindow>
        )}
        {directions && (
          <DirectionsRenderer directions={directions} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
