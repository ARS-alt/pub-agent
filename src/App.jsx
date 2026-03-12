import { useState, useRef, useEffect } from "react";

const ACCESS_GROUPS = {
  "Bagel Boyz":      { locations: ["La Jolla (Pearl St)", "Oceanside (Vista Way)", "San Diego (North Park)"], locationIds: ["recKngsIfHy4IWL2K","recWuwnKaf3S3is2H","reckwqBVTsqelqiuP"] },
  "Claribase":       { locations: ["Winter Park (S Orlando)", "Orlando (Alafaya)", "Union Square", "Hadley (S Maple)", "Washington (Georgetown)"], locationIds: ["rece9H4Wsmm5j7X78","recl2ZLBY1MPy4oxh","recXJnFqlPKEdlwxy","recTjmcb7l82mLXRz","recmQy5jTvle0JWZX"] },
  "Fresh Dining":    { locations: ["Westhampton", "Garden City (Westbury Plaza)", "San Jose (Santana Row)", "Santa Barbara", "Plainview", "Redlands", "Huntington Station (Walt Whitman)", "Bayside (Bay Terrace)", "Thousand Oaks", "Lafayette", "Upland", "Palo Alto (University Ave)"], locationIds: ["recAZwhEpNLZwuHri","recwUU3ELU7rAyD7m","recP7Pl9HQWzXu1TE","recrTJpBE0rNOrziM","recyeBgeJOr8funrF","recVFg70suslyGOh2","rectcfkuSgpNyaDSQ","reckfWAWwFm4hb8tw","reca4zDBqlVpWGbHI","recXEll9WdcHNK1Ry","recEV938XP0uPey5a","recEd7YIsnXbfDeM4"] },
  "JipDip":          { locations: ["Atlanta (Buckhead)", "Atlanta (Krog Street)", "Atlanta (12th & Piedmont)"], locationIds: ["recQE6NClCbNfG9R4","rec5qx8QlXXWjztjW","recfr1nisYD8nqen5"] },
  "Just Pop":        { locations: ["Westfield", "Amherst (Station 12)", "Eatontown", "Stamford (High Ridge Rd)", "Tenafly"], locationIds: ["recQv6uxbIZFFFEzd","recENHn8lqVeTGh5Z","recYYispX0f9ZV300","reczENM5SDjvqiBKI","recCnjDLWLey1bnzt"] },
  "Lonestar":        { locations: ["Dallas (Inwood Village)", "Dallas (Henderson Ave)", "University Park (Town & Country)", "Houston (MKT)", "McKinney (West Grove)"], locationIds: ["rec0IlV3L5UXZ94lt","recvZLnSdYrBGjxv5","recwJA4dGIUN0Oljq","recprtgiZhcKRDaTA","recCIHETniLauuT8j"] },
  "Lucky Bagel":     { locations: ["Henderson (St Rose)", "Las Vegas (Centennial Hills)"], locationIds: ["recbPQkMVBnIXPvIh","recsOTiiLCvL5YZb9"] },
  "MPZ":             { locations: ["Winter Park (S Orlando)", "Orlando (Alafaya)", "Wesley Chapel (Bruce Downs)", "Jacksonville (Town Center)", "Tampa (Westshore)", "Viera", "Carrollwood (Dale Mabry)", "Woodmere (Eaton)", "Ann Arbor", "Sarasota", "Sarasota (University Town Center)", "Columbus (Short North)", "Birmingham (Woodward Ave)"], locationIds: ["rece9H4Wsmm5j7X78","recl2ZLBY1MPy4oxh","recfeuhI9iBWUYbqK","recaxd6iyBiQhNrvc","recJdG4BSAYfaAufM","rec1dCteRIk4GGQz6","recouihJIhAmv56p4","recLfHR9WES5XNuQp","recYMjCxaSOldNxvZ","reczOtrzQX5jSHdPw","recQb4SGjBJE6xJfU","recPxW1ohhRrr7soy","recHczk7anT3uAskW"] },
  "Palmedough":      { locations: ["Charleston", "Greenville (Camperdown)", "Mt Pleasant (Bowman)"], locationIds: ["rec3QXivzqc1hG5M0","recUQgc1VintgpXlr","rec6fVnNsOj2pbsuK"] },
  "PB Alabama":      { locations: ["Birmingham (The Summit)"], locationIds: ["recUCsxP1Zp5niTht"] },
  "PC MAE":          { locations: ["Hadley (S Maple)", "Cranston (Garden City)", "Portland (Middle Street)", "Burlington"], locationIds: ["recTjmcb7l82mLXRz","recYuCrbVriZPS7gn","rec6qxhOhZNU6yXTh","recSt8Vf64xYiuNOo"] },
  "Pop Cotswold":    { locations: ["Nashville (The Gulch)", "Charlotte (Plaza Midwood)", "Charlotte (The Bowl)", "Raleigh (Davis Park East)"], locationIds: ["recE3RXZkR81aYRXb","recKhGBTcoXFwJajC","recFrD93e8SW787cR","recnINv0X76zwLblt"] },
  "Seeded":          { locations: ["Washington (Georgetown)", "Bethesda", "Ardmore (Suburban Square)", "Seaport", "Assembly Row", "Philadelphia (Sansom St)", "Arlington (Ballston)", "Boston (Boylston)", "Philadelphia (Di Bruno's)", "Cambridge (Harvard Square)"], locationIds: ["recmQy5jTvle0JWZX","recMtUyOQnboQG0KG","rec1C2TOZYrZ6F3Dq","recsNYicJ7o0WlfJM","rec2HvvtLZI81LDan","recoDc69juy6HqnI0","recxkKCXNkwdgBvEH","recd1Vaj4uAVXO1UU","recmgHwhJLJ4LXdVe","rec2cW2VQEQhcvt2s"] },
  "Southern Proper": { locations: ["Chicago (Lincoln Park)", "Chicago (Fulton Market)"], locationIds: ["rec53G2pZyN2MKsga","recOYAffy6Z1Rdr3R"] },
  "Sweetzer":        { locations: ["Calabasas (Commons)", "LA (Brentwood)", "Studio City", "Newport Beach (Westcliff)"], locationIds: ["recJrYdCSRHxguGUc","rec6Re8r4M778J5c8","recwIDWotLdFLmexC","recYiJ8qDRo0syg9F"] },
};

const EMAIL_TO_GROUP = {
  "paulgoodman8@gmail.com": "Bagel Boyz", "sshea@sheaconstructionsd.com": "Bagel Boyz", "jen@arch5.design": "Bagel Boyz", "brent@arch5.design": "Bagel Boyz", "madwrapssandiego@gmail.com": "Bagel Boyz", "rachelle@arch5.design": "Bagel Boyz", "kaitlyn@arch5.design": "Bagel Boyz", "chico@chicossales.com": "Bagel Boyz",
  "rob+test@claribase.com": "Claribase", "rob@claribase.com": "Claribase", "me@robweidner.com": "Claribase",
  "laura@tap-dg.com": "Fresh Dining", "mwalden@freshdiningconcepts.com": "Fresh Dining", "cterry@freshdiningconcepts.com": "Fresh Dining", "lrooney@freshdiningconcepts.com": "Fresh Dining", "aallen@freshdiningconcepts.com": "Fresh Dining", "sgold@freshdiningconcepts.com": "Fresh Dining", "lmendoza@freshdiningconcepts.com": "Fresh Dining", "cnonno@louisandpartners.com": "Fresh Dining", "kcuster@louisandpartners.com": "Fresh Dining", "xmoore@caseengineeringinc.com": "Fresh Dining", "nstephens@caseengineeringinc.com": "Fresh Dining", "jvirtudazo@caseengineeringinc.com": "Fresh Dining", "rvicic@caseengineeringinc.com": "Fresh Dining", "alejandra@tap-dg.com": "Fresh Dining", "matt@fuzionad.com": "Fresh Dining", "sarah@fuzionad.com": "Fresh Dining", "jhubert@freshdiningconcepts.com": "Fresh Dining", "unickdesignsllc@gmail.com": "Fresh Dining", "chelseap@oculusinc.com": "Fresh Dining", "benjamink@oculusinc.com": "Fresh Dining",
  "rajubp@gmail.com": "JipDip", "econdon@bretonavenir.com": "JipDip", "janvip045@gmail.com": "JipDip", "ben@insomniadesign.co": "JipDip",
  "ashah0228@gmail.com": "Just Pop", "nickkenner@justsalad.com": "Just Pop", "ahmedsuhel1@gmail.com": "Just Pop", "saurabh49@gmail.com": "Just Pop", "tory@popupbagels.com": "Just Pop", "ashah@adrenterprise.com": "Just Pop", "rchang@htassociates.net": "Just Pop", "jyang@htassociates.net": "Just Pop", "jliu@htassociates.net": "Just Pop", "pbuckley1965@icloud.com": "Just Pop",
  "kyle@gpnarchitecture.com": "Lonestar", "lief@joneschouproperties.com": "Lonestar", "brent@jmcbuilds.us": "Lonestar", "ashersendyk@gmail.com": "Lonestar", "don@meijorleague.com.au": "Lonestar", "leo@gpnarchitecture.com": "Lonestar", "cole@jmcbuilds.us": "Lonestar", "deanna@jmcbuilds.us": "Lonestar", "christian@jmcbuilds.us": "Lonestar", "simon@lsbagels.com": "Lonestar", "melissa.burness@bigpond.com": "Lonestar", "dave@lsbagels.com": "Lonestar", "mariyah@lsbagels.com": "Lonestar",
  "raffi@daveshotchicken.com": "Lucky Bagel", "garyrubenyan@daveshotchicken.com": "Lucky Bagel", "moni@rsi-group.com": "Lucky Bagel", "rmoore@rsi-group.com": "Lucky Bagel", "kkhukoyan@socalpermithub.com": "Lucky Bagel", "shawn.shahryari@gmail.com": "Lucky Bagel",
  "kal@mpzholdings.com": "MPZ", "erik@zeltadesign.com": "MPZ", "katelyn@zeltadesign.com": "MPZ", "scott@mpzholdings.com": "MPZ", "marissa@mpzholdings.com": "MPZ", "michael@mpzholdings.com": "MPZ", "leslie@mpzholdings.com": "MPZ", "anthony@mpzholdings.com": "MPZ",
  "braxtondecamp@gmail.com": "Palmedough", "mnixondesign@gmail.com": "Palmedough",
  "kpat4u@gmail.com": "PB Alabama", "rajesh.patel@example.com": "PB Alabama", "arnoldsoni@yahoo.com": "PB Alabama", "zzaveri108@gmail.com": "PB Alabama", "alexwayneb@icloud.com": "PB Alabama",
  "jamie@renchrockadvisors.com": "PC MAE", "bhenry2121@gmail.com": "PC MAE", "jnall@silverpetrucelli.com": "PC MAE",
  "deepenrp@gmail.com": "Pop Cotswold", "michaele.perez@icloud.com": "Pop Cotswold", "tgallinek@aol.com": "Pop Cotswold", "rachelkbowles85@gmail.com": "Pop Cotswold",
  "brian@seededcap.com": "Seeded", "rtrego@rhjassoc.com": "Seeded", "hannah@makmor.com": "Seeded", "nwilliamson@rhjassoc.com": "Seeded", "breider@martaranoengineering.com": "Seeded", "amartarano@martaranoengineering.com": "Seeded", "kevin.kelly522@gmail.com": "Seeded", "jeff@seededcap.com": "Seeded",
  "ch@sphospitality.com": "Southern Proper", "jkorte@cbdarchitects.com": "Southern Proper", "jjohnson@cbdarchitects.com": "Southern Proper", "fhernandez@cbdarchitects.com": "Southern Proper", "plynn@connachtgroup.com": "Southern Proper", "vincebozman@gmail.com": "Southern Proper",
  "ameen@sweetzercapital.com": "Sweetzer", "aaron@sweetzercapital.com": "Sweetzer", "shawn@sweetzercapital.com": "Sweetzer", "james@sweetzercapital.com": "Sweetzer", "j.hernandez@arch-consultingservices.com": "Sweetzer",
};

const STATIC_CONTEXT = {
  pubDirectory: [
    { name: "Freddy Luster",   role: "VP of Real Estate & Development", phone: "(404) 379-1970", email: "freddy.l@popupbagels.com" },
    { name: "Doug Troy",       role: "President of Operations",          phone: "(603) 491-1329", email: "doug@popupbagels.com" },
    { name: "Brian Coakley",   role: "VP of Restaurant Operations",      phone: "(978) 761-4714", email: "brianc@popupbagels.com" },
    { name: "Matt Pisano",     role: "VP of Finance & Accounting",       phone: "(516) 776-4979", email: "mattp@popupbagels.com" },
    { name: "Christian Kuhn",  role: "Chief Commercial Officer",         phone: "(703) 300-5280", email: "christian.k@popupbagels.com" },
    { name: "Taylor Bennett",  role: "Chief Growth Officer",             phone: "(636) 541-1561", email: "taylorb@popupbagels.com" },
    { name: "Scott Black",     role: "VP of Training",                   email: "scott.b@popupbagels.com" },
    { name: "Chris Breen",     role: "Director of Technology",           phone: "(929) 591-5812", email: "chris@popupbagels.com" },
    { name: "Renee Silvey",    role: "Director of HR",                   email: "renee.s@popupbagels.com" },
  ],
  mandatoryVendors: [
    { firm: "C&T",                 role: "Equipment",     contact: "Randy Hughes",        phone: "(513) 295-1620", email: "rhughes@c-tdesign.com" },
    { firm: "Singer",              role: "Equipment",     contact: "Cody Hearing",        phone: "(205) 799-2099", email: "chearing@singerequipment.com" },
    { firm: "Captive Aire",        role: "Hood",          contact: "Joe Hertenstein",     phone: "(513) 678-0393", email: "joe.hertenstein@captiveaire.com" },
    { firm: "MakMor",              role: "Decor",         contact: "Hannah Lissette",     phone: "(646) 283-8555", email: "hannah@popupbagels.com" },
    { firm: "Duggal",              role: "Decor",         contact: "Monica Drew",         phone: "(646) 638-7010", email: "monica@duggal.com" },
    { firm: "BriteLite",           role: "Decor",         contact: "Beth Hill",           phone: "(561) 406-6283", email: "beth@briteliteneon.com" },
    { firm: "Zimmerman Solutions", role: "Decor",         contact: "Otto Zimmerman",      phone: "(860) 759-6242", email: "omaxzimmerman@hotmail.com" },
    { firm: "Illuminate",          role: "Lighting",      contact: "Billy Marchetti",     phone: "(718) 873-7979", email: "billy@myilluminate.com" },
    { firm: "Carbon X",            role: "Facilities",    contact: "Isaac Matsafi",       phone: "(917) 428-6322", email: "isaac@thecarbonx.com" },
    { firm: "Cintas",              role: "Facilities",    contact: "Michelle Horbatuck",  phone: "(215) 385-1113", email: "HorbatuckM@cintas.com" },
    { firm: "ResQ",                role: "Facilities",    contact: "Koby Stronach",       phone: "(269) 224-1846", email: "kstronach@getresq.com" },
    { firm: "Toast",               role: "POS",           contact: "Konrad Harla",        email: "konrad.harla@toasttab.com" },
    { firm: "Viking Cloud",        role: "Cybersecurity", contact: "Matthew DellaCroce",  email: "matthewdellacroce@vikingcloud.com" },
  ],
  recentSpecUpdates: [
    { date: "2026-03-01", notes: "Boil Station & Bake Station elevations now available showing Pot Filler and Receptacle locations. Various cookline elevations available for guidance. Finish Schedule now in Excel format on the Prototypical Interface." },
    { date: "2026-02-01", notes: "Finishes: Mirror mounting height updated to 41.5\" AFF to bottom (was 36\"). Sourcing: PUB secured national chain pricing through Marlite distributors for FRP. Millwork: Revised counter drawings (7', 9', 10', 12') with electrical device layout now in Airtable Millwork section. Structural: Front Counter Bulkhead set at 8'-4\", BOH Ceiling set at 8'-7\"." },
    { date: "2026-01-01", notes: "Grout for subway tile now Mapei 5019 Pearl Gray Ultracolor Plus FA (was 101 Rain). PUB no longer spec-ing Berner air curtains — consult local permitting. 3-tier hot bagel shelf available for low ceiling heights. Fine Printing now has complete decal package — order through them, not locally." },
    { date: "2025-12-01", notes: "ACT-1 in BOH: should start at 8'7\" (was 10'). Enclosures for 1 and 2 door beverage fridges now in millwork sections." },
  ],
};

const buildSystemPrompt = (groupName) => {
  const group = ACCESS_GROUPS[groupName];
  const locationList = group.locations.join(", ");
  const locationIds = group.locationIds.join('", "');
  return `You are the PUB Franchisee Assistant for Pop Up Bagels. The franchisee you are speaking with belongs to the "${groupName}" group.

## THEIR LOCATIONS
This franchisee can only see data for these locations: ${locationList}
Their location record IDs are: ["${locationIds}"]

## ⚠️ MANDATORY DATA FILTERS — APPLY ON EVERY SINGLE QUERY, NO EXCEPTIONS

**General spec tables** — filter to Current only:
| Table | tableId | Filter field | Required value |
|---|---|---|---|
| CookingEquipment | tbltKwQMu9dzXHJm7 | fldNVyuw7TVWv0kMe | seloOpeeMcCqFzfK4 (Current) |
| Smallwares | tblQAHjHy4ECyeMzr | fldlZ54BmQF8u07sX | selJX35ZjdkY1skHk (Current) |
| Decor | tblVOsvujAl9s1bGR | fldgKKIVSB43Ilta8 | selm4owcc8aF0BwWK (Current) |
| Finishes | tblx4vQ5uHP7WjvGr | fldDrirZIgPFsvyls | selPkieMV0eulJM2d (Current) |
| Millwork | tblncrrDJjTCxd66m | fldXBhsDsJkFgHZUQ | selLMlJNjCj8FfSZ0 (Current) |
| Boil/Bake Arrangements | tblT4075YBpDffwHU | fldttQ85H1QGYJpvo | selLMlJNjCj8FfSZ0 (Current) |

**Location-specific table** — BOTH filters required together:
For ProvisionedEquipment queries, use: {"operator":"and","operands":[{"operator":"=","operands":["fldMwcABiCeuMbX63",true]},{"operator":"isAnyOf","operands":["fld6YpMFWYLy5iJsN",["${locationIds}"]]}]}

NEVER return records outside these filters. If something isn't in the results, say it's not in the current specs.

## STATIC DATA

### PUB Internal Directory
${STATIC_CONTEXT.pubDirectory.map(p => `- ${p.name} | ${p.role} | ${p.phone || "no phone"} | ${p.email}`).join("\n")}

### Mandatory Vendors
${STATIC_CONTEXT.mandatoryVendors.map(v => `- ${v.firm} (${v.role}) — ${v.contact}${v.phone ? " | " + v.phone : ""} | ${v.email}`).join("\n")}

### Recent Spec Updates (newest first)
${STATIC_CONTEXT.recentSpecUpdates.map(u => `[${u.date}] ${u.notes}`).join("\n\n")}

## LIVE AIRTABLE TABLES
- CookingEquipment: tbltKwQMu9dzXHJm7
- Smallwares: tblQAHjHy4ECyeMzr
- Decor: tblVOsvujAl9s1bGR
- Finishes: tblx4vQ5uHP7WjvGr
- Prototypical Package: tblQK7GT9b54wMc49
- Millwork + Beverage Fridge Enclosure: tblncrrDJjTCxd66m
- Boil/Bake Arrangements: tblT4075YBpDffwHU
- External Vendor Directory: tblOHeaNj3bwCdd5v
- Spec Update Announcements: tblFLaKYxAhGHL4L6
- ProvisionedEquipment: tblWOEMFuGeyZh2aD

## BEHAVIOR
- Be direct and practical — include model numbers, dimensions, contacts, links
- Include Note 1–5 fields on equipment when relevant
- If something can't be found, say so and direct to the right PUB contact
- Keep answers concise — franchisees are busy operators`;
};

const SUGGESTIONS = [
  "What are the latest spec updates?",
  "What cooking equipment is required?",
  "Which vendors are mandatory?",
  "What finishes are specified — tile, grout, flooring?",
  "What smallwares are required vs optional?",
  "What are the millwork specs for the front counter?",
];

function inlineFormat(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} style={{ color: "#e8e4dc", fontWeight: 600 }}>{p.slice(2, -2)}</strong>
      : p
  );
}

function renderMarkdown(text) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize: 12, fontWeight: 700, color: "#c9a96e", margin: "14px 0 4px", letterSpacing: "0.04em", textTransform: "uppercase" }}>{line.slice(4)}</h3>;
    if (line.startsWith("## "))  return <h2 key={i} style={{ fontSize: 14, fontWeight: 700, color: "#c9a96e", margin: "16px 0 6px" }}>{line.slice(3)}</h2>;
    if (line.startsWith("- "))   return <li key={i} style={{ margin: "3px 0", paddingLeft: 4, color: "#c8c0b4", listStyle: "disc", marginLeft: 16 }}>{inlineFormat(line.slice(2))}</li>;
    if (line.trim() === "")      return <div key={i} style={{ height: 6 }} />;
    return <p key={i} style={{ margin: "2px 0", lineHeight: 1.65 }}>{inlineFormat(line)}</p>;
  });
}

export default function FranchiseeAgent() {
  const [authStep, setAuthStep] = useState("email");
  const [emailInput, setEmailInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleEmailSubmit = () => {
    const normalized = emailInput.trim().toLowerCase();
    const group = EMAIL_TO_GROUP[normalized];
    if (group) { setVerifiedEmail(normalized); setSelectedGroup(group); setAuthStep("verified"); }
    else setAuthStep("not_found");
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading || authStep !== "verified") return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    setLoadingStep("Looking up your question...");
    try {
      // ✅ Calls your Vercel serverless proxy — API key stays server-side
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(selectedGroup),
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          mcp_servers: [{ type: "url", url: "https://mcp.airtable.com/mcp", name: "airtable" }],
        }),
      });
      const data = await res.json();
      const toolCalls = (data.content || []).filter(b => b.type === "mcp_tool_use");
      if (toolCalls.length > 0) setLoadingStep(`Searched ${toolCalls.length} table${toolCalls.length > 1 ? "s" : ""}...`);
      const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      setMessages([...newMessages, { role: "assistant", content: reply || "I couldn't find a clear answer. Try rephrasing, or contact your PUB rep." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error — please try again." }]);
    } finally {
      setLoading(false);
      setLoadingStep("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const notFound = authStep === "not_found";

  if (authStep === "email" || authStep === "not_found") {
    return (
      <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: "#0f0f0d", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#e8e4dc", padding: "32px 20px" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 40%, rgba(180,130,60,0.08) 0%, transparent 60%)" }} />
        <div style={{ fontSize: 44, marginBottom: 16, filter: "drop-shadow(0 0 24px rgba(180,130,60,0.4))" }}>🥯</div>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 6px", letterSpacing: "-0.01em" }}>PUB Franchisee Assistant</h1>
        <p style={{ color: "#6a6050", fontSize: 13, margin: "0 0 28px", textAlign: "center", maxWidth: 300, lineHeight: 1.6 }}>Enter the email address you use for your PUB Airtable access</p>
        <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="email" value={emailInput}
            onChange={e => { setEmailInput(e.target.value); if (notFound) setAuthStep("email"); }}
            onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
            placeholder="you@yourcompany.com" autoFocus
            style={{ width: "100%", background: "rgba(255,255,255,0.055)", border: notFound ? "1px solid rgba(220,80,60,0.5)" : "1px solid rgba(255,255,255,0.09)", borderRadius: 11, padding: "12px 14px", color: "#e8e4dc", fontSize: 14, fontFamily: "inherit", outline: "none" }}
          />
          {notFound && <p style={{ fontSize: 12, color: "#c0604a", margin: 0, lineHeight: 1.5 }}>That email isn't in our system. Contact <a href="mailto:freddy.l@popupbagels.com" style={{ color: "#c9a96e" }}>Freddy Luster</a> if you need access.</p>}
          <button onClick={handleEmailSubmit} disabled={!emailInput.trim()} style={{ width: "100%", padding: "12px", borderRadius: 11, background: emailInput.trim() ? "linear-gradient(135deg, #b4823c, #7a5218)" : "rgba(180,130,60,0.15)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: emailInput.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>Continue</button>
        </div>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input::placeholder { color: #3e3830; }`}</style>
      </div>
    );
  }

  const isEmpty = messages.length === 0;
  const groupInfo = ACCESS_GROUPS[selectedGroup];

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: "#0f0f0d", minHeight: "100vh", display: "flex", flexDirection: "column", color: "#e8e4dc" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 15% 40%, rgba(180,130,60,0.06) 0%, transparent 55%)" }} />
      <header style={{ padding: "16px 24px", borderBottom: "1px solid rgba(180,130,60,0.15)", display: "flex", alignItems: "center", gap: 12, background: "rgba(15,15,13,0.96)", position: "sticky", top: 0, zIndex: 10, flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(140deg, #c49a40, #7a5a1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🥯</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>PUB Franchisee Assistant</div>
          <div style={{ fontSize: 11, color: "#6a6050", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedGroup} · {groupInfo.locations.length} location{groupInfo.locations.length !== 1 ? "s" : ""}</div>
        </div>
        <button onClick={() => { setAuthStep("email"); setEmailInput(""); setSelectedGroup(null); setVerifiedEmail(""); setMessages([]); }}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "5px 10px", color: "#5a5248", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Sign out</button>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5bc87a", boxShadow: "0 0 5px #5bc87a" }} />
          <span style={{ fontSize: 11, color: "#5bc87a", fontWeight: 500 }}>Live</span>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column" }}>
        {isEmpty ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🥯</div>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px" }}>Hey, {selectedGroup} 👋</h2>
            <p style={{ color: "#4a4038", fontSize: 11, maxWidth: 300, lineHeight: 1.5, margin: "0 0 4px" }}>Signed in as {verifiedEmail}</p>
            <p style={{ color: "#6a6050", fontSize: 13, maxWidth: 300, lineHeight: 1.6, margin: "0 0 8px" }}>Your locations: <span style={{ color: "#9a8060" }}>{groupInfo.locations.join(", ")}</span></p>
            <p style={{ color: "#4a4038", fontSize: 12, maxWidth: 300, lineHeight: 1.5, margin: "0 0 24px" }}>Ask me anything about equipment specs, vendors, finishes, smallwares, millwork, or recent spec updates.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%", maxWidth: 380 }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} style={{ background: "rgba(180,130,60,0.07)", border: "1px solid rgba(180,130,60,0.18)", borderRadius: 9, padding: "9px 14px", color: "#c9a96e", fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 640, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ fontSize: 10, color: "#3e3830", marginBottom: 4, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>{msg.role === "user" ? verifiedEmail : "PUB Assistant"}</div>
                <div style={{ maxWidth: "88%", padding: msg.role === "user" ? "10px 14px" : "12px 16px", borderRadius: msg.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px", background: msg.role === "user" ? "linear-gradient(135deg, #b4823c, #7a5218)" : "rgba(255,255,255,0.045)", border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.07)", fontSize: 13.5, color: msg.role === "user" ? "#fff" : "#cec6ba", lineHeight: 1.6 }}>
                  {msg.role === "user" ? msg.content : <div>{renderMarkdown(msg.content)}</div>}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ padding: "10px 16px", borderRadius: "14px 14px 14px 3px", background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0,1,2].map(j => <div key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: "#b4823c", animation: "dot-pulse 1.2s ease-in-out infinite", animationDelay: `${j * 0.18}s` }} />)}
                  </div>
                  {loadingStep && <span style={{ fontSize: 11, color: "#6a6050" }}>{loadingStep}</span>}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div style={{ padding: "14px 20px 18px", borderTop: "1px solid rgba(255,255,255,0.055)", background: "rgba(15,15,13,0.97)", flexShrink: 0 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", gap: 9, alignItems: "flex-end" }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask about equipment, vendors, finishes, millwork, spec updates..."
            disabled={loading} rows={1}
            style={{ flex: 1, background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 11, padding: "11px 14px", color: "#e8e4dc", fontSize: 13.5, fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.5, minHeight: 44, maxHeight: 110 }}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: 11, background: loading || !input.trim() ? "rgba(180,130,60,0.15)" : "linear-gradient(135deg, #b4823c, #7a5218)", border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: "#fff", flexShrink: 0 }}>↑</button>
        </div>
        <div style={{ maxWidth: 640, margin: "7px auto 0", fontSize: 10.5, color: "#302a24", textAlign: "center" }}>Reads live from PUB Procurement Airtable · For urgent issues contact your PUB rep</div>
      </div>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: rgba(180,130,60,0.18); border-radius: 2px; } @keyframes dot-pulse { 0%,100% { opacity:0.25; transform:scale(0.75); } 50% { opacity:1; transform:scale(1); } } textarea::placeholder { color: #3e3830; }`}</style>
    </div>
  );
}
