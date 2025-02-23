// parse.js
import fs from "fs/promises";
import dotenv from "dotenv";

// .env dosyasını yükle
dotenv.config();

const template = await fs.readFile("manifest.prexml", "utf-8");

let output = template;
Object.entries(process.env).forEach(([key, value]) => {
  const regex = new RegExp(`{{${key.toLowerCase()}}}`, "g");
  output = output.replace(regex, value);
});

await fs.writeFile("manifest.xml", output);
console.log("manifest.xml created successfully!");
