export const config = { api: { bodyParser: true } };

const INTERNAL_GROUPS = ["PUB Corp", "Development", "C&T", "Singer", "CUAN", "JMC", "Seeded (BH Only)"];
const BASE_ID = "appoU9OEisJcLJMOz";
const TABLE_ID = "tbl5dgo5rXnser3Iu";
const FIELD_GROUP_NAME = "fldQMU9W8XFjR66DI";
const FIELD_MEMBERS = "fldgvzkOkhrh7YWb7";
const FIELD_LOCATIONS = "fldva34cqBTk6h0Jj";

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
      const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`);
      url.searchParams.append("fields[]", FIELD_GROUP_NAME);
      url.searchParams.append("fields[]", FIELD_MEMBERS);
      url.searchParams.append("fields[]", FIELD_LOCATIONS);
      if (offset) url.searchParams.set("offset", offset);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
      });

      const data = await response.json();
      allRecords = [...allRecords, ...(data.records || [])];
      offset = data.offset || null;
    } while (offset);

    for (const record of allRecords) {
      // REST API returns fields under cellValuesByFieldId
      const fields = record.cellValuesByFieldId || record.fields || {};
      const groupName = fields[FIELD_GROUP_NAME];
      if (!groupName || INTERNAL_GROUPS.includes(groupName)) continue;

      const members = fields[FIELD_MEMBERS] || [];
      const match = members.find(m => (m.email || "").toLowerCase() === normalized);

      if (match) {
        const locations = (fields[FIELD_LOCATIONS] || [])
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
