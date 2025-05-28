const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from your frontend

const API_URL = 'https://api.perplexity.ai/v1/chat/completions';
const API_KEY = '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'; // Move to env var for production!

app.post('/api/sonar', async (req, res) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy server error', details: err.message });
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on http://localhost:3001');
});
