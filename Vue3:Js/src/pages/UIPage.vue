<template>
	<div class="main">
		<h3>Button Group</h3>
		<div class="section">
			<button-group :size="'big'" type="primary" :disabled="false">Primary</button-group>
			<button-group :size="'small'" type="secondary" :disabled="false">Secondary</button-group>
			<button-group :size="'small'" type="ghost" :disabled="false">Ghost</button-group>
			<button-group :size="'big'" type="ghost" :disabled="false">Ghost</button-group>
		</div>

		<h3>ButtonRoundGroup</h3>
		<div class="section">
			<button-round-group :type="'round-nav'"></button-round-group>
			<button-round-group :type="'round-arrow-back'"></button-round-group>
		</div>

		<h3>InputGroup</h3>
		<div class="section">
			<input-group size="small" />
			<input-group size="big" />
		</div>
		<h3>InputDate</h3>
		<div class="section">
			<input-date size="small" />
		</div>
		<h3>CalendarView</h3>
		<h3>SelectGroup</h3>
		<div class="section">
			<select-group
				:options="[
					{ value: 1, name: 'Тестовые 1' },
					{ value: 2, name: 'Тестовые 2' },
					{ value: 3, name: 'Тестовые 3' },
					{ value: 4, name: 'Тестовые 4' },
				]"
			/>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MainPage',
};
</script>

<style scoped>
.section {
	display: flex;
	justify-content: center;
	align-items: center;
}
.main {
	margin: 180px 0;
}
</style>
