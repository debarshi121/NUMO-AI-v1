import { Prisma } from "@prisma/client";
import { generateReportId } from "./generateReportId";

const MAX_ATTEMPTS = 5;

// generateReportId() is a random suffix, not a guaranteed-unique sequence
// (unlike cuid()), so creation is wrapped with a retry loop that regenerates
// the id on the rare unique-constraint collision.
export async function createReportWithUniqueId<T>(
  create: (id: string) => Promise<T>,
): Promise<T> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await create(generateReportId());
    } catch (err) {
      const isUniqueViolation =
        err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
      if (!isUniqueViolation || attempt === MAX_ATTEMPTS) throw err;
    }
  }
  throw new Error("unreachable");
}
