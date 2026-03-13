export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).end();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const body = {
      model: req.body.model,
      max_tokens: req.body.max_tokens,
      system: req.body.system,
      messages: req.body.messages,
      mcp_servers: [
        {
          type: "url",
          url: "https://mcp.airtable.com/mcp",
          name: "airtable",
          authorization_token: process.env.AIRTABLE_TOKEN,
        }
      ],
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "mcp-client-2025-04-04",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Return full response including any errors
    console.log("Anthropic response:", JSON.stringify(data).slice(0, 500));
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Handler error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
