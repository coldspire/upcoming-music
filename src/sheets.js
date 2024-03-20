async function getUpcomingMusicValues(sheetsApiKey, musicSheetId) {
	console.log('Getting Sheets data');

	const range = 'All!A4:E100';
	const address = `https://sheets.googleapis.com/v4/spreadsheets/${musicSheetId}/values/${range}`;

	const url = `${address}?` + new URLSearchParams({ key: sheetsApiKey }).toString();

	const results = await fetch(url)
		.then((response) => response.json())
		.then((data) => data.values)
		.catch((error) => {
			console.error('Sheets API fetch failed for reason:', error.message);
		});

	console.log('Got Sheets data successfully');

	return results;
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
