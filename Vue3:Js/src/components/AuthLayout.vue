<template>
	<slot></slot>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import axios from 'axios';

export default {
	name: 'AuthLayout',
	computed: {
		...mapState({
			profile: (state) => state.auth.profile,
      isAuth: (state) => state.auth.isAuth,
		}),
	},
  mounted() {
      const token = localStorage.getItem('token');
      this.onGetProfile(token);
  },
	methods: {
		...mapActions({
			getProfile: 'getProfile',
		}),
    async onGetProfile(token) {
      await axios.get('https://dap.stageogip.ru/api/user/me', {
        headers: {
          "Authorization": token,
          "Content-type": "application/json"
        },
      });
      // else {
      //   window.location.href = "https://agropoliya.ru/oauth/authorize?client_id=41&response_type=code&scope=*";
      // }
    },
    onFuncSuccess() {
      this.$router.push('/');
    },
    onFuncError() {
      window.location.href = "https://agropoliya.ru/oauth/authorize?client_id=41&response_type=code&scope=*";
    },
	},
};
</script>

<style scoped></style>
