<template>
  <el-tree
    ref="tree"
    :data="data"
    :props="defaultProps"
    show-checkbox
    :node-key="nodeKey"
    :default-expand-all="defaultExpandAll"
    :default-checked-keys="defaultCheckedKeys"
    :indent="16"
    :check-strictly="checkStrictly"
    :empty-text="'Нет данных'"
    @check-change="() => getCheckedKeys()"
  >
    <template #default="{ node }">
      <element-tree-line :node="node" :show-label-line="false" />
    </template>
  </el-tree>
</template>

<script>
import { h } from 'vue';
import { getElementLabelLine } from 'element-tree-line';
import { ElTree } from 'element-plus';
import 'element-plus/es/components/tree/style/css';
import 'element-tree-line/dist/style.css';
import './style.scss';

export default {
  name: 'TreePanel',
  components: { ElTree, ElementTreeLine: getElementLabelLine(h) },
  props: {
    dataValue: {
      type: Array,
      default: () => [],
    },
    nodeKey: {
      type: String,
      default: 'id',
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => [],
    },
    // false - при выборе родительского автоматически выбираются дочерние,
    // но если снять все дочерние, родительский тоже очищается
    // true - нужно протыкивать конкретно каждый чекбокс,
    // ничего автоматически не подставляется и не убирается
    // ни у дочерних, ни у родительских
    checkStrictly: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        value: this.nodeKey
      },
    };
  },
  watch: {
    dataValue: {
      immediate: true,
      handler() {
        this.data = this.dataValue;
      }
    },
  },
  methods: {
    getCheckedKeys() {
      const keys = this.$refs.tree.getCheckedNodes(false, true)?.map(item => item?.[this.nodeKey]);
      const checkedKeys = keys?.length > 0 ? [...keys] : [];
      this.$emit('updateCheckedKeys', checkedKeys);
    },
  }
};
</script>

<style scoped></style>
