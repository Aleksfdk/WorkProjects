<template>
	<transition name="fade">
		<div v-show="show" class="modal-window">
			<div class="modal-window__section">
				<div class="modal-window__header">
					<p class="modal-window__title">{{ title }}</p>
					<v-icon class="close-round__small" name="md-close-round" fill="#6D7188" @click="onHideModal" />
				</div>
				<div :class="{ 'modal-window__content': !sizeSmall, 'modal-window__content-small': sizeSmall }">
					<slot></slot>
					<div v-show="!btnShow" class="modal-window__footer">
						<button-group :size="'small'" :width="'132px'" type="secondary" @click="onHideModal"
							>Отмена</button-group
						>
						<button-group
							:size="'small'"
							:width="'146px'"
							type="primary"
							@click="onSubmitModal"
							>Применить</button-group
						>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import './style.scss';
import ButtonGroup from '@/components/UI/ButtonGroup.vue';

export default {
	name: 'ModalWindow',
	components: { ButtonGroup },
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		sizeSmall: {
			type: Boolean,
			default: false,
		},
		title: {
			type: [String, Number],
			default: 'Заголовок',
		},
		btnShow: {
			type: Boolean,
			default: false,
		},
		onSubmit: {
			type: Function,
			default: () => null,
		},
	},
	methods: {
		onHideModal() {
			this.$emit('update:show', false);
			this.$emit('toggleModal', false);
		},
		onSubmitModal() {
			this.onSubmit();
			this.onHideModal();
		},
	},
};
</script>

<style scoped></style>
