// src/services/yelpService.js
import axios from 'axios';

const YELP_API_KEY = process.env.REACT_APP_YELP_API_KEY;

const getCafesAndBobaSpots = async (location, category, filters) => {
  const url = 'https://api.yelp.com/v3/businesses/search';
  let categories = 'cafes,teahouses,tearooms,coffeeshops,coffeeroasteries,bakeries,coffee,tea';
  const params = {
    term: category, 
    location: location,
    categories: categories, 
    radius: 6437,
    limit: 20,
  };

  if (filters.freeWiFi) {
    params.attributes = params.attributes ? `${params.attributes},wifi` : 'wifi';
  }
  if (filters.outdoorSeating) {
    params.attributes = params.attributes ? `${params.attributes},outdoor_seating` : 'outdoor_seating';
  }

  if (filters.quiet) {
    params.term += ',study_spots'; 
  }

  const headers = {
    Authorization: `Bearer ${YELP_API_KEY}`,
  };

  try {
    const response = await axios.get(url, { headers, params });
    return response.data.businesses;
  } catch (error) {
    console.error('Error fetching data from Yelp API:', error);
    return [];
  }
};

export { getCafesAndBobaSpots };
