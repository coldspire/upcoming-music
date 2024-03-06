/**
 * @typedef UpcomingsRaw
 * @type {array}
 */

/**
 * @typedef Upcoming
 * @type {Object}
 * @property {string} artist
 * @property {string} albumName
 * @property {number} dateReleased
 * @property {number} daysToRelease
 * @property {string} musicUrl
 * @property {'Jason'|'Owen'} whoAdded
 */

/**
 * @typedef {Object} UpcomingsByDate
 * @property {Upcoming[]}
 */

/**
 * Which data is in which index in a raw upcoming-music value.
 * @readonly
 * @enum {number}
 */
const UpcomingRawIndexes = {
	Artist: 0,
	AlbumName: 1,
	DateReleased: 2,
	MusicUrl: 3,
	WhoAdded: 4,
};

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
 * Returns the number of days since a release date.
 * @param {number} dateReleaseByEpoch
 * @return {number} A positive number in days if the release is in the future, zero if the release is today,
 *                  or a negative number if the release is in the past
 */
function getDaysToRelease(dateReleaseByEpoch) {
	const msPerDay = 60 * 60 * 24 * 1000;
	const todayAtMidnightByEpoch = new Date().setHours(0, 0, 0, 0);
	return Math.round((dateReleaseByEpoch - todayAtMidnightByEpoch) / msPerDay);
}

/**
 *
 * @param {UpcomingsRaw} upcomingsRaw
 * @return {Upcoming[]}
 */
function convertUpcomingsRawToObjects(upcomingsRaw) {
	return upcomingsRaw
		.filter((upcomingRaw) => {
			// At least get rid of stuff that includes alpha chars
			const dateAsNum = Date.parse(upcomingRaw[UpcomingRawIndexes.DateReleased]);
			return !Number.isNaN(dateAsNum);
		})
		.map(([artist, albumName, dateReleasedStr, musicUrl, whoAdded]) => {
			if (!artist || !albumName || !dateReleasedStr) {
				throw Error(
					`Necessary info for a release is missing. The artist, album name, and date-released for the release are: ${artist}, ${albumName}, ${dateReleasedStr}`,
				);
			}

			const dateReleased = Date.parse(`${dateReleasedStr} 2024`);

			if (Number.isNaN(dateReleased)) {
				throw Error(
					`A date-released couldn't be parsed. The artist, album name, and date-released for the release are: ${artist}, ${albumName}, ${dateReleasedStr}`,
				);
			}

			return {
				artist,
				albumName,
				dateReleased,
				daysToRelease: getDaysToRelease(dateReleased),
				musicUrl: musicUrl ?? '',
				whoAdded: whoAdded ?? ',
			};
		});
}

/**
 *
 * @param {Upcoming[]} upcomings
 * @returns {Map}
 */
function createUpcomingCollections(upcomings) {
	const upcomingCollections = new Map();
	upcomings.forEach((upcoming) => {
		const daysToReleaseKey = `${upcoming.daysToRelease}`;

		if (!upcomingCollections.get(daysToReleaseKey)) {
			upcomingCollections.set(daysToReleaseKey, [upcoming]);
		} else {
			upcomingCollections.set(daysToReleaseKey, [...upcomingCollections.get(daysToReleaseKey), upcoming]);
		}
	});

	// Sort collections by album name
	upcomingCollections.forEach((value, key, map) => {
		map.set(
			key,
			value.sort((a, b) => a.albumName.localeCompare(b.albumName))
		);
	});

	return upcomingCollections;
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
function createFullMessage(upcomingsCollections) {
	const createSeparateLine = (str) => str + '\n';

	let fullMessage = '';
	upcomingsCollections.forEach((upcomings) => {
		fullMessage += createSeparateLine(
			// All the upcomings in this collection have the same daysToRelease and dateRelease,
			// so we can just pass the values of the first upcoming
			createReleasingHeader(upcomings[0].daysToRelease, upcomings[0].dateReleased)
		);
		upcomings.forEach((upcoming) => {
			fullMessage += createSeparateLine(createMessageLinePerUpcoming(upcoming));
		});
		fullMessage += `\n`;
	});

	return fullMessage;
}

/**
 * Returns a Markdown-formatted upcomings messages based on the raw upcomings
 * @param {UpcomingsRaw} upcomingsRaw
 */
function createMessageFromUpcomingsRaw(upcomingsRaw) {
	const upcomings = convertUpcomingsRawToObjects(upcomingsRaw).filter((upcoming) => upcoming.daysToRelease >= 0);

	const upcomingCollections = createUpcomingCollections(upcomings);

	return createFullMessage(upcomingCollections);
}

module.exports = createMessageFromUpcomingsRaw;

/*
const getUpcomingMusicValues = require("./sheets");
getUpcomingMusicValues().then((upcomingsRaw) => {
  console.log(createMessageFromUpcomingsRaw(upcomingsRaw));
});
 */
