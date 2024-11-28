<template>
  <div class="input-date" :class="{ 'input-width': width !== '', 'error': error }">
    <v-date-picker mode="date" v-model="value" :min-date='minDate' :max-date="maxDate !== '' && maxDate"
                   class="inline-block h-full">
      <template #default="{ inputValue, togglePopover }">
        <div class="flex items-center" :class="{ 'input-width': width !== '' }">
          <input
              :data-dataType="'date'"
              :value="!isEmpty && value !== '' ? (typeof value === 'object' ? formatDate(value) : value) : (!isEmpty ? formatDate(inputValue) : '')"
              :name="name"
              :data-isRequired="isRequired"
              class="size-small"
              :class="{ 'input-width': width !== '', 'input-height': height !== '' }"
              readonly
              :data-isValid="!error"
              @click.stop="togglePopover"
          />
          <button class="calendar-btn" @click.stop="(e) => handleClick(e, togglePopover)">
            <!--					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-4 h-4 fill-current">-->
            <!--						<path-->
            <!--							d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"-->
            <!--						></path>-->
            <!--					</svg>-->
            <img src="/img/Calendar.svg" alt=""/>
          </button>
        </div>
      </template>
    </v-date-picker>
    <p v-if="error && errorText" class="error-text">{{ errorText }}</p>
  </div>
</template>

<script>
import './style.scss';
import moment from 'moment';
import {getCurrentInstance} from 'vue';

export default {
  name: 'InputDate',
  props: {
    width: {
      type: [String, Number],
      default: '',
      inputSize: 0,
    },
    height: {
      type: [String, Number],
      default: '',
    },
    val: {
      type: [String, Number],
      default: '',
    },
    topSvg: {
      type: String,
      default: '12px',
    },
    name: {
      type: String,
      default: '',
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    minDate: {
      type: [Date, String, Number],
      default: '',
    },
    maxDate: {
      type: [Date, String, Number],
      default: '',
    },
    onChange: {
      type: Function,
      default: () => false
    },
    defaultEmpty: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: '',
      error: false,
      errorText: '',
      isEmpty: false
    };
  },
  computed: {
    watchInputSize() {
      return this.inputSize;
    },
    dateModel() {
      if (this.isEmpty) return null;
      let date = moment().format('YYYY-MM-DD');
      if (this.val !== '') {
        date = this.val;
      }
      const resultDate = this.formatDate(date);
      this.onChange(resultDate);
      return resultDate;
    }
  },
  watch: {
    value(newValue, prevValue) {
      if (moment(newValue) > moment(this.maxDate).add(1, 'days') || moment(newValue) < moment(this.minDate).subtract(1, 'days')) {
        this.showError('Некорректная дата');
      }
      if (newValue !== prevValue) {
        if (newValue === null) {
          this.showError('Выберите дату');
        } else {
          if ((this.maxDate && this.minDate && moment(newValue) < moment(this.maxDate).add(1, 'days') && moment(newValue) > moment(this.minDate).subtract(1, 'days'))
              || (this.maxDate && !this.minDate && moment(newValue) < moment(this.maxDate).add(1, 'days'))
              || (this.minDate && !this.maxDate && moment(newValue) > moment(this.minDate).subtract(1, 'days'))
          ) {
            this.hideError();
          }
          const newDate = this.formatDate(newValue);
          this.onChange(newDate);
        }
      }
    },
    maxDate(newValue) {
      if (moment(this.value) > moment(newValue).add(1, 'days') || moment(this.value) < moment(this.minDate).subtract(1, 'days')) {
        this.showError('Некорректная дата');
        this.value = 'Invalid date';
      } else {
        if (this.isEmpty || (this.value && this.value !== 'Invalid date')) {
          this.hideError();
        }
      }
    },
    minDate: {
      immediate: true,
			handler(newValue) {
        if (moment(this.value).isBefore(moment(newValue))) {
          this.showError('Некорректная дата');
          this.value = 'Invalid date';
        } else {
          if (this.isEmpty || (this.value && this.value !== 'Invalid date')) {
            this.hideError();
          }
        }
      }
    },
    defaultEmpty: {
      immediate: true,
			handler(newValue, prevValue) {
				if (newValue !== prevValue) {
					this.isEmpty = this.defaultEmpty;
				}
			},
    }
  },
  mounted() {
    if (this.width?.indexOf('%') !== -1) {
      this.inputSize = this.width;
    } else {
      const size = getCurrentInstance().subTree.children[1].el.clientWidth;
      this.inputSize = size;
    }
    this.value = this.dateModel;
  },
  methods: {
    formatDate(inputValue) {
      if (typeof inputValue === 'object' || inputValue?.indexOf('-') !== -1) {
        return moment(inputValue).format('YYYY-MM-DD');
      } else {
        return moment(inputValue, 'DD.MM.YYYY').format('YYYY-MM-DD')
      }
    },
    handleClick(e, togglePopover) {
      e.preventDefault();
      togglePopover();
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
      this.$emit('updateFormErrors', {[name]: error});
    }
  },
};
</script>

<style scoped>
.input-date {
  position: relative;
  width: v-bind(watchInputSize+ 'px');
  height: v-bind(height);
}

.input-width {
  width: v-bind(width) !important;
}

.input-height {
  height: v-bind(height) !important;
}

.calendar-btn {
  position: absolute;
  right: 10px;
  top: v-bind(topSvg) !important;
  background: none;
  outline: none;
  border: none;
}

.calendar-btn:hover {
  cursor: pointer;
}
</style>
