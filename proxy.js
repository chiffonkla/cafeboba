const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());

const YELP_API_KEY = '3C76-SPs628xCyyuv_tZq-_RFCWBtrCHZjHodYdm3xkzhEf4g7rPto7L62RmxX-bEDbBcPFtzDZj2v-jrWReRB8xwKYLPBVLEVw7EqOBB5HGETpH_i9ZpOUC3UvVZnYx'; // Replace with your actual Yelp API key

app.get('/api/yelp', async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data from Yelp API');
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
