import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
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
