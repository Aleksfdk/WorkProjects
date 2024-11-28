<template>
  <transition name="fade">
    <div class="menu-panel" v-show="isVisible">
      <div class="menu-header">
        <img src="../../../../public/img/agropolia.svg" alt="agropolia" width="200"/>
        <button-round-group :type="'round-arrow-back'"></button-round-group>
      </div>
      <div class="auth-user">
        <div class="auth-user__avatar">
          <v-icon name="fa-user-alt" fill="#3360F4"/>
        </div>
        <div>
          <p class="auth-user__title">{{ profile.last_name }}</p>
<!--          <p class="auth-user__title">{{ roles[profile.role] }}</p>-->
        </div>
      </div>
      <ul class="list-pages">
        <li class="list-pages__item active-item" @click="$router.push('/')">
          <!--				<v-icon name="co-hackhands" fill="#6D7188" />-->
          <v-icon name="co-hackhands" fill="#6D7188"/>
          <p class="list-pages__title">Цифровой паспорт животного</p>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import './style.scss';
import './media.scss';
import {mapActions, mapState} from "vuex";

export default {
  name: 'MenuPanel',
  data() {
    return {
      isVisible: true,
      roles: {
        sh: 'СХип',
        msh: 'МХИП',
        ush: 'УСХиП'
      }
    };
  },
  computed: {
    ...mapState({
      profile: state => state.auth.profile,
    })
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    ...mapActions({
      getProfile: 'getProfile',
    })
  }
};
</script>

<style scoped></style>
