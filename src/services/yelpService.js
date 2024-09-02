// src/services/yelpService.js
import axios from 'axios';

const YELP_API_KEY = '3C76-SPs628xCyyuv_tZq-_RFCWBtrCHZjHodYdm3xkzhEf4g7rPto7L62RmxX-bEDbBcPFtzDZj2v-jrWReRB8xwKYLPBVLEVw7EqOBB5HGETpH_i9ZpOUC3UvVZnYx';

const getCafesAndBobaSpots = async (location, category, filters) => {
  const url = 'https://api.yelp.com/v3/businesses/search';
  const params = {
    term: category, 
    location: location,
    categories: 'cafes, bubbletea', 
    limit: 10,
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
