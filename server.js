const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
app.post('/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 300, system: system, messages }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data });
    const reply = data.content?.[0]?.text || "I am here for you";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/health', (req, res) => res.json({ status: 'ok', app: 'Lily AI Proxy' }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Lily proxy running on port ' + PORT));
