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
			value.sort((a, b) => a.albumName.localeCompare(b.albumName)),
		);
	});

	return upcomingCollections;
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
				whoAdded: whoAdded ?? '',
			};
		});
}

export { createUpcomingCollections, convertUpcomingsRawToObjects };
