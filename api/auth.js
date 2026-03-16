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
      const url = new URL(AIRTABLE_API);
      if (offset) url.searchParams.set("offset", offset);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
      });

      const data = await response.json();

      if (!data.records) {
        return res.status(500).json({ error: "Airtable error", detail: JSON.stringify(data) });
      }

      allRecords = [...allRecords, ...(data.records || [])];
      offset = data.offset || null;
    } while (offset);

    for (const record of allRecords) {
      const fields = record.fields || {};

      // Try all possible field name variants
      const groupName = fields["Name"] || fields["Group Name"] || fields["name"];
      if (!groupName) continue;

      // Try all possible member field variants
      const members = fields["User"] || fields["Members"] || fields["Collaborators"] || fields["user"] || [];
      const membersArr = Array.isArray(members) ? members : [members];

      const match = membersArr.find(m => {
        if (!m) return false;
        const e = (m.email || m.Email || m.emailAddress || "").toLowerCase();
        return e === normalized;
      });

      if (match) {
        const locs = fields["Locations"] || fields["Location"] || [];
        const locsArr = Array.isArray(locs) ? locs : [locs];
        const locations = locsArr.filter(l => l && l.name && !l.name.startsWith("Prototype"));

        return res.status(200).json({
          group: groupName,
          locations: locations.map(l => l.name),
          locationIds: locations.map(l => l.id),
        });
      }
    }

    // Debug: return what fields we actually found on first record
    if (allRecords.length > 0) {
      const sampleFields = Object.keys(allRecords[0].fields || {});
      return res.status(404).json({ error: "not_found", debug_fields: sampleFields, debug_count: allRecords.length });
    }

    return res.status(404).json({ error: "not_found", debug_count: 0 });

  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
