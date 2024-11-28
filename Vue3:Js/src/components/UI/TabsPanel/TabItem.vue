<template>
  <div v-if="active" class="tab-item__content">
        <slot></slot>
  </div>
</template>

<script>
import './style.scss';

export default {
  name: 'TabItem',
  props: {
    title: {type: String, default: 'Tab'},
    active: {type: Boolean, default: false},
  },
  // data() {
  //   return {
  //     active: false,
  //   }
  // },
};
</script>

<style scoped></style>
