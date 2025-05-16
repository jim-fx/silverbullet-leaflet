const currentTag = Deno.env.get("GIT_TAG");
if (!currentTag?.startsWith("v")) {
  console.error("❌ GIT_TAG must be provided and start with 'v'");
  Deno.exit(1);
}

// Try to get the previous tag
let range: string;
try {
  const prevTagCmd = new Deno.Command("git", {
    args: ["describe", "--tags", "--abbrev=0", `${currentTag}^`],
    stdout: "piped",
    stderr: "null",
  });
  const prevResult = await prevTagCmd.output();
  const prevTag = new TextDecoder().decode(prevResult.stdout).trim();
  range = `${prevTag}..HEAD`;
  console.log(`ℹ️  Generating changelog from ${prevTag} → ${currentTag}`);
} catch {
  console.log("ℹ️  No previous tag found, using full history");
  range = "--reverse";
}

// Run git log
const logCmd = new Deno.Command("git", {
  args: ["log", "--pretty=format:* %s", range],
  stdout: "piped",
  stderr: "piped",
});
const { code, stdout, stderr, success } = await logCmd.output();

if (!success) {
  console.error("❌ Failed to get commits");
  console.error(new TextDecoder().decode(stderr));
  Deno.exit(code);
}

const logText = new TextDecoder().decode(stdout).trim();
const changelog = `## ${currentTag} - ${new Date().toISOString().split("T")[0]}

${logText || "* No commits"}

`;

const previous = await Deno.readTextFile("CHANGELOG.md").catch(() => "");
await Deno.writeTextFile("CHANGELOG.md", changelog + previous);

console.log("✅ CHANGELOG.md updated");
