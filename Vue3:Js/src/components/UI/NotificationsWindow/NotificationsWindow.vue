<template>
<div class="notifications-window">
  <notifications />
</div>
</template>

<script>
export default {
  name: "NotificationsWindow",
  data() {
    return {
      isView: false,
    }
  }
}
</script>

<style scoped>
.vue-notification-group {
  height: auto!important;
}
</style>