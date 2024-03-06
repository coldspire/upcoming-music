const axios = require('axios').default;

const {
	env: { SHEETS_API_KEY, SHEET_ID },
} = process;

function getUpcomingMusicValues() {
	const range = 'All!A4:E100';
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`;

	return axios
		.get(url, {
			params: {
				key: SHEETS_API_KEY,
			},
		})
		.then((response) => response.data.values);
}

module.exports = getUpcomingMusicValues;

/*
getUpcomingMusicValues()
  .then((response) => {
    return response.data.values;
  })
  .then((valuesRaw) => {
    return valuesRaw.map(([artist, albumName, date, musicUrl, whoAdded]) => ({
      artist,
      albumName,
      date: new Date(`${date} 2024`).toDateString(),
      musicUrl,
      whoAdded,
    }));
  })
  .then((upcomingMusic) => console.log(upcomingMusic));
*/
