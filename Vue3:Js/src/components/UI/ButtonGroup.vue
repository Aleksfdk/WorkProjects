<template>
	<div v-if="type == 'primary'">
		<button
			:class="{
				'btn-primary': !disabled,
				'btn-primary-disabled': disabled,
				'size-btn-small': size === 'small',
				'size-btn-big': size === 'big',
			}"
			:type="submit"
			@click="click"
		>
			<slot></slot>
		</button>
	</div>
	<div v-else-if="type == 'secondary'">
		<button
			:class="{
				'btn-secondary': !disabled,
				'btn-secondary-disabled': disabled,
				'size-btn-small': size === 'small',
				'size-btn-big': size === 'big',
			}"
      :type="submit"
			@click="click"
		>
			<slot></slot>
		</button>
	</div>
	<div v-else-if="type == 'ghost'">
		<button
			:class="{
				'btn-ghost': !disabled,
				'btn-ghost-disabled': ghostDisabled,
				'btn-ghost-disabled__small': ghostDisabledSmall,
				'size-btn-small__ghost': size === 'small',
				'size-btn-big': size === 'big',
			}"
      :type="submit"
			@click="click"
		>
			<slot></slot>
		</button>
	</div>
</template>

<script>
export default {
	name: 'ButtonGroup',
	props: {
		type: {
			type: String,
			default: 'primary',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		size: {
			type: String,
			default: 'big',
		},
		submit: {
			type: String,
			default: 'button',
		},
		width: {
			type: String,
			default: 'auto',
		},
		click: {
			type: Function,
			default: () => false,
		},
	},
	data() {
		return {
			ghostDisabled: false,
			ghostDisabledSmall: false,
		};
	},
	mounted() {
		this.ghostBtnDisabled();
	},
	methods: {
		ghostBtnDisabled() {
			if (this.type === 'ghost') {
				if (this.size === 'small') {
					this.ghostDisabledSmall = this.disabled;
				} else {
					this.ghostDisabled = this.disabled;
				}
			}
		},
	},
};
</script>

<style scoped>
.btn-primary {
	width: v-bind(width);
	border: none;
	background-color: #3360f4;
	border-radius: 8px;
	color: #ffffff;
	padding: 12px 24px;
	transition: 0.3s all;
}

.btn-primary:hover {
	background-color: #5b89ff;
	transition: 0.3s all;
	cursor: pointer;
}

.btn-primary:active {
	background-color: #1740c8;
	transition: 0.3s all;
}

.btn-primary-disabled {
	border: none;
	background-color: #a0a3b6;
	border-radius: 8px;
	color: #ffffff;
	padding: 12px 24px;
	transition: 0.3s all;
}

.btn-secondary {
	width: v-bind(width);
	border: none;
	background-color: #ecf1ff;
	border-radius: 8px;
	color: #3360f4;
	padding: 12px 24px;
	transition: 0.3s all;
}

.btn-secondary:hover {
	background-color: #ecf1ff;
	color: #5b89ff;
	transition: 0.3s all;
	cursor: pointer;
}

.btn-secondary:active {
	background-color: #ecf1ff;
	color: #1740c8;
	transition: 0.3s all;
}

.btn-secondary-disabled {
	border: none;
	background-color: #f0eff4;
	border-radius: 8px;
	color: #a0a3b6;
	padding: 12px 24px;
	transition: 0.3s all;
}

.btn-ghost {
	border: 1px solid #3360f4;
	background-color: #ffffff;
	border-radius: 8px;
	color: #3360f4;
	padding: 12px 24px;
	transition: 0.3s all;
}

.btn-ghost:hover {
	background-color: #3360f4;
	color: #ffffff;
	transition: 0.3s all;
	cursor: pointer;
}

.btn-ghost:active {
	background-color: #1740c8;
	color: #ffffff;
	transition: 0.3s all;
}

.btn-ghost-disabled {
	border: 1px solid #a0a3b6;
	background-color: #ffffff;
	border-radius: 8px;
	color: #a0a3b6;
	padding: 12px 24px;
	transition: 0.3s all;
}

.size-btn-small {
	font-family: Montserrat-Medium, sans-serif;
	font-size: 16px;
	height: 20%;
	margin: 10px 0;
}

.size-btn-big {
	font-family: Montserrat-Bold, sans-serif;
	font-size: 14px;
	width: 320px;
	height: 60px;
	margin: 10px 0;
}

.size-btn-small__ghost {
	font-family: Montserrat-Medium, sans-serif;
	font-size: 16px;
	height: 20%;
	margin: 10px 0;
	background-color: transparent;
	border: none;
}

.size-btn-small__ghost:hover {
	background-color: transparent;
	color: #5b89ff;
	transition: 0.3s all;
	cursor: pointer;
}

.size-btn-small__ghost:active {
	background-color: transparent;
	color: #1740c8;
	transition: 0.3s all;
}

.btn-ghost-disabled__small {
	border: none;
	background-color: transparent;
	border-radius: 8px;
	color: #a0a3b6;
	padding: 12px 24px;
	transition: 0.3s all;
}

.btn-ghost-disabled__small:hover,
.btn-ghost-disabled__small:active {
	border: none;
	background-color: transparent;
	color: #a0a3b6;
	cursor: default;
}
</style>
