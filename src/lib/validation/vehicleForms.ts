import { z } from "zod";

const dateField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .regex(/^\d{4}-\d{2}-\d{2}$/, `Enter a valid ${label.toLowerCase()}`)
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: `Enter a valid ${label.toLowerCase()}`,
    });

export const dobField = dateField("Date of birth").refine(
  (value) => new Date(value).getTime() <= Date.now(),
  { message: "Date of birth cannot be in the future" },
);

export const oldVehicleFormSchema = z
  .object({
    dob: dobField,
    vehicleRegNumber: z
      .string()
      .trim()
      .min(1, "Vehicle registration number is required")
      .regex(
        /^[A-Z0-9]+$/i,
        "Use only letters and numbers, with no spaces",
      )
      .refine((value) => value.replace(/\D/g, "").length >= 4, {
        message: "Registration number must include at least 4 digits",
      }),
    vehicleColor: z.string().min(1, "Select a vehicle color"),
    purchaseDate: dateField("Purchase date"),
  })
  .refine((data) => new Date(data.purchaseDate).getTime() <= Date.now(), {
    message: "Purchase date cannot be in the future",
    path: ["purchaseDate"],
  });

export type OldVehicleFormValues = z.infer<typeof oldVehicleFormSchema>;

export const newVehicleFormSchema = z.object({
  dob: dobField,
  purchaseMonth: z
    .string()
    .min(1, "Select a purchase month")
    .regex(/^\d{4}-\d{1,2}$/, "Select a valid purchase month"),
});

export type NewVehicleFormValues = z.infer<typeof newVehicleFormSchema>;
