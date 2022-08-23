<template>
  <router-view />
</template>

<script>
import { defineComponent, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from './stores/session';

export default defineComponent({
  name: 'App',
  setup() {
    const session = useSessionStore();
    const { push } = useRouter();

    watch(() => session.token, () => {
      if (session.token) {
        push('/dashboard');
      } else {
        push('/');
      }
    });

    session.checkToken();

    return {
      push,
    };
  },
});
</script>
