import { readFileSafeAsJson } from "../../../shared/readFileSafeAsJson.js";
import { AllContributorsData, Options } from "../../../shared/types.js";
import { formatJson } from "./formatters/formatJson.js";

export async function writeAllContributorsRC(options: Options) {
	const existing = (await readFileSafeAsJson(
		".all-contributorsrc",
	)) as AllContributorsData | null;

	return await formatJson({
		badgeTemplate:
			'	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: <%= contributors.length %>" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-<%= contributors.length %>-21bb42.svg" /></a>',
		contributors: existing?.contributors ?? [],
		contributorsSortAlphabetically: true,
		projectName: options.repository,
		projectOwner: options.owner,
	});
}
