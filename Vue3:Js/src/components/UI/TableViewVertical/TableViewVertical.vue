<template>
	<div class="table-view-vertical">
		<table class="table-view-vertical__panel">
			<tbody>
				<div class="table-view-vertical__body">
					<tr>
						<td
							:class="[`table-view-vertical__item table-view-vertical__item_title ${Object.values(editCols).find(Boolean) ? 'editing' : ''}`]"
							:style="{	width: firstColWidth, minWidth: firstColWidth }"
						></td>
						<td
							v-for="(dataCol, ind) in dataTable"
							v-show="edit"
							:key="dataCol.id"
							class="table-view-vertical__item table-view-vertical__actions-item"
							:style="{	width: dataColWidth, minWidth: dataColWidth, textAlign: editCols[dataCol.id] ? 'center' : 'left' }"
						>
							<img
								v-if="!editCols[dataCol.id]"
								v-show="edit && !actionDisabled"
								class="registry-detailed__icons"
								src="../../../../public/img/icon-delete.png"
								alt="delete"
								@click="isModal = dataCol?.id"
							/>
							<v-icon
								v-else
								v-show="edit"
								class="action-icon_pr"
								width="25"
								height="25"
								name="io-close"
								fill="#3360F4"
								@click="onCancelCol(editCols, dataCol.id, ind)"
							/>
							<img
								v-if="!editCols[dataCol.id]"
								v-show="edit && !actionDisabled"
								class="registry-detailed__icons"
								src="../../../../public/img/icon-edit.png"
								alt="delete"
								@click="onChangeEditCol(editCols, dataCol.id)"
							/>
							<v-icon
								v-else
								v-show="edit"
								class="action-icon_pr"
								width="25"
								height="25"
								name="hi-solid-check"
								fill="#3360F4"
								@click="onSaveCol(editCols, dataCol.id, ind)"
							/>
							<modal-window
								v-show="isModal === dataCol?.id"
								:size-small="true"
								:title="`Удаление`"
								:on-submit="() => onDeleteCol(dataCol?.id)"
								@toggle-modal="toggleModal"
							>
								<p>Это действие невозможно будет отменить</p>
							</modal-window>
						</td>
					</tr>
					<tr v-for="(tableCol, /*index*/) in tableCols" :key="tableCol.id" :class="{ 'error': Object.values(formErrors)?.filter(col => col?.[tableCol?.name])?.length > 0 }">
						<td
						  class="table-view-vertical__item table-view-vertical__item_title"
							:class="{ 'editing': Object.values(editCols)?.find(Boolean) }"
							:style="{	width: firstColWidth, minWidth: firstColWidth }"
						>
							{{ tableCol.title }}
						</td>
						<td
							v-for="(dataCol, ind) in dataTable" :key="dataCol.id"
							class="table-view-vertical__item"
							:class="{ 'editing': editCols[dataCol.id] }"
							:style="{	width: dataColWidth, minWidth: dataColWidth }"
						>

							<span v-if="!editCols[dataCol.id] && tableCol.type !== 'boolean'" v-data-title>
								{{ dataCol[tableCol.name] || '—' }}
							</span>

							<span v-if="!editCols[dataCol.id] && tableCol.type === 'boolean' && booleanMode === 'text'">
								{{ dataCol[tableCol.name] ? 'да' : 'нет' }}
							</span>

							<checkbox-group
								v-if="!editCols[dataCol.id] && tableCol.type === 'boolean' && booleanMode === 'checkbox'"
								:style="{ justifyContent: 'flex-start' }"
								:checked="Boolean(dataCol[tableCol.name])"
							/>

							<input-date
								v-if="editCols[dataCol.id] && tableCol?.type === 'date'"
								:width="dataColWidth"
								:height="'32px'"
								:top-svg="'6px'"
								:name="tableCol.name"
								:val="dataCol[tableCol.name]"
								:is-required="tableCol?.required"
								:min-date="tableCol?.minDate"
								:max-date="tableCol?.maxDate"
								:on-change="(value) => onEditCol(value, tableCol.name, ind)"
								:on-clear="() => true"
								size="small"
								:error-position="'static'"
								@update-form-errors="updateFormErrors"
								@cancel-edit="onCancelCol(editCols, dataCol.id, ind)"
							/>

							<input-group
								v-if="editCols[dataCol.id] && tableCol.type !== 'boolean' && tableCol?.type !== 'date'"
								:width="dataColWidth"
								:height="'32px'"
								:name="tableCol.name"
								:placeholder="tableCol?.formula ? 'Авторасчёт' : undefined"
								:val="(!tableCol?.formula && dataCol[tableCol.name]) ? dataCol[tableCol.name] : undefined"
								:type="tableCol?.type"
								:is-required="tableCol?.required"
								:is-disabled="tableCol?.disabled"
								:min="tableCol?.min"
								:max="tableCol?.max"
								:minlength="tableCol?.minLength"
								:maxlength="tableCol?.maxLength"
								:on-change="(value) => onEditCol(value, tableCol.name, ind)"
								:on-clear="() => true"
								size="small"
								:error-position="'static'"
								@update-form-errors="updateFormErrors"
								@cancel-edit="onCancelCol(editCols, dataCol.id, ind)"
							/>

							<checkbox-group
								v-if="editCols[dataCol.id] && tableCol.type === 'boolean'"
								:checked="Boolean(dataCol[tableCol.name])"
								:on-change="(value) => onEditCol(+value, tableCol.name, ind)"
							/>
						</td>
					</tr>
					<p v-if="data?.length === 0" class="no-data">Нет данных</p>
				</div>
			</tbody>
		</table>
	</div>
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import './style.scss';

export default {
	name: 'TableViewVertical',
	props: {
		table: {
			type: Function,
			default: () => {},
		},
		data: {
			type: Array,
			default: new Array(),
		},
		firstColWidth: {
			type: String,
			default: '320px',
		},
		dataColWidth: {
			type: String,
			default: '165px'
		},
		edit: {
			type: Boolean,
			default: false,
		},
		// Отображение boolean значений в режиме чтения ( не затрагивает режим редактирования )
		// текст или чекбокс
		booleanMode: {
			type: String,
			default: 'text',
		},
		onChangeCol: {
      type: Function,
      default: () => false,
    },
		onRemoveCol: {
      type: Function,
      default: () => false,
    },
	},
	data() {
		return {
			tableCols: [],
			dataCols: [],
			editCols: {},
			actionDisabled: false,
			formErrors: {},
			isModal: 0,
			copyCol: false,
			changeCol: {},
		};
	},
	computed: {
		rows() {
			return this.table();
		},
		dataTable() {
			const data = this.data?.filter((item) => item.id);
			const setData = () => this.dataCols = data;
      setData();
			const editCols = () => this.data?.map((item) => (this.editCols[item.id] = false));
			editCols();
			return this.dataCols;
		},
	},
	watch: {
		data(newValue, prevValue) {
			if (JSON.stringify(newValue) !== JSON.stringify(prevValue)) {
				this.actionDisabled = false;
			}
		},
		rows(newValue, prevValue) {
			if (JSON.stringify(newValue) !== JSON.stringify(prevValue)) {
				const tableData = newValue;
				this.tableCols = tableData.tables;
			}
		},
	},
	async mounted() {
		await this.updateTable();
	},
	methods: {
		updateTable() {
			const tableData = this.table();
			this.tableCols = tableData.tables;
			this.dataCols = this.data;
		},
		onChangeEditCol(col, id) {
			col[id] = !col[id];
			this.actionDisabled = true;
		},
		onEditCol(value, name, ind) {
			if (!this.copyCol) {
        const data = { ...this.dataCols[ind] };
        this.copyCol = data;
      }
      this.dataCols[ind][name] = value;
      this.changeCol[name] = value;
    },
		async onDeleteCol(id) {
      await this.onRemoveCol(id);
      this.copyCol = false;
    },
		async onSaveCol(col, id, index) {
			const colName = Object.keys(this.editCols).find(key => this.editCols[key]);
			if (this.formErrors[colName] && Object.values(this.formErrors[colName])?.filter(Boolean)?.length > 0) {
				notify({
          text: "Поля заполнены некорректно",
        })
			} else {
				col[id] = !col[id];
				this.actionDisabled = false;
				this.dataCols[index] = { ...this.dataCols[index], ...this.changeCol };
				await this.onChangeCol(id, this.changeCol)
					.then(() => {
						this.copyCol = false;
						this.changeCol = {};
					});
			}
		},
		onCancelCol(col, id, index) {
			col[id] = !col[id];
			this.actionDisabled = false;
      this.dataCols[index] = {...this.dataCols[index], ...this.copyCol} ;
      this.copyCol = false;
      this.changeCol = {};
			this.formErrors = {};
		},
		updateFormErrors(error) {
			const colName = Object.keys(this.editCols).find(key => this.editCols[key]);
			this.formErrors = {
				...this.formErrors,
				[colName]: {
					...this.formErrors[colName],
					...error
				}
			};
		},
		toggleModal(value) {
			this.isModal = value;
		}
	},
};
</script>

<style scoped></style>
