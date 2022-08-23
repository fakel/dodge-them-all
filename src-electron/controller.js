import {
  authenticate, LeagueClient, DEPRECATED_request as request, createWebSocketConnection as connect,
} from 'league-connect';

let credentials;

export const createClient = async () => {
  credentials = await authenticate();
  return new LeagueClient(credentials);
};

export const createWS = () => connect({
  authenticationOptions: credentials,
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function getNames(mainWindow) {
  try {
    const session = await request({
      method: 'GET',
      url: '/lol-champ-select/v1/session',
    }, credentials).then((res) => res.json());

    const { gameId } = session;
    mainWindow.webContents.send('game-id', { gameId });

    const sessionIDs = session.myTeam.map((teamObj) => teamObj.summonerId);

    const summoners = await Promise.all(
      sessionIDs.map((id) => request({
        method: 'GET',
        url: `/lol-summoner/v1/summoners/${id}`,
      }, credentials)
        .then((res) => res.json())),
    );

    const summonerNames = summoners.map(({
      displayName, internalName, puuid, summonerLevel,
    }) => ({
      displayName, internalName, puuid, summonerLevel,
    }));

    mainWindow.webContents.send('summoner-names', { summonerNames });
  } catch (error) {
    mainWindow.webContents.send('summoner-names', { error });
  }
}

export async function getCurrentUser(mainWindow) {
  try {
    const currentUser = await request({
      method: 'GET',
      url: '/lol-summoner/v1/current-summoner',
    }, credentials).then((res) => res.json());

    const response = await request({
      method: 'GET',
      url: '/lol-league-session/v1/league-session-token',
    }, credentials).then((res) => res.json());

    const { reg: region } = JSON.parse(Buffer.from(response.split('.')[1], 'base64').toString());

    mainWindow.webContents.send('current-user', { currentUser, region });
  } catch (error) {
    mainWindow.webContents.send('current-user', { error });
  }
}
