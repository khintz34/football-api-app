export async function getTeamStats(id) {
  const url = `https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=39&season=2020&team=${id}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "52e45221aamsh291d365e94c68ecp10cee2jsn6c88101151c8",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
  } catch (error) {
    console.error(error);
  }
}
