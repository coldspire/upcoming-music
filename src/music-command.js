import createMessageFromUpcomingReleases from './message-maker.js';

/**
 *
 * @param {UpcomingSubCommand} upcomingDuration
 * @param {Map} releaseCollections
 * @return {string}
 */
function handleUpcomingRequest(upcomingDuration, releaseCollections) {
	// TODO: Change this returned message based on upcomingDuration
	return createMessageFromUpcomingReleases(releaseCollections); // This should be the Markdown string of releases
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
