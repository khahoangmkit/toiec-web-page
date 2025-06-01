import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const {
    query: { testId },
    method,
    body,
  } = req;

  switch (method) {
    case "GET": {
      // Lấy tất cả comment + reply cho testId
      try {
        const comments = await prisma.comment.findMany({
          where: { testId, parentId: null },
          orderBy: { createdAt: "desc" },
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
              orderBy: { createdAt: "asc" },
            },
          },
        });
        return res.status(200).json(comments);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    case "POST": {
      // Thêm comment hoặc reply (cần đăng nhập)
      const session = await getServerSession(req, res, authOptions);

      if (!session || !session.user) {
        return res.status(401).json({ error: "Bạn cần đăng nhập để bình luận." });
      }
      const { content, parentId } = body;
      if (!content || !content.trim()) {
        return res.status(400).json({ error: "Nội dung bình luận không được để trống." });
      }
      try {
        const newComment = await prisma.comment.create({
          data: {
            content,
            testId,
            userId: session.user.id,
            parentId: parentId || null,
          },
          include: { user: true, replies: true },
        });
        return res.status(201).json(newComment);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
