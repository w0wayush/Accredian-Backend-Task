import express from "express";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import mailSender from "../utils/mailSender";
const prisma = new PrismaClient();
const router = express.Router();

const referralSchema = z.object({
  referrerName: z.string(),
  referrerEmail: z.string().email({ message: "Invalid email address" }),
  referrerPhone: z.string().optional(),
  message: z.string().optional(),
  referees: z
    .array(
      z.object({
        refereeName: z.string(),
        refereeEmail: z.string().email({ message: "Invalid email address" }),
        refereePhone: z.string().optional(),
      })
    )
    .nonempty({ message: "At least one referee is required" }),
});

router.post("/referral", async (req, res) => {
  const parsedBody = referralSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({ errors: parsedBody.error.errors });
  }
  // console.log("Parsed Body - ", parsedBody);

  const { referrerName, referrerEmail, referrerPhone, message, referees } =
    parsedBody.data;

  try {
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        referrerPhone,
        message,
        referees: {
          create: referees,
        },
      },
    });

    // console.log("Inserted in DB");

    referees.forEach(async (referee) => {
      const mailOptions = {
        email: referee.refereeEmail,
        title: "You have been referred to a course",
        body: `Hi ${referee.refereeName},\n\n${referrerName} has referred you to a course. Check it out!`,
      };

      // console.log("Mail Sent");
      await mailSender(mailOptions);
    });

    res.status(201).json(referral);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to submit referral", message: error });
  }
});

export default router;
