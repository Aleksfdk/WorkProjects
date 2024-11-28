<template>
	<div class="radio-button">
		<input class="radio" type="radio" readonly :checked="active" @click="(e) => onHandleClick(e)" />
		<p class="radio-group__title">
			<slot></slot>
		</p>
	</div>
</template>

<script>
import './style.scss';

export default {
	name: 'RadioButton',
	props: {
		active: { type: Boolean, default: false },
		onChange: { type: Function, default: () => false },
	},
  methods: {
    onHandleClick(e) {
      this.onChange(e.target.checked);
    }
  }
};
</script>

<style scoped></style>
