<template>
    <q-page class="flex justify-center items-center column">
        <q-dialog v-model="dialog" position="top"
            persistent
            :auto-close="false"
        >
        <q-card style="width: 40vw; min-width: 300px; margin-inline: auto;">
            <q-card-section class="row items-center no-wrap">
                <div>
                    <div class="text-weight-bold">Ongoing Game</div>
                    <div class="text-grey">Game ID: {{gameId}}</div>
                </div>
            </q-card-section>
        </q-card>
        </q-dialog>
    <div class="col column">
        <q-card
            style="width: 400px;"
            class="q-px-sm"
            dark
            bordered>
            <div class="text-h6" style="text-align: center;">Current User</div>
            <div class="text-subtitle1">{{currentUser.displayName || ''}}</div>
            <div
                v-for="property in ['accountId', 'summonerLevel', 'puuid' ]"
                :key="`${property}${currentUser.puuid || 0}`"
                class="text-subtitle2"
                >
                {{property}}: {{currentUser[property] || ''}}
            </div>
            <q-separator dark inset />
            <q-card-actions align="center">
                <button @click="connect" v-if="!connected">CONNECT</button>
                <button @click="force" v-else>FORCE FETCH</button>
            </q-card-actions>
        </q-card>

    </div>
    <CardReport
        v-for="summoner in summonersNames"
        :key="summoner.puuid"
        :summoner="summoner"
        :gameId="gameId"
        :region="region"
        :reportEnabled="reportEnabled"
          />
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { api } from '../boot/axios';
import CardReport from '../components/CardReport.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    CardReport,
  },
  setup() {
    const summonersNames = ref([]);
    const currentUser = ref({});
    const region = ref('LA1');
    const gameId = ref('123456');
    const dialog = ref(false);
    const connected = ref(false);
    const reportEnabled = ref(false);

    // Start listening for the LCU client
    function connect() {
      if (process.env.MODE === 'electron') {
        window.ipcRenderer.send('connector-start');
        console.log('connecting');
      }
    }

    function force() {
      if (process.env.MODE === 'electron') {
        window.ipcRenderer.send('force-fetch');
      }
    }

    function getNames() {
      if (process.env.MODE === 'electron') {
        window.ipcRenderer.send('connector-get-names');
        console.log('getting names');
      }
    }

    if (process.env.MODE === 'electron') {
      window.ipcRenderer.receive('summoner-names', async (msg) => {
        if (msg.error) {
          console.log(msg.error);
          return;
        }

        const filteredSummoners = msg.summonerNames.filter(
          (summoner) => summoner.puuid !== currentUser.value.puuid,
        // (summoner) => summoner.puuid !== '',
        );
        summonersNames.value = filteredSummoners;

        if (summonersNames.value.length === 4) {
          if (summonersNames.value.length === 4) {
            const puuids = summonersNames.value.map((summoner) => summoner.puuid);

            summonersNames.value.forEach(async (summoner, index) => {
              try {
                const { data } = await api.get(`/summoner/${puuids[index]}`);

                summonersNames.value[index].flamer = data.flamer || '?';
                summonersNames.value[index].good = data.good || '?';
                summonersNames.value[index].inter = data.inter || '?';
                summonersNames.value[index].leaver = data.leaver || '?';
                summonersNames.value[index].troll = data.troll || '?';
                summonersNames.value[index].reports = data.reports || '?';
              } catch (error) {
                if (error.response?.status === 404) {
                  const { data } = await api.post(
                    '/summoner',
                    {
                      id: summoner.puuid,
                      displayName: summoner.displayName,
                      internalName: summoner.internalName,
                      region: region.value,
                    },
                  );

                  summonersNames.value[index].flamer = data.flamer || '?';
                  summonersNames.value[index].good = data.good || '?';
                  summonersNames.value[index].inter = data.inter || '?';
                  summonersNames.value[index].leaver = data.leaver || '?';
                  summonersNames.value[index].troll = data.troll || '?';
                  summonersNames.value[index].reports = '?';
                } else {
                  console.log(error);
                }
              }
            });
          }
        }
      });

      window.ipcRenderer.receive('current-user', async (msg) => {
        if (
          msg.error
        || !msg.currentUser
        || !msg.currentUser.puuid
        || !msg.region) {
          summonersNames.value = [];
          currentUser.value = {};
          region.value = '';
          gameId.value = '';
          dialog.value = false;
          connected.value = false;
          return;
        }
        currentUser.value = msg.currentUser;
        region.value = msg.region;

        api.get(`/summoner/${currentUser.value.puuid}`)
          .catch((err) => {
            if (err.response.status === 404) {
              api.post(
                '/summoner',
                {
                  id: currentUser.value.puuid,
                  displayName: currentUser.value.displayName,
                  internalName: currentUser.value.internalName,
                  region: region.value,
                  self: true,
                },
              ).then(() => console.log('Summoner created'));
            }
          });
      });

      window.ipcRenderer.receive('connection-status', (msg) => {
        if (msg.error) {
          console.log(msg.error);
          connected.value = false;
        } else {
          console.log(msg.status);
          connected.value = true;
        }
      });

      window.ipcRenderer.receive('game-id', (msg) => {
        gameId.value = String(msg.gameId);
      });

      window.ipcRenderer.receive('phase', (msg) => {
        console.log(msg);
        switch (msg) {
          case 'none':
          case 'lobby':
          case 'champ-select':
            summonersNames.value = [];
            reportEnabled.value = false;
            dialog.value = false;
            break;
          case 'game-start':
          case 'in-progress':
            if (summonersNames.value.length === 0) {
              force();
            }
            dialog.value = true;
            break;
          default:
            reportEnabled.value = true;
            dialog.value = false;
            break;
        }
      });
    }

    return {
      dialog,
      currentUser,
      summonersNames,
      connected,
      region,
      gameId,
      reportEnabled,
      connect,
      force,
      getNames,
    };
  },
});
</script>
