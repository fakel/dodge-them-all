<template>
<div
    class="q-pa-md row items-center justify-center q-gutter-md"
    style="height: 90vh"
    @keyup.enter="login">
   <q-card>
      <q-card-section class="bg-grey-8 text-white">
        <div
            class="text-h6"
            style="text-align: center;"
        >
            Login
        </div>
      </q-card-section>

        <q-separator dark inset />

        <q-card-section>
            <div class="row items-center justify-center">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <q-input
                    v-model="email"
                    label="Email/Username"
                    type="email"
                    class="q-ma-sm"
                    required
                />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <q-input
                    v-model="password"
                    label="Password"
                    type="password"
                    class="q-ma-sm"
                    required
                />
            </div>
        </div>
        </q-card-section>

      <q-card-actions vertical align="center">
        <q-btn flat @click="login">Login</q-btn>
      <a @click="toRegister">Register</a>
      </q-card-actions>
    </q-card>
</div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../boot/axios';
import { useSessionStore } from '../stores/session';

export default {
  // name: 'PageName',
  setup() {
    const { push } = useRouter();

    const session = useSessionStore();
    const email = ref('');
    const password = ref('');

    function login() {
      if (!email.value || !password.value) {
        return;
      }
      api.post('/login', {
        email: email.value,
        username: email.value,
        password: password.value,
      }).then((res) => {
        const token = res.data.Authorization;
        session.saveToken(token);
      }).catch((err) => {
        console.log(err);
        alert('Login failed');
      });
    }

    function toRegister() {
      push('/signUp');
    }
    return {
      login,
      toRegister,
      email,
      password,
    };
  },
};
</script>
