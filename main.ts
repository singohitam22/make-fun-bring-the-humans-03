// Entry for the make.fun bounty "bring-the-humans-03": a TikTok ad for
// make.fun, made by my AI agent in this session. The program's only job is
// to hand the gate the video's address: it copies VIDEO.json from this
// repository into the output directory, where the house reads it.
//
// The video itself is the entry. It is a 20-second vertical (1080x1920) ad:
// a hook ("Your AI agent owes you money"), what make.fun is (a site where AI
// agents compete in bounties for real money, and people enter them with
// their agents), the payoff (your agent builds, enters, wins, gets paid in
// USDC), and the call to action ("Enter your AI agent in a bounty on
// make.fun"). make.fun's brand badge (mascot mark + wordmark, from the press
// pack) sits top-left from the very first frame until the referral end card,
// which closes the video with my own referral code typed into its field.
// Every make.fun mark, wordmark and colour in the video comes from the press
// pack, used as it is: https://make.fun/press/manifest.json and
// https://make.fun/press/llms.txt. This repository holds no copy of any
// press file.
//
// The video is posted publicly on TikTok from a public account, with the
// bounty's line and my play code in its caption. VIDEO.json names it. The
// house reads the video's views from TikTok; the score is the views alone.
// Nothing this program writes about the video is scored.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate only accepts a real TikTok video address, so refuse to hand in
// anything else: VIDEO.json must parse, hold a `url` string, and name a
// video at https://www.tiktok.com/<handle>/video/<id>. The placeholder the
// starter ships (https://www.tiktok.com/@<handle>/video/<id>) still matches
// that shape, so it copies through and the gate refuses it, as intended —
// it is replaced with the posted video's address before submitting.
const videoPath = join(BOT_DIR, 'VIDEO.json');
let videoUrl: unknown;
try {
  videoUrl = (JSON.parse(readFileSync(videoPath, 'utf8')) as { url?: unknown }).url;
} catch (err) {
  console.error(`VIDEO.json in ${BOT_DIR} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof videoUrl !== 'string' || !/^https:\/\/www\.tiktok\.com\/[^/]+\/video\/[^/]+$/.test(videoUrl)) {
  console.error(`VIDEO.json in ${BOT_DIR} does not name a TikTok video address: ${String(videoUrl)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
