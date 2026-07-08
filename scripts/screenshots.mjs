import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "..", "public", "screenshots");

const SITES = [
	{ slug: "minimax-m3", url: "https://minimax-m3-design-test.vercel.app" },
	{ slug: "kimi-k2-6", url: "https://kimi-k2-6-design-test.vercel.app" },
	{ slug: "opus-4-8", url: "https://opus-4-8-design-test.vercel.app" },
	{ slug: "grok-build-0-1", url: "https://grok-build-0-1-design-test.vercel.app" },
	{ slug: "composer-2-5", url: "https://composer-2-5-design-test.vercel.app" },
	{ slug: "glm-5-1", url: "https://glm-5-1-design-test.vercel.app" },
	{ slug: "gpt-5-5", url: "https://gpt-5-5-design-test.vercel.app" },
	{ slug: "deepseek-v4-pro", url: "https://deepseek-v4-pro-design-test.vercel.app" },
	{ slug: "qwen-3-7-max", url: "https://qwen-3-7-max-design-test.vercel.app" },
	{ slug: "claude-fable-5", url: "https://claude-fable-5-design-test.vercel.app" },
	{ slug: "kimi-k2-7", url: "https://kimi-k2-7-design-test.vercel.app" },
	{ slug: "glm-5-2", url: "https://glm-5-2-design-test.vercel.app" },
	{ slug: "fugu-ultra", url: "https://fugu-ultra-design-test.vercel.app" },
	{ slug: "gemini-3-1-pro", url: "https://gemini-3-1-pro-design-test.vercel.app" },
	{ slug: "gemini-3-5-flash", url: "https://gemini-3-5-flash-design-test.vercel.app" },
	{ slug: "mimo-v2-5-pro", url: "https://mimo-v2-5-pro-design-test.vercel.app" },
	{ slug: "ornith-1-0-35b-q8-0", url: "https://ornith-1-0-35b-q8-0-design-test.vercel.app" },
	{ slug: "glm-5-2-max-cursor", url: "https://glm-5-2-max-cursor-design-test.vercel.app" },
	{ slug: "gpt-5-6-luna-high", url: "https://gpt-5-6-luna-high-design-test.vercel.app" },
	{ slug: "gpt-5-6-sol-high", url: "https://gpt-5-6-sol-high-design-test.vercel.app" },
	{ slug: "gpt-5-6-terra-high", url: "https://gpt-5-6-terra-high-design-test.vercel.app" },
];

const VIEWPORT = { width: 1440, height: 900 };
const SCALE = 2;

async function shoot(browser, site) {
	const context = await browser.newContext({
		viewport: VIEWPORT,
		deviceScaleFactor: SCALE,
		colorScheme: "light",
		reducedMotion: "reduce",
	});
	const page = await context.newPage();
	const out = resolve(OUT_DIR, `${site.slug}.jpg`);
	try {
		console.log(`→ ${site.slug}: ${site.url}`);
		await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 60_000 });
		try {
			await page.waitForLoadState("networkidle", { timeout: 20_000 });
		} catch {
			console.log(`  (networkidle timeout, continuing)`);
		}
		await page.waitForTimeout(2500);
		await page.evaluate(() => window.scrollTo(0, 0));
		await page.screenshot({
			path: out,
			type: "jpeg",
			quality: 88,
			clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
		});
		console.log(`  ✓ saved ${out}`);
	} catch (err) {
		console.error(`  ✗ ${site.slug} failed:`, err.message);
	} finally {
		await context.close();
	}
}

async function main() {
	await mkdir(OUT_DIR, { recursive: true });
	const browser = await chromium.launch();
	try {
		for (const site of SITES) {
			await shoot(browser, site);
		}
	} finally {
		await browser.close();
	}
	console.log("Done.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
