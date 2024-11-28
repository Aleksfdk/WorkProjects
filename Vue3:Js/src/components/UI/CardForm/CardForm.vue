<template>
  <div class="card-form">
    <h3 class="card-form__title">
        {{ title }}
      <span v-show="showBtns" class="card-form__actions-item">
        <img
          v-show="hasDelete && !isViewEdit && profile.role == 'sh' && !edit"
          class="registry-detailed__icons"
          src="../../../../public/img/icon-delete.png"
          alt="delete"
          @click="onDelete"
        />
        <v-icon
          v-show="edit"
          class="action-icon_pr"
          width="25"
          height="25"
          name="io-close"
          fill="#3360F4"
          @click="onCancel"
        />
        <img
          v-show="!isViewEdit && profile.role == 'sh' && !edit"
          class="registry-detailed__icons"
          src="../../../../public/img/icon-edit.png"
          alt="edit"
          @click="onEditClick"
        />
        <v-icon
          v-show="edit"
          class="action-icon_pr"
          width="25"
          height="25"
          name="hi-solid-check"
          fill="#3360F4"
          @click="onSave"
        />
      </span>
      <span v-show="!showBtns" class="card-form__hint">{{ noBtnsText }}</span>
    </h3>
    <slot></slot>
  </div>
</template>

<script>
import "./style.scss";
import "./media.scss";
import {mapState} from "vuex";

export default {
  name: "CardForm",
  props: {
    title: {
      type: String,
      default: '',
    },
    showBtns: {
      type: Boolean,
      default: true
    },
    hasDelete: {
      type: Boolean,
      default: false
    },
    noBtnsText: {
      type: String,
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    },
    isViewEdit: {
      type: Boolean,
      default: false
    },
    onCancel: {
      type: Function,
      default: () => false
    },
    onSave: {
      type: Function,
      default: () => false
    },
    onDelete: {
      type: Function,
      default: () => false
    }
  },
  computed: {
    ...mapState({
      profile: state => state.auth.profile,
    })
  },
  methods: {
    onEditClick() {
      this.$emit('toggleEdit', !this.edit)
		},
	},
}
</script>

<style scoped></style>