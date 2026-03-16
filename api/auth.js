export const config = { api: { bodyParser: true } };

const BASE_ID = "appoU9OEisJcLJMOz";
const TABLE_ID = "tbl5dgo5rXnser3Iu";
const AIRTABLE_API = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

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

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const normalized = email.trim().toLowerCase();

  try {
    let allRecords = [];
    let offset = null;

    do {
      // Request ALL fields so we don't miss anything
      const url = new URL(AIRTABLE_API);
      if (offset) url.searchParams.set("offset", offset);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
      });

      const data = await response.json();
      if (!data.records) {
        return res.status(500).json({ error: "Airtable error", detail: data });
      }
      allRecords = [...allRecords, ...(data.records || [])];
      offset = data.offset || null;
    } while (offset);

    for (const record of allRecords) {
      const fields = record.fields || {};

      // Group name is in "Name" field (fldQMU9W8XFjR66DI)
      const groupName = fields["Name"];
      if (!groupName) continue;

      // Members are in "User" field (fldgvzkOkhrh7YWb7) - collaborators array
      const members = fields["User"] || [];
      const match = Array.isArray(members)
        ? members.find(m => (m.email || "").toLowerCase() === normalized)
        : null;

      if (match) {
        // Locations are in "Locations" field (fldva34cqBTk6h0Jj) - linked records
        const locations = (fields["Locations"] || [])
          .filter(l => l.name && !l.name.startsWith("Prototype"));

        return res.status(200).json({
          group: groupName,
          locations: locations.map(l => l.name),
          locationIds: locations.map(l => l.id),
        });
      }
    }

    return res.status(404).json({ error: "not_found" });

  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
