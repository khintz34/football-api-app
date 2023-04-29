export async function findTeam(id) {
  //   const url = `https://api-football-v1.p.rapidapi.com/v1/statistics?league=39&season=2022&team=${id}`;
  const url = `https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=39&season=2022&team=${id}`;

  const options = {
    method: "GET",
    headers: {
      "content-type": "application/octet-stream",
      "X-RapidAPI-Key": "52e45221aamsh291d365e94c68ecp10cee2jsn6c88101151c8",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log("findTeam");
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
