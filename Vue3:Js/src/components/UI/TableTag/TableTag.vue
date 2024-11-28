<template>
	<div class="table-tag">
		<table class="table-tag__panel">
			<thead>
				<tr>
					<th
						v-for="tableRow in tableRows"
						:key="tableRow.id"
						:style="{
							width: tableRow.tag ? 'auto' : '35%',
						}"
					>
						<div class="table-tag__title-section">
							<p class="table-tag__title">{{ tableRow.title }}</p>
						</div>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="dataRow in dataTable" :key="dataRow.id" class="table-tag__row">
					<td
						v-for="tableRow in tableRows"
						:key="tableRow.id"
						:style="{
							width: tableRow.tag ? 'auto' : '33.5%',
						}"
						@click="(event) => onRoutePage(event, dataRow)"
					>
						<div v-if="tableRow.tag" class="table-tag__content-list-tag">
							<p v-if="dataRow?.tags?.length === 0" class="no-data">Нет данных</p>
							<span
								v-for="(row, index) in dataRow[tableRow.name]"
								v-else
								:key="index + 1"
								class="table-tag__content-tag"
								>{{ row }}</span
							>
						</div>
						<span v-else v-data-title class="table-tag__content-item"> {{ dataRow[tableRow.name] }}</span>
					</td>
					<td v-show="hasEdit" class="table-view__actions-item">
						<img
							class="registry-detailed__icons"
							src="../../../../public/img/icon-delete.png"
							alt="delete"
							@click="isModal = dataRow?.id"
						/>
						<img
							class="registry-detailed__icons"
							src="../../../../public/img/icon-edit.png"
							alt="edit"
							@click="editRecord(dataRow?.id)"
						/>
					</td>
				</tr>
				<modal-window
						v-for="dataRow in dataTable"
						v-show="isModal === dataRow?.id"
						:key="dataRow.id"
						:size-small="true"
						:title="`Удаление`"
						:on-submit="() => onDeleteRow(dataRow.id)"
						@toggle-modal="toggleModal"
          >
            <p>Это действие не возможно будет отменить</p>
				</modal-window>
				<p v-if="data?.length === 0" class="no-data">Нет данных</p>
			</tbody>
		</table>
  </div>
</template>

<script>
import './style.scss';

export default {
	name: 'TableTag',
	props: {
		table: {
			type: Function,
			default: () => {},
		},
		sortMenu: {
			type: Object,
			default: () => {},
		},
		data: {
			type: Array,
			default: new Array(),
		},
		checkbox: {
			type: Boolean,
			default: true,
		},
		hasEdit: {
			type: Boolean,
			default: false,
		},
		editRowWidth: {
			type: String,
			default: '170px',
		},
		rowRoute: {
			type: Function,
			default: () => null,
		},
		editRecord: {
			type: Function,
			default: () => null,
		},
		onRemoveRow: {
      type: Function,
      default: () => null,
    },
	},
	data() {
		return {
			tableRows: [],
			dataRows: [],
			showWidth: false,
			editRow: {},
			actionDisabled: false,
			isModal: 0,
		};
	},
	computed: {
		dataTable() {
			const data = this.data.filter((item) => item.id);
			const editRow = () => this.data.map((item) => (this.editRow[item.name] = false));
			editRow();
			return data;
		},
	},
	mounted() {
		const tableData = this.table();
		this.tableRows = tableData.tables;
	},
	methods: {
		onPaginationCurrent(event) {
			console.log(event.target);
			// event.target.classList.toggle('table-view__pagination-active');
		},
		onPaginationPrev(event) {
			event.target.nextElementSibling.classList.toggle('table-view__pagination-active');
		},
		onPaginationNext(event) {
			event.target.nextElementSibling.classList.toggle('table-view__pagination-active');
		},
		onRoutePage(event, row) {
			if (event.target.className !== 'checkbox') {
				this.rowRoute(row);
			}
		},
		onChangeEditRow(row, name) {
			row[name] = !row[name];
			this.actionDisabled = true;
		},
		onSaveRow(row, name) {
			row[name] = !row[name];
			this.actionDisabled = false;
		},
		onCancelRow(row, name) {
			row[name] = !row[name];
			this.actionDisabled = false;
		},
		onDeleteRow(id) {
      this.onRemoveRow(id);
    },
		toggleModal(value) {
			this.isModal = value;
		}
	},
};
</script>

<style scoped></style>
