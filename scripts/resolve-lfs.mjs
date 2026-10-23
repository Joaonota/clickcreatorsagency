import { promises as fs } from "node:fs";
import path from "node:path";

const LFS_HEADER = "version https://git-lfs.github.com/spec/v1";
const VIDEO_DIR = path.resolve("public", "Videos");

const sha = process.env.VERCEL_GIT_COMMIT_SHA || "";
const ref = process.env.VERCEL_GIT_COMMIT_REF || "main";
const rev = sha || ref;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function main() {
  let files;
  try {
    files = await walk(VIDEO_DIR);
  } catch {
    console.log("[resolve-lfs] sem pasta public/Videos — nada a fazer");
    return;
  }

  let resolved = 0;
  for (const file of files) {
    const stat = await fs.stat(file);
    if (stat.size >= 1000) continue;

    const text = await fs.readFile(file, "utf8");
    if (!text.startsWith(LFS_HEADER)) continue;

    const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");
    const url = `https://media.githubusercontent.com/media/Joaonota/clickcreatorsagency/${rev}/${rel}`;
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length <= 1000) throw new Error(`resposta pequena (${buf.length}B)`);
      await fs.writeFile(file, buf);
      resolved += 1;
      console.log(`[resolve-lfs] ${rel}: ponteiro -> ${(buf.length / 1048576).toFixed(1)} MB`);
    } catch (err) {
      console.warn(`[resolve-lfs] AVISO: falhou ${rel} (${err.message}) — mantém ponteiro`);
    }
  }

  console.log(`[resolve-lfs] ${resolved} ficheiro(s) resolvido(s)`);
}

main();
