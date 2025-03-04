import { z } from "zod";

export const requestSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    age: z.number().positive("Age must be a positive number"),
});
