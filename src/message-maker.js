/**
 * Changes a date object to the string with format "DayOfWeek, ShortMonth Day"
 * @param {Date} date
 * @return {string}
 */
function changeDateToCommonStrFormat(date) {
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	});
}

/**
 * Returns a Markdown-formatted string for a single upcoming release
 * @param {Upcoming} upcoming An Upcoming release object
 * @returns {string}
 */
function createMessageLinePerUpcoming(upcoming) {
	let messageLine = `- _${upcoming.albumName}_ by **${upcoming.artist}**`;
	if (upcoming.musicUrl) {
		messageLine += ` ([Listen](<${upcoming.musicUrl}>))`;
	}

	return messageLine;
}

/**
 * Create a releasing header for a series of upcomings on a given day
 * @param {number} daysToRelease
 * @param {Date} dateReleased
 * @return {string}
 */
function createReleasingHeader(daysToRelease, dateReleased) {
	const dateWritten = changeDateToCommonStrFormat(new Date(dateReleased));

	if (daysToRelease === 0) {
		return `💥 Releasing **TODAY!** (${dateWritten})`;
	}

	const dayStr = Math.abs(daysToRelease) > 1 ? 'days' : 'day';
	return `🎧 Releasing in **${daysToRelease} ${dayStr}** (on ${dateWritten})`;
}

/**
 * Returns the full message to send to Discord.
 * @param {Map} upcomingsCollections
 * @returns {string}
 */
function createMessageFromUpcomingReleases(upcomingsCollections) {
	const createSeparateLine = (str) => str + '\n';

	let fullMessage = '';
	upcomingsCollections.forEach((upcomings) => {
		fullMessage += createSeparateLine(
			// All the upcomings in this collection have the same daysToRelease and dateRelease,
			// so we can just pass the values of the first upcoming
			createReleasingHeader(upcomings[0].daysToRelease, upcomings[0].dateReleased),
		);
		upcomings.forEach((upcoming) => {
			fullMessage += createSeparateLine(createMessageLinePerUpcoming(upcoming));
		});
		fullMessage += `\n`;
	});

	return fullMessage;
}

export default createMessageFromUpcomingReleases;
