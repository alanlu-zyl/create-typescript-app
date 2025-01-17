import { populateAllContributorsForRepository } from "populate-all-contributors-for-repository";

import { withSpinner, withSpinners } from "../shared/cli/spinners.js";
import { createCleanupCommands } from "../shared/createCleanupCommands.js";
import { OctokitAndOptions } from "../shared/options/readOptions.js";
import { clearUnnecessaryFiles } from "../steps/clearUnnecessaryFiles.js";
import { finalizeDependencies } from "../steps/finalizeDependencies.js";
import { initializeGitHubRepository } from "../steps/initializeGitHubRepository/index.js";
import { populateCSpellDictionary } from "../steps/populateCSpellDictionary.js";
import { runCleanup } from "../steps/runCleanup.js";
import { updateAllContributorsTable } from "../steps/updateAllContributorsTable.js";
import { updateLocalFiles } from "../steps/updateLocalFiles.js";
import { writeReadme } from "../steps/writeReadme/index.js";
import { writeStructure } from "../steps/writing/writeStructure.js";

export async function migrateWithOptions({
	octokit,
	options,
}: OctokitAndOptions) {
	await withSpinners("Migrating repository structure", [
		["Clearing unnecessary files", clearUnnecessaryFiles],
		[
			"Writing structure",
			async () => {
				await writeStructure(options);
			},
		],
		[
			"Writing README.md",
			async () => {
				await writeReadme(options);
			},
		],
		[
			"Updating local files",
			async () => {
				await updateLocalFiles(options);
			},
		],
		[
			"Updating all-contributors table",
			async () => {
				await updateAllContributorsTable(options);
			},
		],
	]);

	if (octokit) {
		await withSpinner("Initializing GitHub repository", async () => {
			await initializeGitHubRepository(octokit, options);
		});
	}

	if (!options.excludeAllContributors && !options.skipAllContributorsApi) {
		await withSpinner("Detecting existing contributors", async () =>
			populateAllContributorsForRepository({
				owner: options.owner,
				repo: options.repository,
			}),
		);
	}

	if (!options.skipInstall) {
		await withSpinner("Installing packages", async () =>
			finalizeDependencies(options),
		);
	}

	if (!options.excludeLintSpelling) {
		await withSpinner("Populating CSpell dictionary", populateCSpellDictionary);
	}

	await runCleanup(createCleanupCommands(options.bin), options.mode);
}
