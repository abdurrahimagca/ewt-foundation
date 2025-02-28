// parse.js
import fs from "fs/promises";
import dotenv from "dotenv";
import { createWriteStream } from "fs";
import archiver from "archiver";
import path from "path";

// Get env file from command line argument
const envFile = process.argv[2];

if (!envFile) {
  console.error("Please provide an env file: node parse.js <env-file>");
  process.exit(1);
}

// Load specified env file
dotenv.config({ path: envFile });

async function createZipArchive() {
  // Create a temporary directory for our files
  await fs.mkdir("temp/EwtFoundation/Resources", { recursive: true });

  // Read and process the manifest template
  const manifestTemplate = await fs.readFile("manifest.prexml", "utf-8");

  let manifestContent = manifestTemplate;
  Object.entries(process.env).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key.toLowerCase()}}}`, "g");
    manifestContent = manifestContent.replace(regex, value);
  });

  // Generate output filename based on env file name
  const outputName = `EwtFoundation_${path.basename(envFile, ".env")}.zip`;

  // Write manifest.xml to temp directory
  await fs.writeFile("temp/EwtFoundation/manifest.xml", manifestContent);

  // Create a dummy entities.xml (you should replace this with your actual entities.xml content)
  await fs.writeFile(
    "temp/EwtFoundation/Resources/entities.xml",
    "<entities></entities>",
  );

  // Create zip file
  const output = createWriteStream(outputName);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Maximum compression
  });

  archive.pipe(output);

  // Add the temp directory contents to zip
  archive.directory("temp/EwtFoundation", "EwtFoundation");

  // Finalize the archive
  await archive.finalize();

  // Clean up temp directory
  await fs.rm("temp", { recursive: true, force: true });

  console.log(`${outputName} created successfully!`);
}

// Run the process
createZipArchive().catch(console.error);
