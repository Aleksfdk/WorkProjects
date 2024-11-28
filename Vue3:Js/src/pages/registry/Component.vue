<template>
	<div class="components">
		<menu-panel />
		<div class="page-content">
			<panel-header />
			<page-content />
		</div>
	</div>
</template>

<script>
import MenuPanel from '@/components/UI/MenuPanel/MenuPanel.vue';
import PageContent from './Registry.vue';
import '../style.scss';
import '../media.scss';

export default {
	name: 'Component',
	components: { MenuPanel, PageContent },
};
</script>

<style scoped></style>
