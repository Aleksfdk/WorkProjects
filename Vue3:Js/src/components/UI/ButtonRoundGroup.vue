<template>
<div v-if="type === 'round-nav'" class="round-nav" @click="click">
  <span class="round-nav__item"/>
  <span class="round-nav__item"/>
  <span class="round-nav__item"/>
</div>
  <div v-else-if="type === 'round-arrow-back'" class="round-arrow-back" @click="click">
    <v-icon name="md-arrowbackios-round" fill="#FFFFFF" />
  </div>
</template>

<script>

export default {
  name: "ButtonRoundGroup",
  props: {
    type: {
      type: String,
      default: 'round-nav',
    },
    click: {
      type: Function,
      default: () => false,
    }
  }
}
</script>

<style scoped>
.round-nav {
  width: 36px;
  height: 36px;
  background-color: #ECF1FF;
  border-radius: 36px;
}

.round-nav__item {
  position: relative;
  top: 18%;
  display: block;
  width: 16px;
  height: 2px;
  background-color: #3360F4;
  margin: 4px auto;
  border-radius: 8px;
  transition: 0.3s all;
}

.round-nav:hover {
  cursor: pointer;
}
.round-nav:hover .round-nav__item {
  background-color: #5B89FF;
  transition: 0.3s all;
}

.round-nav:active .round-nav__item {
  background-color: #1740C8;
  transition: 0.3s all;
}
.round-arrow-back {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background-color: #3360F4;
  border-radius: 36px;
  transition: 0.3s all;
}
.round-arrow-back:hover {
  background-color: #5B89FF;
  transition: 0.3s all;
  cursor: pointer;
}
.round-arrow-back:active {
  background-color: #1740C8;
  transition: 0.3s all;
  cursor: pointer;
}

</style>