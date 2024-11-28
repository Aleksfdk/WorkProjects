<template>
	<div class="panel-header">
		<div class="panel-header__breadCrumbs">
			<div class="panel-header__breadCrumbs-item" v-for="(breadCrumb, index) in $store.state.breadCrumbs.list" :key="breadCrumb.title">
				<p @click="() => onRouteTo(breadCrumb.to)">
					{{ breadCrumb.title }}
				</p>
				<v-icon v-show="(index + 1) !== $store.state.breadCrumbs.list.length" class="arrow-breadCrumbs" name="md-arrowbackios-round" fill="#A0A3B6" />
			</div>
		</div>
		<div class="panel-header__events">
<!--			<v-icon class="notification-icon" name="io-notifications-outline" fill="#242F4B" />-->
			<div class="profile-avatar">
				<!--        <img src="public/img/UserAvatar.jpg" alt="UserAvatar" />-->
				<img src="../../../../public/img/UserAvatar.jpg" alt="UserAvatar" />
			</div>
		</div>
	</div>
</template>

<script>
import './style.scss';

export default {
	name: 'PanelHeader',
	data() {
		return {};
	},
	methods: {
		onRouteTo(link) {
			this.$router.push(link);
		},
	},
};
</script>

<style scoped></style>
