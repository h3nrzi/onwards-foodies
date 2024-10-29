import fs from "node:fs";
import path from "node:path";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export const getMeals = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // throw new Error("Loading meals failed");
  return db.prepare("SELECT * FROM meals").all();
};

export const getMealBySlug = (slug) => {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
};

export const saveMeal = async (meal) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 1) Generate slug and sanitize the instructions
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  // 2) Generate a unique filename
  const extension = meal.image.name.split(".").pop();
  const filename = `${meal.slug}-${Date.now()}.${extension}`;

  // 3) Write the image buffer, Insert meal data into the database
  const p = path.join(path.resolve(), "public", "images", filename);
  const stream = fs.createWriteStream(p);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) throw new Error("Saving image failed");

    meal.image = `/images/${filename}`;
    stream.end();

    db.prepare(
      `
        INSERT INTO meals (slug, title, summary, image, instructions, creator, creator_email) 
        VALUES (
            @slug,
            @title,
            @summary, 
            @image, 
            @instructions, 
            @creator, 
            @creator_email)
      `,
    ).run(meal);
  });
};
