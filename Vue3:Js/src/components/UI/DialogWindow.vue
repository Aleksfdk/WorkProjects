<template>
  <div v-if="show" @click.stop="onHideModal" class="dialog-content">
    <div @click.stop class="dialog">
      <p>Modal Window</p>
      <slot></slot>
      <input />
    </div>
  </div>
</template>

<script>

export default {
  name: "DialogWindow",
  props: {
    show: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    onHideModal() {
      this.$emit('update:show', false);
    }
  }
}
</script>

<style scoped>
.dialog {
  display: block;
  margin: 0 auto;
  background: #bfbfbf;
  width: 300px;
  height: 200px;
}
</style>