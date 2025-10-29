import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 🟢 GET ALL + FILTER
app.get("/person", async (req, res) => {
  const filters = req.query;

  const people = await prisma.person.findMany({
    where: {
      fullName: filters.fullName ? { contains: String(filters.fullName) } : undefined,
      gender: filters.gender ? String(filters.gender) : undefined,
      birthMonth: filters.birthMonth ? Number(filters.birthMonth) : undefined,
      birthYear: filters.birthYear ? Number(filters.birthYear) : undefined,
      countryOfBirth: filters.countryOfBirth ? String(filters.countryOfBirth) : undefined,
      email: filters.email ? String(filters.email) : undefined,
      contactNumber: filters.contactNumber ? String(filters.contactNumber) : undefined,
      cityOfResidence: filters.cityOfResidence ? String(filters.cityOfResidence) : undefined,
      listingStatus: filters.listingStatus ? String(filters.listingStatus) : undefined,
    },
  });

  res.json(people);
});

// 🟢 ADD NEW PERSON
app.post("/person", async (req, res) => {
  try {
    const data = req.body;
    const newPerson = await prisma.person.create({ data });
    res.json(newPerson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add record" });
  }
});

// 🟢 UPDATE PERSON (inline edit)
app.put("/person/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.person.update({
      where: { id: Number(id) },
      data,
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update record" });
  }
});

// 🟢 DUPLICATE DETECTION
app.get("/person/duplicates", async (req, res) => {
  const duplicates = await prisma.$queryRaw<any[]>`
    SELECT fullName, email, contactNumber, COUNT(*) 
    FROM "Person" 
    GROUP BY fullName, email, contactNumber 
    HAVING COUNT(*) > 1;
  `;
  res.json(duplicates);
});

// 🟢 EXPORT TO EXCEL
app.get("/person/export", async (req, res) => {
  const people = await prisma.person.findMany();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("People");

  sheet.columns = Object.keys(people[0] || {}).map((key) => ({
    header: key,
    key,
    width: 20,
  }));

  people.forEach((p) => sheet.addRow(p));

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=people.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
