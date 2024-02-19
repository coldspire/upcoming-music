require("dotenv").config();

const axios = require("axios").default;

const {
  env: { SHEETS_API_KEY, SHEET_ID },
} = process;

export function getUpcomingMusicValues() {
  const range = "All!A4:E100";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`;

  return axios.get(url, {
    params: {
      key: SHEETS_API_KEY,
    },
  });
}
