import createMessageFromUpcomingReleases from './message-maker.js';
import { UpcomingSubCommand } from './commands.js';
import getUpcomingMusicValues from './sheets.js';
import { convertUpcomingsRawToObjects, createUpcomingCollections } from './releases.js';

/**
 *
 * @param {UpcomingSubCommand} upcomingDuration
 * @param {Map} releaseCollections
 * @return {string}
 */
function handleUpcomingRequest(upcomingDuration, releaseCollections) {
	let daysLimit, header;
	if (upcomingDuration === UpcomingSubCommand.Soon) {
		daysLimit = 30;
		header = '## ⌛  Releasing within the next 30 days';
	} else {
		daysLimit = 99999;
		header = '## 📅  All future releases';
	}
	const collectionsToShow = new Map([...releaseCollections].filter(([daysUntil]) => Number(daysUntil) <= daysLimit));
	return createMessageFromUpcomingReleases(collectionsToShow, header);
}

/**
 *
 * @param interaction
 * @param {Map} releaseCollections
 * @return {string}
 */
async function getMessageByMusicCommand(interaction, env) {
	const releasesRaw = await getUpcomingMusicValues(env.SHEETS_API_KEY, env.SHEET_ID);
	const releases = convertUpcomingsRawToObjects(releasesRaw).filter((upcoming) => upcoming.daysToRelease >= 0);
	const releasesCollections = createUpcomingCollections(releases);

	const { data } = interaction;
	const subgroupName = data.options[0]?.name.toLowerCase();

	let messageContent = '';
	switch (subgroupName) {
		case 'upcoming': {
			const subcommandName = data.options[0].options[0].name.toLowerCase();
			messageContent = handleUpcomingRequest(subcommandName, releasesCollections);
		}
	}

	return messageContent;
}

export { getMessageByMusicCommand };
