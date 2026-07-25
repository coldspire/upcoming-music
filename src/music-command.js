import createMessageFromUpcomingReleases from './message-maker.js';
import { UpcomingSubCommand } from './commands.js';
import { convertUpcomingsRawToObjects, createReleaseCollections } from './releases.js';

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
		header = `## ⌛  Releasing within the next ${daysLimit} days`;
	} else {
		daysLimit = 99999;
		header = '## 📅  All future releases';
	}

	const collectionsToShow = new Map(
		[...releaseCollections].filter(([daysUntil]) => {
			return Number(daysUntil) >= 0 && Number(daysUntil) <= daysLimit;
		}),
	);

	return createMessageFromUpcomingReleases(collectionsToShow, header);
}

/**
 *
 * @param releaseCollections
 * @return {string}
 */
function handleCurrentRequest(releaseCollections) {
	const daysBackThreshold = 14;

	let message = '';
	// Previous releases first
	const previousReleasesWithinRange = new Map(
		[...releaseCollections].filter(([daysUntil]) => Number(daysUntil) >= -daysBackThreshold && Number(daysUntil) < 0),
	);
	message += createMessageFromUpcomingReleases(previousReleasesWithinRange, `## Releases in the previous ${daysBackThreshold} days`);

	// Today's and future releases next
	message += handleUpcomingRequest(UpcomingSubCommand.Soon, releaseCollections);

	return message;
}

/**
 *
 * @param interaction
 * @param {object} env
 * @param {object} releasesRaw
 * @return {string}
 */
function getMessageByMusicCommand(interaction, env, releasesRaw) {
	const { data } = interaction;
	const subgroupName = data.options[0]?.name.toLowerCase();

	const filterFunction = subgroupName === 'current' ? () => true : ({ daysToRelease }) => daysToRelease >= 0;
	const releases = convertUpcomingsRawToObjects(releasesRaw).filter(filterFunction);
	const releasesCollections = createReleaseCollections(releases);

	console.log(subgroupName);

	let messageContent = '';
	switch (subgroupName) {
		case 'upcoming': {
			const subcommandName = data.options[0].options[0].name.toLowerCase();
			messageContent = handleUpcomingRequest(subcommandName, releasesCollections);
			break;
		}
		case 'current': {
			messageContent = handleCurrentRequest(releasesCollections);
			break;
		}
	}

	return messageContent;
}

export { getMessageByMusicCommand };
