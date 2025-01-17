import * as fs from "node:fs/promises";
import { EOL } from "node:os";

import { readFileSafe } from "../shared/readFileSafe.js";
import { Options } from "../shared/types.js";

export const endOfReadmeTemplateLine = `> 💙 This package was templated with [\`create-typescript-app\`](https://github.com/JoshuaKGoldberg/create-typescript-app).`;

export const endOfReadmeNotice = [
	``,
	`<!-- You can remove this notice if you don't want it 🙂 no worries! -->`,
	``,
	endOfReadmeTemplateLine,
	``,
].join(EOL);

export const endOfReadmeMatcher =
	/💙.+(?:based|built|templated).+(?:from|using|on|with).+create-typescript-app/;

export async function updateReadme(
	options: Pick<Options, "excludeTemplatedBy" | "owner">,
) {
	let contents = await readFileSafe("./README.md", "");

	contents = contents
		.replaceAll("JoshuaKGoldberg", options.owner)
		.replace(/\n<img .+ alt="Project logo.+>\n/gs, "");

	if (!options.excludeTemplatedBy && !endOfReadmeMatcher.test(contents)) {
		contents += endOfReadmeNotice;
	}

	await fs.writeFile("./README.md", contents);
}
