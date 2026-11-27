#!/usr/bin/env node
// SHARED PATTERN: do not edit in a site repo.
// Source: github.com/4LeggedIT/internal-tools
//   4leggedit-websites/templates-sources/tools/convert-images.mjs
// Change it there, then sync it to every site.
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import { imageConversionDefaults, imageConversionPresets } from "./convert-images.config.mjs";

const projectRoot = process.cwd();
const execFileAsync = promisify(execFile);

const usage = `Usage:
  node tools/convert-images.mjs [--preset <name>] [--slug <asset-slug>] [--prefix <filename-prefix>] [--out-dir <dir>] [--max <px>] [--quality <1-100>] <image...>

Examples:
  node tools/convert-images.mjs --preset placement --slug oops-crew /Users/me/Downloads/IMG_4429.heic
  node tools/convert-images.mjs --out-dir src/assets/gallery --prefix adoption-day photo.jpg`;

const toPosix = (filePath) => filePath.split(path.sep).join("/");

const parseArgs = (argv) => {
  const options = {
    max: imageConversionDefaults.max,
    quality: imageConversionDefaults.quality,
    outDir: null,
    preset: null,
    prefix: null,
    slug: null,
    inputs: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--preset") {
      options.preset = argv[++index];
      continue;
    }
    if (arg === "--slug") {
      options.slug = argv[++index];
      continue;
    }
    if (arg === "--prefix") {
      options.prefix = argv[++index];
      continue;
    }
    if (arg === "--out-dir") {
      options.outDir = argv[++index];
      continue;
    }
    if (arg === "--max") {
      options.max = Number(argv[++index]);
      continue;
    }
    if (arg === "--quality") {
      options.quality = Number(argv[++index]);
      continue;
    }
    options.inputs.push(arg);
  }

  return options;
};

const assertSafeName = (value, label) => {
  if (!value || !/^[a-z0-9][a-z0-9-]*$/i.test(value)) {
    throw new Error(`${label} must use letters, numbers, and hyphens only.`);
  }
};

const sortByBasename = (files) =>
  [...files].sort((left, right) => path.basename(left).localeCompare(path.basename(right), undefined, { numeric: true }));

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

const writeWebpWithSharp = async (input, outputPath, options) => {
  await sharp(input, { failOn: "none" })
    .rotate()
    .resize({ width: options.max, height: options.max, fit: "inside", withoutEnlargement: true })
    .webp({ quality: options.quality, effort: 6, smartSubsample: true })
    .toFile(outputPath);
};

const writeWebp = async (input, outputPath, options) => {
  try {
    await writeWebpWithSharp(input, outputPath, options);
    return "sharp";
  } catch (error) {
    if (path.extname(input).toLowerCase() !== ".heic") throw error;

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "convert-image-"));
    try {
      await execFileAsync("qlmanage", ["-t", "-s", String(options.max), "-o", tmpDir, input]);
      const tmpPng = path.join(tmpDir, `${path.basename(input)}.png`);
      await writeWebpWithSharp(tmpPng, outputPath, options);
      return "qlmanage+sharp";
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  }
};

const resolveOptions = (rawOptions) => {
  const preset = rawOptions.preset ? imageConversionPresets[rawOptions.preset] : null;
  if (rawOptions.preset && !preset) {
    throw new Error(`Unknown preset "${rawOptions.preset}". Available presets: ${Object.keys(imageConversionPresets).join(", ")}`);
  }

  const slug = rawOptions.slug;
  if (slug) assertSafeName(slug, "--slug");

  const prefix = rawOptions.prefix ?? slug ?? preset?.prefix ?? imageConversionDefaults.prefix;
  assertSafeName(prefix, "--prefix");

  const baseOutDir = rawOptions.outDir ?? preset?.outputDir ?? imageConversionDefaults.outputDir;
  const outDir = slug && !rawOptions.outDir ? path.join(baseOutDir, slug) : baseOutDir;

  return {
    ...rawOptions,
    prefix,
    outDir,
  };
};

const main = async () => {
  const rawOptions = parseArgs(process.argv.slice(2));
  if (rawOptions.help) {
    console.log(usage);
    return;
  }

  const options = resolveOptions(rawOptions);

  if (!Number.isFinite(options.max) || options.max < 320) {
    throw new Error("--max must be a number greater than or equal to 320.");
  }
  if (!Number.isFinite(options.quality) || options.quality < 1 || options.quality > 100) {
    throw new Error("--quality must be a number from 1 to 100.");
  }
  if (!options.inputs.length) {
    throw new Error(`No input images provided.\n\n${usage}`);
  }

  const outDir = path.resolve(projectRoot, options.outDir);
  await fs.mkdir(outDir, { recursive: true });

  const outputs = [];
  const inputs = sortByBasename(options.inputs);
  const padWidth = Math.max(2, String(inputs.length).length);

  for (let index = 0; index < inputs.length; index += 1) {
    const input = path.resolve(inputs[index]);
    const inputStat = await fs.stat(input);
    if (!inputStat.isFile()) {
      throw new Error(`Input is not a file: ${input}`);
    }

    const outputName = `${options.prefix}-${String(index + 1).padStart(padWidth, "0")}.webp`;
    const outputPath = path.join(outDir, outputName);
    const method = await writeWebp(input, outputPath, options);

    const outputStat = await fs.stat(outputPath);
    outputs.push({
      from: input,
      to: outputPath,
      beforeSize: inputStat.size,
      afterSize: outputStat.size,
      method,
    });
  }

  console.log(`Converted ${outputs.length} image(s) to ${toPosix(path.relative(projectRoot, outDir))}.`);
  for (const output of outputs) {
    console.log(
      `${path.basename(output.from)} -> ${toPosix(path.relative(projectRoot, output.to))} (${formatBytes(output.beforeSize)} -> ${formatBytes(output.afterSize)}, ${output.method})`,
    );
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
