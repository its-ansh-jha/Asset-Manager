import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { imageUploadsTable, siteContentTable, type SiteContentData } from "@workspace/db/schema";
import healthRouter from "./health.js";

const router: IRouter = Router();

router.use(healthRouter);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

router.post("/uploads", async (req, res) => {
  try {
    const { data, fileName = "gallery-image", mimeType } = req.body as {
      data?: string;
      fileName?: string;
      mimeType?: string;
    };
    if (!data || !mimeType || !allowedImageTypes.has(mimeType)) {
      res.status(400).json({ message: "Upload a PNG, JPEG, WebP, or GIF image." });
      return;
    }
    const image = Buffer.from(data, "base64");
    if (!image.length || image.length > MAX_IMAGE_SIZE) {
      res.status(400).json({ message: "Images must be 5 MB or smaller." });
      return;
    }
    const id = crypto.randomUUID();
    await db.insert(imageUploadsTable).values({ id, fileName, mimeType, data: image });
    res.status(201).json({ url: `/api/uploads/${id}` });
    return;
  } catch (error) {
    res.status(500).json({ message: "Unable to upload image", error });
    return;
  }
});

router.get("/uploads/:id", async (req, res) => {
  try {
    const [image] = await db.select().from(imageUploadsTable).where(eq(imageUploadsTable.id, req.params.id)).limit(1);
    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }
    res.setHeader("Content-Type", image.mimeType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(image.data);
    return;
  } catch (error) {
    res.status(500).json({ message: "Unable to load image", error });
    return;
  }
});

const defaultContent: SiteContentData = {
  schoolName: "Maa Gayatri Public School",
  shortName: "M.G.P.S.",
  tagline: "A considered beginning for every child",
  heroTitle: "Building bright futures through education.",
  heroCopy: "An English-medium co-educational school in Muzaffarpur committed to academic growth, character development and lifelong learning.",
  aboutCopy: "Maa Gayatri Public School is an English-medium co-educational school located on Purani Darbhanga Road in Sahwajpur, Muzaffarpur. We create a supportive learning environment where students develop academically while growing in confidence, discipline and character.",
  phone: "+91 75199 90367",
  email: "MGPSMUZ93@gmail.com",
  address: "Purani Darbhanga Road, Sahwajpur/Shahbazpur, Muzaffarpur, Bihar – 842004, India",
  officeHours: "Monday – Saturday · 8:00 AM – 3:00 PM",
  notices: [
    { id: "n1", title: "Admissions open for the 2026–27 session", date: "18 Aug 2026", category: "Admissions", excerpt: "Enquire with the school office about available classes, requirements and important dates.", featured: true },
    { id: "n2", title: "Independence Day celebration", date: "12 Aug 2026", category: "Events", excerpt: "Students and families are invited to join the school community celebration." },
    { id: "n3", title: "Parent–teacher meeting schedule", date: "05 Aug 2026", category: "Circular", excerpt: "Please contact the class teacher for the latest meeting time and details." },
  ],
  gallery: [
    { id: "g1", title: "Campus life", caption: "Add an approved campus photograph" },
    { id: "g2", title: "Classroom learning", caption: "Add an approved classroom photograph" },
    { id: "g3", title: "School activities", caption: "Add an approved activity photograph" },
    { id: "g4", title: "Learning environment", caption: "Add an approved school photograph" },
    { id: "g5", title: "Celebrations", caption: "Add an approved event photograph" },
  ],
  faculty: [
    { id: "f1", name: "School Leadership", role: "Academic guidance & administration", subject: "School leadership", initials: "SL" },
    { id: "f2", name: "Primary Faculty", role: "Foundational learning", subject: "Primary years", initials: "PF" },
    { id: "f3", name: "Secondary Faculty", role: "Subject learning & mentoring", subject: "Secondary years", initials: "SF" },
    { id: "f4", name: "Student Support Team", role: "Care, coordination & activities", subject: "Student wellbeing", initials: "SS" },
  ],
  achievements: [
    { id: "a1", title: "A growing learning community", detail: "Building a steady, supportive school experience for families in Muzaffarpur.", year: "2026" },
    { id: "a2", title: "Learning beyond the classroom", detail: "Encouraging participation, creativity, teamwork and confidence through school life.", year: "2025" },
    { id: "a3", title: "Rooted in the local community", detail: "Serving students and families around Sahwajpur with care and purpose.", year: "2013" },
  ],
  facilities: [
    { id: "fac1", title: "Purposeful classrooms", description: "Spaces designed for focused lessons, questions and collaborative learning.", icon: "book" },
    { id: "fac2", title: "Activity spaces", description: "Room for students to participate, practise skills and discover interests.", icon: "sparkles" },
    { id: "fac3", title: "Safe school environment", description: "A caring, disciplined atmosphere where every learner can feel supported.", icon: "shield" },
    { id: "fac4", title: "Accessible location", description: "Conveniently located on Purani Darbhanga Road in Muzaffarpur.", icon: "map" },
  ],
  admissions: [],
};

async function readContent() {
  const rows = await db.select().from(siteContentTable).where(eq(siteContentTable.id, 1)).limit(1);
  if (rows[0]) return rows[0].data;
  await db.insert(siteContentTable).values({ id: 1, data: defaultContent });
  return defaultContent;
}

router.get("/site-content", async (_req, res) => {
  try { res.json(await readContent()); }
  catch (error) { res.status(500).json({ message: "Unable to load site content", error }); }
});

router.put("/site-content", async (req, res) => {
  try {
    const current = await readContent();
    const next = { ...current, ...req.body } as SiteContentData;
    const [saved] = await db.update(siteContentTable).set({ data: next, updatedAt: new Date() }).where(eq(siteContentTable.id, 1)).returning();
    res.json(saved.data);
  } catch (error) { res.status(400).json({ message: "Unable to save site content", error }); }
});

router.post("/admissions", async (req, res) => {
  try {
    const current = await readContent();
    const admission = { ...req.body, id: `enq-${Date.now()}`, submittedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), status: "New" };
    const [saved] = await db.update(siteContentTable).set({ data: { ...current, admissions: [admission, ...current.admissions] }, updatedAt: new Date() }).where(eq(siteContentTable.id, 1)).returning();
    res.status(201).json({ admission, content: saved.data });
  } catch (error) { res.status(400).json({ message: "Unable to save admission enquiry", error }); }
});

router.patch("/admissions/:id", async (req, res) => {
  try {
    const current = await readContent();
    const admissions = current.admissions.map((item: unknown) => item && typeof item === "object" && "id" in item && item.id === req.params.id ? { ...item, status: req.body.status } : item);
    const [saved] = await db.update(siteContentTable).set({ data: { ...current, admissions }, updatedAt: new Date() }).where(eq(siteContentTable.id, 1)).returning();
    res.json(saved.data);
  } catch (error) { res.status(400).json({ message: "Unable to update admission enquiry", error }); }
});

export default router;
