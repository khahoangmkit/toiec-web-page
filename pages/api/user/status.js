import { getSession } from "next-auth/react";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();


export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const {userId} = req.query;
    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error checking user status:", error);
    return res.status(500).json({ message: "Error checking user status", error: error.message });
  }
}
