async function getUpcomingMusicValues(sheetsApiKey, musicSheetId) {
	const range = 'All!A4:E100';
	const address = `https://sheets.googleapis.com/v4/spreadsheets/${musicSheetId}/values/${range}`;

	const url = `${address}?` + new URLSearchParams({ key: sheetsApiKey }).toString();

	return fetch(url)
		.then((response) => response.json())
		.then((data) => data.values);
}

export default getUpcomingMusicValues;

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
