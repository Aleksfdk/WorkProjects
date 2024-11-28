<template>
<div class="form-item" :data-required="required" :data-set="setFiled">
  <p><slot></slot></p>
  <span v-show="required">*</span>
</div>
</template>

<script>
import "./style.scss"

export default {
  name: "FormItem",
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    setFiled: {
      type: Boolean,
      default: true,
    }
  }
}
</script>

<style scoped>

</style>