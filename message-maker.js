const getUpcomingMusicValues = require("./sheets");

/**
 * @typedef UpcomingsRaw
 * @type {array}
 */

/**
 * @typedef Upcoming
 * @type {object}
 * @property {string} artist
 * @property {string} albumName
 * @property {number} dateReleased
 * @property {number} daysToRelease
 * @property {string} musicUrl
 * @property {"Jason"|"Owen"} whoAdded
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
 * @param {UpcomingsRaw} upcomingsRaw
 * @return {Upcoming[]}
 */
function convertUpcomingsRawToObjects(upcomingsRaw) {
  return upcomingsRaw
    .filter((upcomingRaw) => {
      // At least get rid of stuff that includes alpha chars
      const dateAsNum = Date.parse(
        upcomingRaw[UpcomingRawIndexes.DateReleased],
      );
      return !Number.isNaN(dateAsNum);
    })
    .map(([artist, albumName, dateReleasedStr, musicUrl, whoAdded]) => {
      const dateReleased = Date.parse(`${dateReleasedStr} 2024`);

      return {
        artist,
        albumName,
        dateReleased,
        daysToRelease: getDaysToRelease(dateReleased),
        musicUrl,
        whoAdded,
      };
    });
}

/**
 * Returns a Markdown-formatted string for a single upcoming release
 * @param {Upcoming} upcoming An Upcoming release object
 * @returns {string}
 */
function createMessageLinePerUpcoming(upcoming) {
  const dayStr = Math.abs(upcoming.daysToRelease) > 1 ? "days" : "day";
  const dateWritten = new Date(upcoming.dateReleased).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "short", day: "numeric" },
  );
  return `🎵 **${upcoming.albumName}** by ${upcoming.artist} is out in **${upcoming.daysToRelease} ${dayStr}** on ${dateWritten} ([Apple Music](${upcoming.musicUrl}))`;
}

/**
 * Returns a Markdown-formatted upcomings messages based on the raw upcomings
 * @param {UpcomingsRaw} upcomingsRaw
 */
function createMessageFromUpcomingsRaw(upcomingsRaw) {
  const releaseMessages = convertUpcomingsRawToObjects(upcomingsRaw)
    .filter((upcoming) => upcoming.daysToRelease >= 0)
    .map((upcoming) => createMessageLinePerUpcoming(upcoming));

  console.log(releaseMessages);
}

module.exports = createMessageFromUpcomingsRaw;

getUpcomingMusicValues().then(createMessageFromUpcomingsRaw);
