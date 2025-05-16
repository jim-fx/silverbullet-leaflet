// scripts/changelog.ts
const version = Deno.env.get("GIT_TAG")?.slice(1);
if (!version) {
  console.error("❌ GIT_TAG not provided");
  Deno.exit(1);
}

// Get commits since last tag
const command = new Deno.Command("git", {
  args: ["log", "--pretty=format:* %s", `v${version}^..HEAD`],
  stdout: "piped",
});
const { success, stderr, stdout } = await command.output();
if (!success) {
  console.error("❌ Failed to get commits");
  console.error(new TextDecoder().decode(stderr));
  Deno.exit(1);
}

const output = new TextDecoder().decode(stdout);

const changelog = `## v${version} - ${new Date().toISOString().split("T")[0]}

${output.trim() || "* No commits"}

`;

await Deno.writeTextFile(
  "CHANGELOG.md",
  changelog + (await Deno.readTextFile("CHANGELOG.md")),
);

console.log("✅ CHANGELOG.md updated");
