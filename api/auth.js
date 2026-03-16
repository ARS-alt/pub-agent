export const config = { api: { bodyParser: true } };

const INTERNAL_GROUPS = ["PUB Corp", "Development", "C&T", "Singer", "CUAN", "JMC", "Seeded (BH Only)"];
const BASE_ID = "appoU9OEisJcLJMOz";
const TABLE_ID = "tbl5dgo5rXnser3Iu";

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
      if (offset) url.searchParams.set("offset", offset);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
      });

      const data = await response.json();
      console.log("Airtable response status:", response.status);
      console.log("Records fetched:", data.records?.length);
      
      allRecords = [...allRecords, ...(data.records || [])];
      offset = data.offset || null;
    } while (offset);

    console.log("Total records:", allRecords.length);

    for (const record of allRecords) {
      const fields = record.fields;
      const groupName = fields["Group Name"] || fields["Name"] || Object.values(fields)[0];
      
      if (INTERNAL_GROUPS.includes(groupName)) continue;

      const members = fields["Members"] || fields["Collaborators"] || [];
      console.log("Checking group:", groupName, "members:", JSON.stringify(members).slice(0, 200));

      const membersArr = Array.isArray(members) ? members : [];
      const match = membersArr.find(m => {
        const memberEmail = (m.email || m.Email || "").toLowerCase();
        return memberEmail === normalized;
      });

      if (match) {
        const locations = (fields["Locations"] || fields["Location"] || [])
          .filter(l => l.name && !l.name.startsWith("Prototype"));

        return res.status(200).json({
          group: groupName,
          locations: locations.map(l => l.name),
          locationIds: locations.map(l => l.id),
        });
      }
    }

    console.log("No match found for:", normalized);
    return res.status(404).json({ error: "not_found" });

  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
