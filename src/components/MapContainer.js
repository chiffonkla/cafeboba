// src/components/MapContainer.js
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapContainer.css';
import defaultIcon from '../assets/01_dish.png';
import teaIcon from '../assets/cocktail_2.png';
import coffeeIcon from '../assets/CherryChocolatePot.png';
import bobaIcon from '../assets/Bubble Milk Tea.png';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; 

const MapContainer = ({
  cafes,
  onBookmark,
  bookmarkedCafes,
  onAddNote,
  notes,
  onSelectIcon,
  icons,
  onAddToRoute,
  mapCenter,
  mapStyle
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedCafe, setSelectedCafe] = useState(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [mapCenter.lng, mapCenter.lat],
      zoom: 13,
    });

    mapRef.current.on('click', () => {
      setSelectedCafe(null);
    });
  }, [mapStyle, mapCenter.lat, mapCenter.lng]);

  useEffect(() => {
    if (mapRef.current && mapCenter) {
      mapRef.current.flyTo({
        center: [mapCenter.lng, mapCenter.lat],
        zoom: 11, 
        essential: true
      });
    }
  }, [mapCenter]);

  useEffect(() => {
    if (!mapRef.current || !cafes) return;

    const oldMarkers = document.getElementsByClassName('cafe-marker');
    Array.from(oldMarkers).forEach((el) => el.remove());

    cafes.forEach((cafe) => {
      const icon = icons[cafe.id] || defaultIcon;

      const el = document.createElement('img');
      el.src = icon;
      el.className = 'cafe-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.cursor = 'pointer';

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedCafe(cafe);
      });

      new mapboxgl.Marker(el)
        .setLngLat([cafe.coordinates.longitude, cafe.coordinates.latitude])
        .addTo(mapRef.current);
    });
  }, [cafes, icons]);

  useEffect(() => {
    if (mapRef.current && mapStyle) {
      mapRef.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  const isBookmarked = (cafe) => {
    return bookmarkedCafes.some((item) => item.id === cafe.id);
  };

  const handleNoteChange = (e) => {
    onAddNote(selectedCafe.id, e.target.value);
  };

  const handleIconChange = (e) => {
    onSelectIcon(selectedCafe.id, e.target.value);
  };

  return (
    <div className="mapbox-wrapper map-container">
      <div ref={mapContainerRef} className="mapbox-map" />

      {selectedCafe && (
        <div className="mapbox-popup">
          <h2>{selectedCafe.name}</h2>
          <p>{selectedCafe.location.address1}</p>
          <p>Rating: {selectedCafe.rating} / 5</p>

          <div className="popup-buttons">
            <button onClick={() => onBookmark(selectedCafe)}>
              {isBookmarked(selectedCafe) ? 'Remove Bookmark' : 'Add to Bookmarks'}
            </button>
            {/* <button onClick={() => onAddToRoute(selectedCafe)}>Add to Route</button> */}
          </div>

          <textarea
            value={notes[selectedCafe.id] || ''}
            onChange={handleNoteChange}
            placeholder="Add a note or tag"
            className="note-textarea"
          />

          <div className="icon-selection">
            <label>Select Icon:</label>
            <select value={icons[selectedCafe.id] || ''} onChange={handleIconChange}>
              <option value={defaultIcon}>Default</option>
              <option value={teaIcon}>Tea</option>
              <option value={coffeeIcon}>Coffee</option>
              <option value={bobaIcon}>Boba</option>
            </select>
          </div>

          <a
            href={selectedCafe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="yelp-link"
          >
            View more on Yelp
          </a>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
