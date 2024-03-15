import createMessageFromUpcomingReleases from './message-maker.js';
import { UpcomingSubCommand } from './commands.js';

/**
 *
 * @param {UpcomingSubCommand} upcomingDuration
 * @param {Map} releaseCollections
 * @return {string}
 */
function handleUpcomingRequest(upcomingDuration, releaseCollections) {
	const daysLimit = upcomingDuration === UpcomingSubCommand.Soon ? 30 : 99999;
	const collectionsToShow = new Map([...releaseCollections].filter(([daysUntil]) => Number(daysUntil) <= daysLimit));
	return createMessageFromUpcomingReleases(collectionsToShow);
}

/**
 *
 * @param interaction
 * @param {Map} releaseCollections
 * @return {string}
 */
function getMessageByMusicCommand(interaction, releaseCollections) {
	const { data } = interaction;
	const subgroupName = data.options[0]?.name.toLowerCase();

	let messageContent = '';
	switch (subgroupName) {
		case 'upcoming': {
			const subcommandName = data.options[0].options[0].name.toLowerCase();
			messageContent = handleUpcomingRequest(subcommandName, releaseCollections);
		}
	}

	return messageContent;
}

export { getMessageByMusicCommand };
