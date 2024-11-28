<template>
	<div class="tabs-panel-wrapper">
		<ul v-if="checkVisible" class="tabs-panel" :class="{ 'tabs-panel__second-level': level }">
			<li
				v-for="(tab, index) in tabs"
        v-show="tabView[tab.props.name]"
				:key="tab.props.title"
				class="tab-item"
				:class="{
					'active-tab': !level && selectedIndex === index,
					'second-level-tab': level,
					'active-tab-second': level && selectedIndex === index,
				}"
				@click="selectTab(index)"
			>
				<p class="tabs-panel__title">{{ tab.props.title }}</p>
			</li>
		</ul>
		<ul v-else class="tabs-panel" :class="{ 'tabs-panel__second-level': level }">
			<li
				v-for="(tab, index) in tabs"
				:key="tab.title"
				class="tab-item"
				:class="{
					'active-tab': !level && selectedIndex === index,
					'second-level-tab': level,
					'active-tab-second': level && selectedIndex === index,
				}"
				@click="selectTab(index)"
			>
				<p class="tabs-panel__title">{{ tab.props.title }}</p>
			</li>
		</ul>
		<slot></slot>
	</div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import './style.scss';

export default {
	name: 'TabsPanel',
	props: {
		handleClick: {
			type: Function,
			default: () => true,
		},
		level: {
			type: Boolean,
			default: false,
		},
    checkVisible: {
			type: Boolean,
			default: false,
		},
    tabView: {
      type: String,
      default: '1.1',
    },
	},
	data() {
		return {
			selectedIndex: 0,
			tabs: [],
			keys: [],
			viewList: [],
		};
	},
	mounted() {
		const children = getCurrentInstance().subTree.children;
		this.tabs = children[1].children;
		// this.tabs.map((item, index) => (index === 0 ? this.keys.push(true) : this.keys.push(false)));
		this.selectTab(0);
	},
	methods: {
		selectTab(i) {
			this.handleClick(i);

			this.selectedIndex = i;
			this.tabs.forEach((tab, index) => {
				tab.props.active = index === i;
			});
		},
		// onGetTabView(title) {
		// 	const value = this.tabShow.type + '.' + this.tabShow.gender_group;
		// 	this.animalType[value].map((item) => {
    //     console.log('item', item);
    //     console.log('title', title);
		// 		if (item == title) {
		// 			return true;
    //       }
		// 	});
		// },
	},
};
</script>

<style scoped></style>
