import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, { message: "Name is required" }),
  price: z.number().min(1, { message: "Price must be a positive number" }),
  description: z.string().trim().min(1, { message: "Description is required" }),
  shortDescription: z
    .string()
    .trim()
    .min(1, { message: "Short description is required" }),
  quantity: z
    .number()
    .min(1, { message: "Quantity must be a positive number" }),
  factory: z.string().trim().min(1, { message: "Factory is required" }),
  target: z.string().trim().min(1, { message: "Target is required" }),
});

export type TProductSchema = z.infer<typeof ProductSchema>;
