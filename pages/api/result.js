import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id, userId } = req.query;
    if (id) {
      try {
        // Lấy kết quả theo id (id là text/string)
        const result = await prisma.result.findUnique({
          where: { id },
        });
        return res.status(200).json({ data: result });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching result", data: null });
      }
    } else if (userId) {
      try {
        // Lấy tất cả kết quả của user, sort theo submittedAt desc
        const results = await prisma.result.findMany({
          where: { userId },
          orderBy: { submittedAt: 'desc' }
        });
        return res.status(200).json({ data: results });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching results", data: null });
      }
    } else {
      return res.status(400).json({ message: "Missing id or userId param", data: null });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { testId, userId, answers, score, flow, parts } = req.body;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await prisma.result.create({
      data: {
        userId,
        testId,
        answers,
        score,
        flow,
        parts,
      },
    });
    return res.status(200).json({ message: "Result saved", result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error saving result" });
  }
}
