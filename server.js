const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/chat', async (req, res) => {
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:300,system:req.body.system,messages:req.body.messages})
    });
    const d = await r.json();
    res.json({reply: d.content?.[0]?.text || 'Here for you'});
  } catch(e) {
    res.status(500).json({error:'Server error'});
  }
});
app.get('/health', (req, res) => res.json({status:'ok'}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('Listening on ' + PORT));
