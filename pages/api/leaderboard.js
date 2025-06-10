import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const topResults = await prisma.$queryRaw(
      Prisma.sql`
        SELECT id, "listeningCorrect", "readingCorrect", "testName", "userId"
        FROM "Result"
        WHERE "isFullTest" = true
        ORDER BY ("listeningCorrect" + "readingCorrect") DESC
        LIMIT 20
      `
    );

    const userIds = topResults.map((r) => r.userId);

    if (userIds.length === 0) {
      return res.status(200).json({ data: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const userMap = new Map(users.map((u) => [u.id, u.name]));

    const leaderboard = topResults.map((result) => ({
      ...result,
      userName: userMap.get(result.userId),
      totalScore: (result.listeningCorrect || 0) + (result.readingCorrect || 0),
    }));

    return res.status(200).json({ data: leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ message: "Error fetching leaderboard", data: null });
  }
}
