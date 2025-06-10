import { getSession } from "next-auth/react";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

// Activation code - in a real application, this should be stored securely
// and possibly be user-specific or time-limited
const ACTIVATION_CODE = ["SpU8oZ84C990", "LjTm58aYmeG9", "rQaMU14neN", "e6GjnOZQmB"];

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const { code, userId } = req.body;

    // Validate activation code
    if (!code || !ACTIVATION_CODE.includes(code)) {
      return res.status(400).json({ message: "Invalid activation code" });
    }

    // Update user to activate
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive: true,
      },
    });

    return res.status(200).json({
      message: "User activated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    console.error("Error activating user:", error);
    return res.status(500).json({ message: "Error activating user", error: error.message });
  }
}
