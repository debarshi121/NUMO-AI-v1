import { z } from "zod";

export const newVehicleSchema = z.object({
  vehicleType: z.literal("new"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  // purchaseMonth key from the form: "YYYY-M" (0-indexed month)
  purchaseMonth: z.string().regex(/^\d{4}-\d{1,2}$/, "Invalid purchase month"),
});

export const oldVehicleSchema = z.object({
  vehicleType: z.literal("old"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  vehicleRegNumber: z.string().min(1, "Vehicle registration number is required"),
  vehicleColor: z.string().min(1, "Vehicle color is required"),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid purchase date format"),
});
