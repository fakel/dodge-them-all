<template>
    <q-layout view="lHh Lpr lFf">

        <q-header elevated>
                     <q-bar class="q-electron-drag">
          <q-icon name="laptop_chromebook" />
          <div>Dodge Them All</div>
          <q-btn dense flat icon="power_settings_new" @click="logOut" />

          <q-space />

          <q-btn dense flat icon="minimize" @click="minimize" />
          <q-btn dense flat icon="crop_square" @click="maximize" />
          <q-btn dense flat icon="close" @click="closeApp" />
        </q-bar>
            <!-- <q-toolbar>
                <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

                <q-toolbar-title>
                    Quasar App
                </q-toolbar-title>

                <div>Quasar v{{ $q.version }}</div>
            </q-toolbar> -->
        </q-header>
<!--
        <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
            <q-list>
                <q-item-label header>
                    Essential Links
                </q-item-label>

                <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
            </q-list>
        </q-drawer> -->

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import { defineComponent /* ref */ } from 'vue';
import { useSessionStore } from '../stores/session';

// import EssentialLink from 'components/EssentialLink.vue';

// const linksList = [
//   {
//     title: 'Docs',
//     caption: 'quasar.dev',
//     icon: 'school',
//     link: 'https://quasar.dev',
//   },
//   {
//     title: 'Github',
//     caption: 'github.com/quasarframework',
//     icon: 'code',
//     link: 'https://github.com/quasarframework',
//   },
//   {
//     title: 'Discord Chat Channel',
//     caption: 'chat.quasar.dev',
//     icon: 'chat',
//     link: 'https://chat.quasar.dev',
//   },
//   {
//     title: 'Forum',
//     caption: 'forum.quasar.dev',
//     icon: 'record_voice_over',
//     link: 'https://forum.quasar.dev',
//   },
//   {
//     title: 'Twitter',
//     caption: '@quasarframework',
//     icon: 'rss_feed',
//     link: 'https://twitter.quasar.dev',
//   },
//   {
//     title: 'Facebook',
//     caption: '@QuasarFramework',
//     icon: 'public',
//     link: 'https://facebook.quasar.dev',
//   },
//   {
//     title: 'Quasar Awesome',
//     caption: 'Community Quasar projects',
//     icon: 'favorite',
//     link: 'https://awesome.quasar.dev',
//   },
// ];

export default defineComponent({
  name: 'MainLayout',

  components: {
    // EssentialLink,
  },

  setup() {
    // const $q = useQuasar();
    // const leftDrawerOpen = ref(false);

    const session = useSessionStore();

    function minimize() {
      if (process.env.MODE === 'electron') {
        window.ipcRenderer.send('min');
      }
    }

    function maximize() {
      if (process.env.MODE === 'electron') {
        window.ipcRenderer.send('max');
      }
    }

    function closeApp() {
      if (process.env.MODE === 'electron') {
        window.ipcRenderer.send('exit');
      }
    }

    function logOut() {
      session.clearToken();
    }

    return {
    //   essentialLinks: linksList,
    //   leftDrawerOpen,
    //   toggleLeftDrawer() {
    //     leftDrawerOpen.value = !leftDrawerOpen.value;
    //   },
      maximize,
      minimize,
      closeApp,
      logOut,
    };
  },
});
</script>
