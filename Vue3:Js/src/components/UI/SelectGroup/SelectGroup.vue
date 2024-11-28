<template>
	<div v-click-out-side="hide" class="select-group" :class="{ 'input-width': width !== '', error: error }">
		<!--    <select class="size-small">-->
		<!--      <option v-for="option in options" value="{{option.value}}" :key="option.value">{{option.name}}</option>-->
		<!--    </select>-->
		<!--		<div class="select-group__input">-->
		<!--    <div class="select-options__dropdown"></div>-->
		<input
			:id="valueId !== '' ? valueId : val.id"
			:name="name"
			:placeholder="placeholder"
			:data-isRequired="isRequired"
			class="size-small"
			:class="{ 'input-width': width !== '', 'input-height': height !== '' }"
			:value="value !== '' ? value : val.name"
			readonly
			:data-isValid="!error"
			@click="handleClickInput"
		/>
		<v-icon
			:class="{
				'select-active': isSelectActive,
			}"
			class="arrow__small"
			name="md-keyboardarrowdown-round"
			fill="#6D7188"
			@click="handleClickInput"
		/>
		<p v-if="error && errorText" class="error-text">{{ errorText }}</p>
		<div v-if="searchList" class="select-group__search-block">
			<transition name="fade">
				<div v-show="isVisible" class="select-options__search">
					<input-group
						class="select-group__search-input"
						:width="'440px'"
            :on-change="(data) => onSearchValue(data)"
						:type="'search'"
						:placeholder="'Поиск'"
						size="small"
					/>
					<ul class="select-options__list">
						<li
							v-for="option in optionsData"
							:id="option.id"
							:key="option.id"
							:class="{
								'option-select': option.isActive,
							}"
							:value="option.id"
							@click="onSelectOption(option)"
						>
							{{ option.name }}
						</li>
					</ul>
					<div class="select-group__footer">
            <div class="select-group__count-list">
              <p>Количество: {{total}}</p>
            </div>
						<div class="select-group__pagination">
							<div class="select-group__pagination-prev" @click="onPaginationPrev">
								<v-icon name="md-arrowbackios-round" fill="#3360F4" />
							</div>
							<div class="select-group__pagination-list">
								<div
									v-for="(item, index) in pages"
									:key="index + 1"
									class="select-group__pagination-item"
									:class="{ 'select-group__pagination-active': paginationActive == item }"
									@click="() => onPaginationPage(item)"
								>
									{{ item }}
								</div>
							</div>
							<div class="select-group__pagination-next" @click="onPaginationNext">
								<v-icon class="arrow-next" name="md-arrowbackios-round" fill="#3360F4" />
							</div>
						</div>
					</div>
				</div>
			</transition>
		</div>
		<div v-else>
			<transition v-if="!subTitle.visible && !isDisabled" name="fade">
				<ul v-show="isVisible" class="select-options">
					<li
						v-for="option in optionsData"
						:id="option.id"
						:key="option.id"
						:class="{
							'option-select': option.isActive,
						}"
						:value="option.id"
						@click="onSelectOption(option)"
					>
						{{ option.name }}
					</li>
				</ul>
			</transition>
			<transition v-else-if="subTitle.visible && !isDisabled" name="fade">
				<ul v-show="isVisible" class="select-options">
					<li
						v-for="option in optionsData"
						:id="option.id"
						:key="option.id"
						:class="{
							'option-select': option.isActive,
						}"
						:value="option.id"
						@click="onSelectOption(option)"
					>
						<div class="select-options__block">
							<p class="select-options__title">{{ option.name }}</p>
							<p class="select-options__subtitle">ИНН {{ option[subTitle.title] }}</p>
						</div>
					</li>
				</ul>
			</transition>
			<transition v-else name="fade">
				<div v-if="isDisabled" v-show="isVisible" class="select-options disabled-text">{{ disabledText }}</div>
			</transition>
		</div>
	</div>
	<!--	</div>-->
</template>

<script>
import './style.scss';
import clickOutSide from '@mahdikhashan/vue3-click-outside';

export default {
	name: 'SelectGroup',
	directives: {
		clickOutSide,
	},
	props: {
		width: {
			type: String,
			default: '298px',
		},
		height: {
			type: [String, Number],
			default: '',
		},
		topSvg: {
			type: [String, Number],
			default: '13px',
		},
		val: {
			type: [String, Number, Object],
			default: '',
		},
		valId: {
			type: Number,
			default: 0,
		},
		name: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: 'Выберите из списка',
		},
		options: {
			type: Array,
			required: true,
		},
		pages: {
			type: Number,
			default: 1,
		},
		default: {
			type: [String, Number],
			default: '',
		},
    total: {
      type: [Number, String],
      default: 1,
    },
		isRequired: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: 'default',
		},
		onChange: {
			type: Function,
			default: () => null,
		},
    onSearch: {
      type: Function,
      default: () => null,
    },
		isCheckDefault: {
			type: Boolean,
			default: false,
		},
		subTitle: {
			type: Object,
			default: new Object({ visible: false, title: '' }),
		},
		onPagination: {
			type: Function,
			default: () => null,
		},
		perPage: {
			type: Function,
			default: () => true,
		},
		searchList: {
			type: Boolean,
			default: false,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		disabledText: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			optionsState: [],
			isVisible: false,
			valueId: '',
			isSelectActive: false,
			value: '',
			error: false,
			errorText: '',
			paginationActive: 1,
		};
	},
	computed: {
		optionsData() {
			return this.options;
		},
	},
	watch: {
		value(newValue) {
			this.isCheckDefault && this.checkDefault(newValue);
			this.optionsState.map((item) => {
				if (item.name == newValue) {
					item.isActive = true;
				} else {
					item.isActive = false;
				}
			});
		},
		isCheckDefault: {
			immediate: true,
			handler() {
				this.isCheckDefault && this.checkDefault(this.val);
			},
		},
	},
	mounted() {
		this.value = this.default;
		this.valueId = this.valId > 0 && this.valId;
    if(this.searchList) {
      this.value = this.val.name;
    }
		this.options.map((item) => {
			item.isActive = false;
			this.optionsState.push(item);
		});
	},
	methods: {
		onPaginationPage(value) {
			if (this.paginationActive !== value) {
				this.paginationActive = value;
				this.onPagination(value);
			}
		},
		onPaginationPrev() {
			if (this.paginationActive !== 1) {
				this.paginationActive = this.paginationActive - 1;
				this.onPagination(this.paginationActive);
			}
		},
		onPaginationNext() {
			if (this.paginationActive !== this.pages) {
				this.paginationActive = this.paginationActive + 1;
				this.onPagination(this.paginationActive);
			}
		},
    onSearchValue(value) {
      if(value) {
        this.onSearch(value);
      } else {
        this.onPagination(1);
      }
    },
		handleClickInput() {
			this.isVisible = !this.isVisible;
			this.isSelectActive = !this.isSelectActive;
		},
		hide(e) {
			if (e.target.nodeName !== 'path') {
				this.isVisible = false;
				this.isSelectActive = false;
				if (e.target.className === 'tabs-panel__title') {
					if (!this.val) this.onChange('');
					this.hideError();
					this.$emit('cancelEdit');
				}
			}
		},
		checkDefault(value) {
			if (this.isRequired && !value) {
				this.showError('Поле является обязательным');
			} else {
				this.hideError();
			}
		},
		onSelectOption(option) {
			// const data = this.optionsState;
			// data.map(item => {
			//   if(option.value == item.value) {
			//     item.isActive = true;
			//   }
			//   return item.isActive = false;
			// })
			// this.optionsState = data;
			this.onChange({ id: option.id, name: option.name });
			this.valueId = option.id;
			this.value = option.name;
			this.isVisible = false;
			this.isSelectActive = false;
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
		updateFormErrors(name, error) {
			this.$emit('updateFormErrors', { [name]: error });
		},
	},
};
</script>

<style scoped>
.input-width {
	width: v-bind(width) !important;
}

.input-height {
	height: v-bind(height) !important;
}

.arrow__small {
	float: right;
	position: absolute;
	transition: 0.3s all;
	top: v-bind(topSvg) !important;
	right: 14px;
	touch-action: manipulation;
}

.close-round__small:hover {
	cursor: pointer;
}
</style>
