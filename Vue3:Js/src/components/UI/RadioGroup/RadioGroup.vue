<template>
	<div class="radio-group">
		<div
			v-for="(radio, index) in radiosList"
			:key="index + 1"
			class="radio-item"
			:class="{ 'active-tab': selectedIndex === index }"
			@click="selectRadio(index)"
		>
      <input class="radio" type="radio" :checked="radio.props.active" />
      <p>{{radio.props.title}}</p>
		</div>
<!--    <slot></slot>-->
    </div>
</template>

<script>
import './style.scss';
import { getCurrentInstance } from 'vue';

export default {
	name: 'RadioGroup',
  props: {
    handleClick: {
      type: Function,
      default: () => true,
    },
  },
	data() {
		return {
			selectedIndex: 0,
			radios: [],
			keys: [],
		};
	},
  computed: {
    radiosList() {
      return this.radios;
    }
  },
	mounted() {
		const children = getCurrentInstance();
		this.radios = children[1]?.children;
		this.selectRadio(0);
	},
	methods: {
		selectRadio(i) {
      this.handleClick(i);
			this.selectedIndex = i;
			this.radiosList?.forEach((radio, index) => {
				radio.props.active = index === i;
			});
		},
	}
};
</script>

<style scoped></style>
