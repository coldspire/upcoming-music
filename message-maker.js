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
    .map(([artist, albumName, dateReleasedStr, musicUrl, whoAdded]) => ({
      artist,
      albumName,
      dateReleased: Date.parse(`${dateReleasedStr} 2024`),
      musicUrl,
      whoAdded,
    }));
}

/**
 * Returns a Markdown-formatted upcomings messages based on the raw upcomings
 * @param {UpcomingsRaw} upcomingsRaw
 */
function createMessageFromUpcomingsRaw(upcomingsRaw) {
  console.log(convertUpcomingsRawToObjects(upcomingsRaw));
}

module.exports = createMessageFromUpcomingsRaw;

// getUpcomingMusicValues().then(createMessageFromUpcomingsRaw);
