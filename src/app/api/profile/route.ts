import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

const updateProfileSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    dob: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
        .refine((value) => {
            const date = new Date(`${value}T00:00:00.000Z`);
            return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
        }, "Invalid date"),
    gender: z.enum(["male", "female", "other"]),
});

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, dob: true, gender: true, mobile: true },
    });

    return NextResponse.json({ success: true, dob: user?.dob ?? null, user });
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const parsed = updateProfileSchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.issues[0].message },
                { status: 400 },
            );
        }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: parsed.data.name,
                dob: new Date(`${parsed.data.dob}T00:00:00.000Z`),
                gender: parsed.data.gender,
            },
            select: { name: true, dob: true, gender: true, mobile: true },
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("[profile PATCH]", error);
        return NextResponse.json(
            { success: false, error: "Failed to update profile." },
            { status: 500 },
        );
    }
}
