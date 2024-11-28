<template>
	<div v-if="size === 'small'" v-click-out-side="hide" :class="[`input-group ${error ? 'error' : ''}`]">
		<div class="input-search">
			<v-icon v-show="type === 'search'" name="ri-search-line" fill="#A0A3B6" />
		</div>
		<div
			class="input-group__input-custom input-group__custom-small"
			:class="{ 'input-width': width !== '', 'input-height': height !== '' }"
		>
			<input
				ref="inputGroup"
				:value="value"
				:name="name"
				:data-isRequired="isRequired"
				class="size-small"
				:placeholder="placeholder"
				:type="type"
				:min="min"
				:max="max"
				:step="step"
				:minlength="minlength"
				:maxlength="maxlength"
				:disabled="isDisabled"
				:class="{
					'input-search__pl': type == 'search',
					'input-width': width !== '',
					'input-height': height !== '',
				}"
				:data-isValid="!error"
				@change="getInputValue"
				@input="getInputValue"
				@click="handleClickInput"
				@keydown="onValidateField"
			/>
			<v-icon
				v-show="isVisibleClose"
				class="close-round__small"
				name="md-close-round"
				fill="#6D7188"
				@click="onCancelFocus"
			/>
		</div>
		<p v-if="error && errorText" class="error-text">{{ errorText }}</p>
	</div>
	<div v-else-if="size === 'big'" v-click-out-side="hide" class="input-group">
		<div
			class="input-group__input-custom input-group__custom-big"
			:class="{ 'input-width': width !== '', 'input-height': height !== '' }"
		>
			<input
				ref="inputGroup"
				:name="name"
				:value="value"
				:data-isRequired="isRequired"
				class="size-big"
				:class="{
					'input-search__pl': type === 'search',
					'input-width': width !== '',
					'input-height': height !== '',
				}"
				:placeholder="placeholder"
				:type="type"
				:min="min"
				:max="max"
				:step="step"
				:minlength="minlength"
				:maxlength="maxlength"
				:data-isValid="!error"
				@change="getInputValue"
				@input="getInputValue"
				@click="handleClickInput"
				@keydown="onValidateField"
			/>
			<v-icon
				v-show="isVisibleClose"
				class="close-round__big"
				name="md-close-round"
				fill="#6D7188"
				@click="onCancelFocus"
			/>
		</div>
		<p v-if="error && errorText" class="error-text">{{ errorText }}</p>
	</div>
</template>

<script>
import './style.scss';
import clickOutSide from '@mahdikhashan/vue3-click-outside';
import { getCurrentInstance } from 'vue';

const isRequiredErr = 'Поле является обязательным';
const isNaNErr = 'Введите число';
const formatErr = 'Ошибка формата';
const nationalIdReg = /^(?=.*[!@#$%^&(),.+=/\\/\][{}?><":;|])/;
const isIntegerErr = 'Введите целое число';

export default {
	name: 'InputGroup',
	directives: {
		clickOutSide,
	},
	props: {
		size: {
			type: String,
			default: 'small',
		},
		name: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: 'Введите текст',
		},
		type: {
			type: String,
			default: 'text',
		},
		min: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: undefined,
		},
		minlength: {
			type: Number,
			default: 0,
		},
		maxlength: {
			type: Number,
			default: 2000,
		},
		width: {
			type: [String, Number],
			default: '',
		},
		height: {
			type: [String, Number],
			default: '',
		},
		val: {
			type: [String, Number],
			default: '',
		},
		onChange: {
			type: Function,
			default: () => null,
		},
		isRequired: {
			type: Boolean,
			default: false,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		errorPosition: {
			type: String,
			default: 'absolute',
		},
		isCheckDefault: {
			type: Boolean,
			default: false,
		},
		isHighlight: {
			type: Boolean,
			default: false,
		},
		staticErrorMargin: {
			type: Number,
			default: 10,
		},
		step: {
			type: [Number, String],
			default: 'any',
		},
	},
	data() {
		return {
			value: '',
			isVisibleClose: false,
			inputSize: 0,
			inputHeight: 0,
			error: false,
			errorText: '',
			errorHeight: 0,
		};
	},
	computed: {
		defaultValue() {
			return this.val;
		},
		watchInputSize() {
			return this.inputSize;
		},
		watchInputHeight() {
			return this.inputHeight;
		},
		watchErrorHeight() {
			return this.errorHeight;
		},
	},
	watch: {
		val: {
			immediate: true,
			handler() {
				if (this.val) {
					this.value = this.val;
				}
			},
		},
		isRequired: {
			immediate: true,
			handler() {
				if (!this.value && !this.isRequired) {
					this.hideError();
				}
			},
		},
		isCheckDefault: {
			immediate: true,
			handler() {
				this.isCheckDefault && this.checkDefault(this.value);
			},
		},
		// Кастомно подсветить инпут
		isHighlight: {
			immediate: true,
			handler() {
				this.isHighlight && this.checkDefault(this.value);
			},
		},
	},
	mounted() {
		if (this.width?.indexOf('%') !== -1 ) {
			this.inputSize = this.width;
		} else {
			const size = getCurrentInstance().subTree.children[1].el.clientWidth;
			this.inputSize = size;
		}
		const sizeHeight = getCurrentInstance().subTree.children[1].el.clientHeight;
		this.inputHeight = sizeHeight;
	},
	updated() {
		if (this.error && this.errorText && this.errorPosition === 'static') {
			const sizeHeight = getCurrentInstance().subTree.children[2].el.clientHeight;
			this.errorHeight = sizeHeight + this.staticErrorMargin;
		} else {
			this.errorHeight = 0;
		}
	},
	methods: {
		handleClickInput() {
			this.isVisibleClose = true;
		},
		hide(e) {
			if (e.target.nodeName !== 'path') {
				this.isVisibleClose = false;
				if (e.target.className === 'tabs-panel__title') {
					if (!this.val) this.onChange('');
					this.hideError();
					this.$emit('cancelEdit');
				}
			}
		},
		checkDefault() {
			if (this.isHighlight) {
				this.error = true;
			} else {
				this.getInputValue({ target: { value: this.value } });
				this.errorText = '';
			}
		},
		getInputValue(e) {
			let inputVal = e.target.value;
			if (this.type === 'number' && inputVal) {
				// Проверка на min и max
				if (
					(this.min?.toString()?.length && +inputVal < this.min) ||
					(this.max?.toString()?.length && +inputVal > this.max)
				) {
					this.showError(
						`Значение не должно быть ${this.min ? `меньше ${this.min}` : ''}${
							this.min && this.max ? ` и ` : ''
						}${this.max ? `больше ${this.max}` : ''}`,
					);
				}
				if (+inputVal >= this.min && +inputVal <= this.max) {
					this.hideError();
				}
			}

			// Проверка на длину строки
			if (this.type === 'text') {
				if (inputVal.length < this.minlength) {
					this.showError(`Значение должно содержать не менее ${this.minlength} символов`);
				} else {
					this.hideError();
				}

				if (this.name === 'national_id') {
					const invalidReg = nationalIdReg;
					if (invalidReg.test(inputVal)) {
						this.showError(formatErr);
					} else {
						this.hideError();
					}
				}
			}

			// Проверка на пустое значение и обязательное поле
			if (!inputVal) {
				if (this.isRequired) {
					this.showError(isRequiredErr);
				} else {
					this.hideError();
				}
			}

			// Проверка на лишние начальные нули (~ 000000 => 0)
			if (this.type === 'number' && inputVal?.length > 1) {
				let strValid = Number(inputVal).toString();
				if (typeof this.step === 'number' && Number.isInteger(this.step)) {
					// Проверка на целочисленные значения
					if (inputVal.indexOf(',') !== -1 || inputVal.indexOf('.') !== -1) {
						strValid = Math.trunc(+inputVal).toString();
					}
				}
				this.value = strValid;
				this.onChange(strValid);
			} else {
				this.value = inputVal;
				this.onChange(inputVal);
			}
		},
		showError(text) {
			this.error = true;
			this.errorText = text;
			this.updateFormErrors(this.name, true);
		},
		hideError() {
			this.error = false;
			this.errorText = '';
			this.updateFormErrors(this.name, false);
		},
		onCancelFocus() {
			this.isVisibleClose = true;
			setTimeout(() => this.$refs.inputGroup.focus(), 0.1);
			this.value = '';
			this.onChange('');
			if (!this.isRequired) {
				this.hideError();
			} else {
				this.showError(isRequiredErr);
			}
		},
		onValidateField(e) {
			const validNumberReg = /[0-9.,]/;
			const invalidChars = ['e', 'E', '+', '-'];
			if (this.name === 'national_id') {
				const invalidReg = nationalIdReg;
				if (invalidReg.test(e.key)) {
					e.preventDefault(e);
				}
			}

			if (this.type === 'number') {
				// Проверка на лишние символы
				// + Проверка на длину строки
				if (invalidChars.includes(e.key) || e.target.value.length === this.maxlength) {
					e.preventDefault(e);
					return;
				}
				// Проверка на ввод , и . для целочисленных значений
				if (typeof this.step === 'number' && Number.isInteger(this.step)) {
					const invalidIntegerChars = [',', '.'];
					if (invalidIntegerChars.includes(e.key) || (!validNumberReg.test(e.key) && e.key !== 'Backspace')) {
						e.preventDefault(e);
						return;
					}
				}

				// Проверка на лишние , и .
				if ((e.key === '.' || e.key === ',') &&
					(!this.value || this.value.match(/,/g)?.length >= 1 || this.value.match(/./g)?.length >= 1)) {
						e.preventDefault(e);
						return;
				}

				// Проверка на ввод текстовых символов
				if (!validNumberReg.test(e.key)) {
					if (e.key !== 'Backspace') {
						e.preventDefault(e);
					}
					if (!this.value) {
						if (typeof this.step === 'number' && Number.isInteger(this.step)) {
							this.showError(isIntegerErr);
						} else {
							this.showError(isNaNErr);
						}
					}	
					return;
				} else {
					this.hideError();
				}
			}
		},
		updateFormErrors(name, error) {
			this.$emit('updateFormErrors', { [name]: error });
		},
	},
};
</script>

<style>
.input-group {
	position: relative;
	width: v-bind(watchInputSize + 'px');
	height: v-bind(watchInputHeight + watchErrorHeight + 'px');
}
.input-width {
	width: v-bind(width) !important;
}
.input-height {
	height: v-bind(height) !important;
}
.input-group .error-text {
	width: v-bind(width);
}
</style>
