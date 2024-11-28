<template>
	<div class="checkbox-group">
		<input :checked="checked" class="checkbox" type="checkbox" readonly @change="onChangeCheckbox" />
		<p @click="onHandleClick" v-data-title class="checkbox-group__title">
			<slot></slot>
		</p>
	</div>
</template>

<script>
import './style.scss';

export default {
	name: 'CheckboxGroup',
	props: {
		checked: {
			type: Boolean,
			default: false,
		},
		onChange: {
			type: Function,
			default: () => null,
		},
    handleClick: {
			type: Function,
			default: () => null,
		},
	},
	methods: {
		onChangeCheckbox(e) {
			this.onChange( e.target.checked);
		},
    onHandleClick() {
      this.handleClick();
    }
	},
};
</script>

<style scoped></style>
