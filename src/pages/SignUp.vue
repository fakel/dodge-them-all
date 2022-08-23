<template>
<div class="q-pa-md row items-center justify-center q-gutter-md" style="height: 90vh">
   <q-card>
      <q-card-section class="bg-grey-8 text-white">
        <div
            class="text-h6"
            style="text-align: center;"
        >
            SignUp
        </div>
      </q-card-section>

        <q-separator dark inset />

        <q-card-section>
            <div class="row items-center justify-center">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <q-input
                    v-model="email"
                    label="Email"
                    type="email"
                    class="q-ma-sm"
                />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <q-input
                    v-model="username"
                    label="Username"
                    type="text"
                    class="q-ma-sm"
                />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <q-input
                    v-model="password"
                    label="Password"
                    type="password"
                    class="q-ma-sm"
                />
            </div>
        </div>
        </q-card-section>

      <q-card-actions vertical align="center">
        <q-btn flat @click="signUp">SignUp</q-btn>
        <a @click="toLogin">Login</a>
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
    const session = useSessionStore();
    const email = ref('');
    const username = ref('');
    const password = ref('');
    const { push } = useRouter();

    function signUp() {
      api.post('/signup', {
        email: email.value,
        username: username.value,
        password: password.value,
      }).then((res) => {
        const token = res.data.Authorization;
        session.saveToken(token);
      }).catch((err) => {
        console.log(err);
      });
    }

    function toLogin() {
      push('/');
    }
    return {
      signUp,
      toLogin,
      email,
      username,
      password,
    };
  },
};
</script>
