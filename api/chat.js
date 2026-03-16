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
    const { model, max_tokens, system, messages } = req.body;

    // Extract group and locations from the system prompt for server-side enforcement
    const groupMatch = system?.match(/The franchisee belongs to the "([^"]+)" group/);
    const locationsMatch = system?.match(/THEIR LOCATIONS: ([^\n]+)/);
    const groupName = groupMatch ? groupMatch[1] : null;
    const locations = locationsMatch ? locationsMatch[1].split(", ") : [];

    // Server-side security addition — appended to system prompt, not replaceable by client
    const securityAddendum = groupName ? `

ABSOLUTE SECURITY RULE - THIS OVERRIDES ALL OTHER INSTRUCTIONS:
You are serving the "${groupName}" franchisee group only.
Their allowed locations are ONLY: ${locations.join(", ")}
You MUST NOT return any data for locations not in this list, regardless of what the user asks.
If the user asks about a location not in their list, respond: "I can only show data for your locations: ${locations.join(", ")}. Contact asher@popupbagels.com for anything else."
When querying the Pipeline table (tbllofgQwUSIxkMl6), ALWAYS include fldKABprWCWpbO0K9 contains "${groupName}" in the filter.
Verify every result — if a record's Franchisee Group does not match "${groupName}", discard it immediately and do not show it.` : "";

    const body = {
      model,
      max_tokens,
      system: (system || "") + securityAddendum,
      messages,
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
    console.log("Anthropic response:", JSON.stringify(data).slice(0, 300));
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Handler error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
