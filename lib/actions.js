"use server";

import { revalidatePath } from "next/cache";
import { saveMeal } from "@/lib/meals";
import { redirect } from "next/navigation";
import { z } from "zod";

const mealSchema = z.object({
  title: z //
    .string()
    .min(1, "Title is required")
    .trim(),
  summary: z //
    .string()
    .min(1, "Summary is required")
    .trim(),
  instructions: z //
    .string()
    .min(1, "Instructions are required")
    .trim(),
  creator_email: z
    .string()
    .min(1, "Email are required")
    .email("Invalid email format"),
  image: z //
    .custom(
      (file) => file && file.size > 0,
      "Image is required and cannot be empty",
    ),
});

export const shareMeal = async (prevState, formData) => {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  const result = await mealSchema.safeParseAsync(meal);
  if (!result.success) {
    return { message: "Invalid Input!" };
  }

  await saveMeal(meal);
  revalidatePath("/meals");
  redirect("/meals");
};
