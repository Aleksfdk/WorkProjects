<template>
	<LoadingPanel />
	<notifications-window />
	<div id="app">
		<router-view />
	</div>
</template>

<script>
import LoadingPanel from '@/components/UI/LoadingPanel/LoadingPanel.vue';
import NotificationsWindow from '@/components/UI/NotificationsWindow/NotificationsWindow.vue';
import './style.css';
export default {
	name: 'App',
  components: {
		LoadingPanel,
		NotificationsWindow,
	},
};
</script>

<style scoped></style>
