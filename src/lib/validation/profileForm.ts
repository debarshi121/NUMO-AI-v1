import { z } from "zod";
import { dobField } from "./vehicleForms";

export const profileSetupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters")
    .regex(
      /^[\p{L}][\p{L}\s'.-]*$/u,
      "Name can only contain letters, spaces, hyphens and apostrophes",
    ),
  dob: dobField,
  gender: z.enum(["male", "female", "other"]),
});

export type ProfileSetupFormValues = z.infer<typeof profileSetupSchema>;
