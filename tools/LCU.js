const {
  authenticate, DEPRECATED_request: request,
} = require('league-connect');

const main = async () => {
  const credentials = await authenticate();
  const response = await request({
    method: 'GET',
    url: '/lol-league-session/v1/league-session-token',
  }, credentials).then((res) => res.json());

  const { reg } = JSON.parse(Buffer.from(response.split('.')[1], 'base64').toString());
  console.log(reg);
};

main();
