export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nepovolená metoda' });
  
  try {
    const userMessage = req.body.messages[0].content;
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    
    // Extrahování odpovědi z formátu Gemini a odeslání do frontendu
    const replyText = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ content: [{ text: replyText }] });
  } catch (error) {
    res.status(500).json({ error: 'Chyba serveru' });
  }
}