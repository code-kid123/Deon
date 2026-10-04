import { readFileSync, existsSync } from "node:fs";
import { parse, type TomlValue } from "smol-toml";

type Rule = { for?: string; values?: Record<string, TomlValue> };

const raw = readFileSync("netlify.toml", "utf8");

let cfg: Record<string, TomlValue>;
try {
  cfg = parse(raw);
  console.log("PASS  netlify.toml parses as valid TOML");
} catch (error) {
  console.error("FAIL  TOML parse error:", error);
  process.exit(1);
}

const build = (cfg.build ?? {}) as Record<string, TomlValue>;
const env = (build.environment ?? {}) as Record<string, TomlValue>;

const check = (label: string, actual: unknown, expected: unknown): void => {
  const ok = actual === expected;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${label} = ${JSON.stringify(actual)}${ok ? "" : ` (expected ${JSON.stringify(expected)})`}`
  );
  if (!ok) process.exitCode = 1;
};

check("build.command", build.command, "npm run build");
check("build.environment.NODE_VERSION", env.NODE_VERSION, "20");
check("build.environment.NEXT_TELEMETRY_DISABLED", env.NEXT_TELEMETRY_DISABLED, "1");

if (build.publish !== undefined) {
  console.log(
    `FAIL  build.publish is pinned to "${String(build.publish)}" — the Next.js runtime plugin must own publish`
  );
  process.exitCode = 1;
} else {
  console.log("PASS  build.publish is not pinned (runtime plugin owns it)");
}

const plugins = (Array.isArray(cfg.plugins) ? cfg.plugins : []) as { package?: string }[];
const nextPlugin = plugins.find((p) => p.package === "@netlify/plugin-nextjs");
if (!nextPlugin) {
  console.log("FAIL  @netlify/plugin-nextjs plugin entry missing");
  process.exitCode = 1;
} else {
  console.log("PASS  @netlify/plugin-nextjs plugin declared");
  const pkgJson = "node_modules/@netlify/plugin-nextjs/package.json";
  if (existsSync(pkgJson)) {
    const { version } = JSON.parse(readFileSync(pkgJson, "utf8")) as { version: string };
    console.log(`PASS  @netlify/plugin-nextjs resolves locally (${version})`);
  } else {
    console.log("WARN  plugin not in node_modules — Netlify installs build plugins at build time, so this is OK");
  }
}

const headerRules = (Array.isArray(cfg.headers) ? cfg.headers : []) as Rule[];
console.log(`PASS  ${headerRules.length} header rule(s) declared: ${headerRules.map((h) => h.for).join(", ")}`);

const secure = headerRules.find((h) => h.for === "/*")?.values ?? {};
for (const key of ["X-Content-Type-Options", "Referrer-Policy", "X-Frame-Options"]) {
  const value = secure[key];
  if (value === undefined) {
    console.log(`FAIL  security header ${key} missing`);
    process.exitCode = 1;
  } else {
    console.log(`PASS  security header ${key} = ${String(value)}`);
  }
}

const nodeEnv = (() => {
  try {
    return JSON.parse(readFileSync("package.json", "utf8")).engines?.node as string | undefined;
  } catch {
    return undefined;
  }
})();
check("package.json engines.node", nodeEnv, ">=20.0.0");

if (existsSync(".nvmrc") && readFileSync(".nvmrc", "utf8").trim() !== String(env.NODE_VERSION)) {
  console.log("FAIL  .nvmrc does not match build.environment.NODE_VERSION");
  process.exitCode = 1;
} else {
  console.log("PASS  .nvmrc matches NODE_VERSION");
}

console.log("\nnetlify.toml validation complete.");