import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  gender: z.enum(["male", "female", "other"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, dob, gender } = schema.parse(body);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        dob: new Date(dob),
        gender,
        profileSetup: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }
    console.error("[profile-setup]", err);
    return NextResponse.json(
      { success: false, error: "Failed to save profile." },
      { status: 500 }
    );
  }
}
