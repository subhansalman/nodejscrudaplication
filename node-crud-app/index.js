import express from "express";

const server = express();
server.use(express.json());

let memberList = [];

server.get("/", (req, res) => {
  res.status(200).json({
    note: "Current members list",
    list: memberList,
  });
});


server.get("/members/:memberId", (req, res) => {
  const { memberId } = req.params;
  const member = memberList.find((m) => m.id === memberId.toString());
  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }
  res.status(200).json({ member });
});

server.post("/members", (req, res) => {
  const { fullName, contactEmail } = req.body;
  if (!fullName || !contactEmail) {
    return res.status(400).json({ error: "Provide name and email" });
  }
  const newMember = {
    id: Date.now().toString(),
    fullName,
    contactEmail,
  };
  memberList.push(newMember);
  res.status(201).json({ success: "Member added", member: newMember });
});


server.patch("/members/:memberId", (req, res) => {
  const { memberId } = req.params;
  const { fullName, contactEmail } = req.body;
  const index = memberList.findIndex((m) => m.id === memberId.toString());
  if (index === -1) {
    return res.status(404).json({ error: "Member not found" });
  }
  memberList[index] = {
    ...memberList[index],
    fullName: fullName || memberList[index].fullName,
    contactEmail: contactEmail || memberList[index].contactEmail,
  };
  res.status(200).json({ success: "Member updated", member: memberList[index] });
});


server.delete("/members/:memberId", (req, res) => {
  const { memberId } = req.params;
  const exists = memberList.some((m) => m.id === memberId.toString());
  if (!exists) {
    return res.status(404).json({ error: "Member not found" });
  }
  memberList = memberList.filter((m) => m.id !== memberId.toString());
  res.status(200).json({ success: "Member removed" });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});