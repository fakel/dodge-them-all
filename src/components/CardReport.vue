<template>
    <q-card
        dark
        bordered
        class="bg-grey-9 q-px-sm col"
        style="width: 400px;"
    >
      <q-card-section>
        <div class="text-h6">{{summoner.displayName}}</div>
        <div class="text-subtitle2">puuid: {{summoner.puuid}}</div>
        <div class="flex">
            <div
                v-for="property in [
                    'good',
                    'troll',
                    'inter',
                    'flamer',
                    'leaver' ]"
                :key="`${property}${summoner.puuid || 0}`"
                class="text-subtitle2 q-mr-sm"
                >
                {{property}}: {{summoner[property] || 0}}
            </div>
        </div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-actions align="center" v-if="reportEnabled">
        <q-checkbox
            v-model="summonerReport.afk"
            val="afk" label="afk" color="grey" />
        <q-checkbox
            v-model="summonerReport.inter"
            val="inter" label="inter" color="brown" />
        <q-checkbox
            v-model="summonerReport.troll"
            val="troll" label="troll" color="red" />
        <q-checkbox
            v-model="summonerReport.flamer"
            val="flamer" label="flamer" color="orange" />
        <q-checkbox
            v-model="summonerReport.good"
            val="good" label="good" color="green" />

        </q-card-actions>
        <q-card-actions align="center" v-if="reportEnabled">
        <q-btn
            v-if="!sent"
            @click="() => tagUser(summoner.puuid, gameId, 'flamer')"
            label="Send Report"
            />
        </q-card-actions>
    </q-card>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { api } from '../boot/axios';

export default defineComponent({
  name: 'CardReport',
  props: {
    summoner: Object,
    gameId: String,
    region: String,
    reportEnabled: Boolean,
  },
  setup(props) {
    const gameId = ref(props.gameId);
    const region = ref(props.region);
    const sent = ref(false);

    const summonerReport = ref({
      gameId: gameId.value,
      region: region.value,
      summonerId: props.summoner.puuid,
      displayName: props.summoner.displayName,
      internalName: props.summoner.internalName,
      comment: '',
      afk: false,
      inter: false,
      troll: false,
      flamer: false,
      good: false,
    });

    function tagUser() {
      sent.value = true;
      api.post('/report', summonerReport.value)
        .then(() => {
          alert('report sent');
        }).catch((err) => {
          alert(err);
          sent.value = false;
        });
    }

    return {
      summonerReport,
      tagUser,
      sent,
    };
  },
});
</script>
