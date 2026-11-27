import { exampleImageFiles, exampleImages, type ExampleImageKey } from "@/data/examples/images";
import { exampleVideoKeys } from "@/data/examples/videos";

/**
 * Builds a `/standards/*` page's code snippet from the SAME props the page renders, so the snippet cannot drift
 * from the example. Example images print as their import name, hosted clips as the fleet media helper call; everything else
 * prints as the value on screen (dates included, since fixtures compute them from today).
 */
const imageKeyByUrl = new Map<string, ExampleImageKey>(
  (Object.keys(exampleImages) as ExampleImageKey[]).map((key) => [exampleImages[key] as string, key]),
);

// Built from parts so the link checker's text scan does not mistake this file for a real media reference.
const MEDIA_HELPER = ["media", "Url"].join("");

const IDENT = /^[A-Za-z_$][\w$]*$/;

/** Marks a prop value that should print as the given code instead of being serialized (e.g. a helper call). */
export const rawCode = (code: string) => ({ __rawCode: code });

const MAX_DEPTH = 8;

const serialize = (value: unknown, depth: number, used: Set<ExampleImageKey>): string | undefined => {
  // React elements (icons, JSX) are circular and not data: skip them instead of recursing forever.
  if (typeof value === "object" && value !== null && "$$typeof" in value) return undefined;
  if (typeof value === "object" && value !== null && "__rawCode" in value) return String((value as { __rawCode: string }).__rawCode);
  if (depth > MAX_DEPTH) return undefined;
  const pad = "  ".repeat(depth);
  const inner = "  ".repeat(depth + 1);
  if (value === undefined || typeof value === "function") return undefined;
  if (value === null || typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "string") {
    const key = imageKeyByUrl.get(value);
    if (key) {
      used.add(key);
      return `${key}Image`;
    }
    const video = exampleVideoKeys[value];
    if (video) return `${MEDIA_HELPER}("${video.prefix}", "${video.path}")`;
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    const items = value.map((v) => serialize(v, depth + 1, used)).filter((v): v is string => v !== undefined);
    return items.length ? `[\n${items.map((i) => `${inner}${i},`).join("\n")}\n${pad}]` : "[]";
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => [k, serialize(v, depth + 1, used)] as const)
      .filter((e): e is readonly [string, string] => e[1] !== undefined);
    return entries.length
      ? `{\n${entries.map(([k, v]) => `${inner}${IDENT.test(k) ? k : JSON.stringify(k)}: ${v},`).join("\n")}\n${pad}}`
      : "{}";
  }
  return undefined;
};

type SnippetInput = {
  /** Component name, e.g. `DogSpotlightSection`. */
  component: string;
  /** Pattern file name when it differs from the component name. */
  importPath?: string;
  /** The exact props the page's first example passes. Scalars go inline; arrays/objects become named constants. */
  props: Record<string, unknown>;
  /** Extra import lines (for example a helper the snippet calls through `rawCode`). */
  imports?: string[];
  /** Extra JSX lines printed just above the component tag (for example a sibling structured-data element). */
  beforeTag?: string[];
};

export const buildExampleSnippet = ({ component, importPath, props, imports: extraImports = [], beforeTag = [] }: SnippetInput): string => {
  const used = new Set<ExampleImageKey>();
  const inline: string[] = [];
  const consts: string[] = [];
  for (const [name, value] of Object.entries(props)) {
    if (value === undefined || typeof value === "function") continue;
    if (typeof value === "object" && value !== null && "__rawCode" in value) {
      inline.push(`${name}={${(value as { __rawCode: string }).__rawCode}}`);
    } else if (typeof value === "object" && value !== null) {
      const code = serialize(value, 0, used);
      if (code !== undefined) {
        consts.push(`const ${name} = ${code};`);
        inline.push(`${name}={${name}}`);
      }
    } else if (typeof value === "string") {
      const code = serialize(value, 0, used);
      inline.push(code?.startsWith(`"`) ? `${name}=${code}` : `${name}={${code}}`);
    } else {
      inline.push(`${name}={${String(value)}}`);
    }
  }
  const imports: string[] = [`import ${component} from "@/components/patterns/${importPath ?? component}";`];
  const needsMedia = consts.some((c) => c.includes(`${MEDIA_HELPER}(`));
  imports.push(...extraImports);
  if (needsMedia) imports.push(`import { ${MEDIA_HELPER} } from "@/lib/media-host";`);
  for (const key of [...used].sort()) imports.push(`import ${key}Image from "${exampleImageFiles[key].startsWith("@/") ? exampleImageFiles[key] : `@/assets/examples/${exampleImageFiles[key]}`}";`);
  const tag = inline.length > 2 ? `<${component}\n${inline.map((p) => `  ${p}`).join("\n")}\n/>` : `<${component} ${inline.join(" ")} />`;
  const above = beforeTag.length ? `${beforeTag.join("\n")}\n` : "";
  return `${imports.join("\n")}\n\n${consts.join("\n\n")}${consts.length ? "\n\n" : ""}${above}${tag}`;
};
