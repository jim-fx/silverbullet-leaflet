const yamlPath = "leaflet.plug.yaml";
const versionTag = Deno.env.get("GIT_TAG");

if (!versionTag?.startsWith("v")) {
  console.error(`❌ Invalid tag passed via GIT_TAG (${versionTag})`);
  Deno.exit(1);
}

const newVersion = versionTag.slice(1);

const lines = (await Deno.readTextFile(yamlPath)).split("\n");
const versionLineIndex = lines.findIndex((line) =>
  line.trim().startsWith("version:")
);
if (versionLineIndex === -1) {
  console.error("❌ No version field found in YAML");
  Deno.exit(1);
}

const currentVersion = lines[versionLineIndex].split(":")[1].trim();

const semver = (v: string): [number, number, number] => {
  const ver = v.split(".").map((n) => parseInt(n, 10));
  if (ver.length !== 3 || ver.some((n) => isNaN(n))) {
    throw new Error(`Invalid version: ${v}`);
  }
  return ver as [number, number, number];
};

const [oMajor, oMinor, oPatch] = semver(currentVersion);
const [nMajor, nMinor, nPatch] = semver(newVersion);

const valid = nMajor > oMajor ||
  (nMajor === oMajor && nMinor > oMinor) ||
  (nMajor === oMajor && nMinor === oMinor && nPatch > oPatch);

if (!valid) {
  console.error(
    `❌ Version ${newVersion} is not greater than ${currentVersion}`,
  );
  Deno.exit(1);
}

lines[versionLineIndex] = `version: ${newVersion}`;
await Deno.writeTextFile(yamlPath, lines.join("\n"));

console.log(`✅ Updated version: ${currentVersion} → ${newVersion}`);
