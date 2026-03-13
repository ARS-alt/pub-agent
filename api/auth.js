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
    // Fetch all access groups from Airtable
    let allRecords = [];
    let cursor = null;

    do {
      const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`);
      url.searchParams.set("fields[]", FIELD_GROUP_NAME);
      url.searchParams.set("fields[]", FIELD_MEMBERS);
      url.searchParams.set("fields[]", FIELD_LOCATIONS);
      if (cursor) url.searchParams.set("offset", cursor);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
      });

      const data = await response.json();
      allRecords = [...allRecords, ...(data.records || [])];
      cursor = data.offset || null;
    } while (cursor);

    // Find the group this email belongs to
    for (const record of allRecords) {
      const groupName = record.fields[FIELD_GROUP_NAME];
      if (INTERNAL_GROUPS.includes(groupName)) continue;

      const members = record.fields[FIELD_MEMBERS] || [];
      const match = members.find(m => m.email?.toLowerCase() === normalized);

      if (match) {
        const locations = (record.fields[FIELD_LOCATIONS] || [])
          .filter(l => !l.name?.startsWith("Prototype")); // exclude prototypes

        return res.status(200).json({
          group: groupName,
          locations: locations.map(l => l.name),
          locationIds: locations.map(l => l.id),
        });
      }
    }

    // No match found
    return res.status(404).json({ error: "not_found" });

  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
