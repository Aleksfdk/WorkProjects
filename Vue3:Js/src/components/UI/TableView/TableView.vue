<template>
	<div class="table-view">
		<table class="table-view__panel">
			<thead>
				<tr>
					<th
						v-for="(tableRow, index) in tableRows"
						v-show="onShowColumn(tableRow.name, tableRow.isView, sortMenu)"
						:key="tableRow.id"
						:style="{
							// width: Object.values(sortMenu).includes(false)
							width: showWidth ? 'auto' : tableRow.width && tableRow.width + '%',
						}"
					>
						<div class="table-view__title-section">
							<!--							<div v-if="index === 0" class="table-view__title-section__checkbox">-->
							<checkbox-group
								v-if="checkbox && index === 0"
								:on-change="(value) => onAllRowCheckbox(value)"
								:checked="rowsChecked"
							>
								<p class="table-view__title" :style="{ width: (sortMenu ? Object.values(sortMenu)?.filter(Boolean)?.length > 5 : tableRows?.length > 5) && windowWidth < 1800 && tableRow?.title?.length > 10 ? 'min-content' : 'unset'}">
									{{ tableRow.title }}
								</p>
							</checkbox-group>
							<!--							</div>-->
							<p v-else class="table-view__title" :style="{ width: (sortMenu ? Object.values(sortMenu)?.filter(Boolean)?.length > 5 : tableRows?.length > 5) && windowWidth < 1800 && tableRow?.title?.length > 13 ? 'min-content' : 'unset'}">
								{{ tableRow.title }}
							</p>

							<div
								v-if="!rowModalSort[index]"
								v-show="tableRow.sort !== false"
								class="table-view__icons sort-btn"
								@click="() => onSort(index, tableRow?.name, tableRow?.sortName)"
							>
								<v-icon
									name="hi-arrow-narrow-up"
									fill='#A0A3B6'
								/>
								<v-icon
									name="hi-arrow-narrow-down"
									fill='#A0A3B6'
								/>
							</div>

							<div
								v-else
								class="table-view__icons sort-btn"
								@click="() => onSort(index, tableRow?.name, tableRow?.sortName)"
							>
								<v-icon
									name="hi-arrow-narrow-up"
									:fill="
										filterDirExceptions.includes(tableRow?.name)
										? filters?.sortAsc && filters?.sortAsc?.indexOf(tableRow?.name) !== -1 ? '#3360F4' : '#A0A3B6'
										:	(filterDirCustom.includes(tableRow?.sortName)
												? filters?.sortDescCustom && filters?.sortDescCustom?.indexOf(tableRow?.sortName) !== -1 ? '#3360F4' : '#A0A3B6'
												: filters?.sortDesc && filters?.sortDesc?.indexOf(tableRow?.name) !== -1 ? '#3360F4' : '#A0A3B6'
											)
									"
								/>
								<v-icon
									name="hi-arrow-narrow-down"
									:fill="
										filterDirExceptions.includes(tableRow?.name)
										?	filters?.sortDesc && filters?.sortDesc?.indexOf(tableRow?.name) !== -1 ? '#3360F4' : '#A0A3B6'
										: (filterDirCustom.includes(tableRow?.sortName)
												? filters?.sortAscCustom && filters?.sortAscCustom?.indexOf(tableRow?.sortName) !== -1 ? '#3360F4' : '#A0A3B6'
												: filters?.sortAsc && filters?.sortAsc?.indexOf(tableRow?.name) !== -1 ? '#3360F4' : '#A0A3B6'
											)
									"
									/>
							</div>

							<v-icon
								v-show="tableRow.filter !== false"
								class="table-view__icons"
								name="hi-filter"
								:fill="(filterCheckboxes[tableRow?.filterName]?.length > 0 || (tableRow?.filterName === 'age' && ranges?.age?.length && ranges?.age[1] && JSON.stringify(tableRow?.filter) !== JSON.stringify(ranges?.age))) ? '#3360F4' : '#A0A3B6'"
								@click="isViewFilter(index)"
							/>

							<transition name="fade">
								<div
									v-show="rowModalFilter[index]"
									v-click-outside="(e) => hideFilter(e, index)"
									class="table-view__modal"
								>
									<div v-if="tableRow.filterType && tableRow.filterType === 'range'" class="table-view__modal-content">
										<div id="slider">
											<range-slider
												:val="ranges[tableRow?.filterName]?.length > 0 ? [ranges[tableRow?.filterName][0], ranges[tableRow?.filterName][1]] : undefined"
												:min="tableRow?.filter?.length > 0 ? tableRow?.filter[0] : 0"
												:max="tableRow?.filter?.length > 0 ? tableRow?.filter[1] : 0"
												:on-change="(value) => onRangeChange(value, tableRow?.filterName)"
											/>
										</div>
									</div>
									<div v-else class="table-view__modal-content">
										<div
											v-for="filterItem in tableRow.filter"
											:key="filterItem.id"
											class="table-view__modal-checkbox"
										>
											<input
												v-model="filterCheckboxes[tableRow?.filterName]"
												type="checkbox"
												:value="filterItem.value"
												@change="(e) => filterCheckboxChange(tableRow?.filterName, filterItem.value, e.target.checked)"
											/>
												<p>{{ filterItem.name }}</p>
										</div>
									</div>
									<div class="table-view__modal-btns">
										<button-group
											:width="'164px'"
											:size="'small'"
											type="secondary"
											:disabled="false"
											@click="() => tableRow?.filterType === 'range' ? filterClear(tableRow?.filterName, index, tableRow?.filter) : filterClear(tableRow?.filterName, index)"
											>Очистить
										</button-group>
										<button-group :width="'164px'" :size="'small'" type="primary" :disabled="false"
											@click="() => filterSave(tableRow?.filterName, index)"
											>Применить
										</button-group>
									</div>
								</div>
							</transition>
						</div>
					</th>
					<th v-show="edit" class="table-view__actions-title"></th>
				</tr>
			</thead>
			<!--		</table>-->
			<!--		<div class="table-view__scroll">-->
			<!--			<table>-->
			<tbody :style="{minWidth: minBodyWidth}">
				<p v-if="data?.length === 0" class="no-data">Нет данных</p>
				<modal-window
					v-for="(dataRow) in dataTable"
					v-show="isModal === dataRow?.id"
					:key="dataRow.id"
					:size-small="true"
					:title="`Удаление`"
					:on-submit="() => onDeleteRow(dataRow.id)"
					@toggle-modal="toggleModal"
				>
					<p>Это действие не возможно будет отменить</p>
				</modal-window>
				<tr v-for="(dataRow, ind) in dataTable" :key="dataRow.id" class="table-view__row">
					<td
						v-for="(tableRow, index) in tableRows"
						v-show="onShowColumn(tableRow.name, tableRow.isView, sortMenu)"
						:key="tableRow.id"
						:class="{
							'title-checkbox': index === 0,
							'error': formErrors[ind] && Object.values(formErrors[ind])?.filter(Boolean)?.length > 0
						}"
						class="table-view__item"
						:style="{
							width: showWidth ? 'auto' : tableRow.width && tableRow.width + '%',
						}"
						@click="(event) => onRoutePage(event, dataRow)"
					>
						<span v-if="checkbox && index === 0" class="title-checkbox">
							<checkbox-group
								:checked="checkboxList[ind]"
								:on-change="(value) => onRowCheckbox(value, ind, dataRow)"
							>
								{{
									 tableRow?.type === 'select'
										? tableRow?.options?.find(el => el.id == dataRow[tableRow.name])?.name
										: (tableRow.data
											?  tableRow.data(dataRow, dataRow[tableRow.name], ind)
											: dataRow[tableRow.name]
										)
								}}</checkbox-group
							>
						</span>
						<!--						<span v-else v-data-title>{{ tableRow.data(dataRow) }}</span>-->
						<!--						<span v-else v-data-title>{{ dataRow[tableRow.name] }}</span>-->
						<span v-else>
							<span v-if="!editRow[dataRow.id]" v-data-title>
								{{
									 tableRow?.type === 'select'
										? tableRow?.options?.find(el => el.id == dataRow[tableRow.name])?.name
										: (tableRow.data
											?  tableRow.data(dataRow, dataRow[tableRow.name], ind)
											: dataRow[tableRow.name]
										)
								}}</span
							>

							<input-date
								v-if="editRow[dataRow.id] && tableRow.type === 'date'"
								:width="editRowWidth"
								:height="'32px'"
								:top-svg="'6px'"
								:name="tableRow.name"
								:val="
									tableRow.data
										? tableRow.data(dataRow, dataRow[tableRow.name], ind)
										: dataRow[tableRow.name]
								"
								:is-required="tableRow?.required"
								:min-date="checkMinDate(tableRow)"
								:max-date="checkMaxDate(tableRow)"
								:on-change="(value) => onEditRow(value, tableRow.name, ind)"
								:on-clear="() => true"
								size="small"
								@update-form-errors="updateFormErrors"
								@cancel-edit="cancelEdit(editRow, dataRow.id, ind)"
							/>

							<input-group
								v-if="editRow[dataRow.id] && tableRow.type !== 'date' && tableRow.type !== 'select'"
								:width="editRowWidth"
								:height="'32px'"
								:name="tableRow.name"
								:placeholder="tableRow?.formula ? 'Авторасчёт' : undefined"
								:val="checkFormula(tableRow, dataRow, ind)"
								:type="tableRow?.type"
								:is-required="tableRow?.required"
								:min="tableRow?.min"
								:max="tableRow?.max"
								:minlength="tableRow?.minLength"
								:maxlength="tableRow?.maxLength"
								:step="tableRow?.step"
								:is-disabled="tableRow?.disabled"
								:on-change="(value) => onEditRow(value, tableRow.name, ind)"
								:on-clear="() => true"
								size="small"
								:error-position="'static'"
								@update-form-errors="updateFormErrors"
								@cancel-edit="cancelEdit(editRow, dataRow.id, ind)"
							/>

							<select-group
								v-if="editRow[dataRow.id] && tableRow.type === 'select'"
								:width="editRowWidth"
								:height="'32px'"
								:top-svg="'7px'"
								:name="tableRow.name"
								:val="tableRow?.options?.find(el => el.id == dataRow[tableRow.name])"
								:val-id="
									tableRow.data
										? tableRow.data(dataRow, dataRow[tableRow.name], ind)
										: dataRow[tableRow.name]
								"
								:options="tableRow?.options"
								:is-required="tableRow?.required"
								:is-check-default="tableRow?.required && isCheckDefault"
								:on-change="(value) => onEditRow(value, tableRow.name, ind)"
								size="small"
								@update-form-errors="updateFormErrors"
								@cancel-edit="cancelEdit(editRow, dataRow.id, ind)"
							/>
						</span>
					</td>
					<td v-show="edit" class="table-view__actions-item">
						<img
							v-if="!editRow[dataRow.id]"
							v-show="!actionDisabled"
							class="registry-detailed__icons"
							src="../../../../public/img/icon-delete.png"
							alt="delete"
              @click="isModal = dataRow?.id"
						/>
						<v-icon
							v-else
							v-show="!deleteOnly"
							class="action-icon_pr"
							width="25"
							height="25"
							name="io-close"
							fill="#3360F4"
							@click="onCancelRow(editRow, dataRow.id, ind)"
						/>
						<img
							v-if="!editRow[dataRow.id]"
							v-show="!actionDisabled && !deleteOnly"
							class="registry-detailed__icons"
							src="../../../../public/img/icon-edit.png"
							alt="edit"
							@click="onChangeEditRow(editRow, dataRow.id)"
						/>
						<v-icon
							v-else
							v-show="!deleteOnly"
							class="action-icon_pr"
							width="25"
							height="25"
							name="hi-solid-check"
							fill="#3360F4"
							@click="onSaveRow(editRow, dataRow.id, ind)"
						/>
					</td>
				</tr>
			</tbody>
		</table>
		<!--		</div>-->
		<div class="table-view__footer">
			<div class="table-view__action-groups">
				<p v-show="checkbox">Отмечено: {{ amountChecked }}/{{ amountCheckbox }}</p>
				<!--        <select-group-->
				<!--            width="45px"-->
				<!--            default="10"-->
				<!--            :options="[-->
				<!--							{ value: 10, name: 10 },-->
				<!--							{ value: 20, name: 20 },-->
				<!--							{ value: 30, name: 30 },-->
				<!--							{ value: 40, name: 40 },-->
				<!--						]"-->
				<!--        />-->
			</div>
			<div class="table-view__pagination">
				<div class="table-view__pagination-prev" @click="onPaginationPrev">
					<v-icon name="md-arrowbackios-round" fill="#3360F4" />
				</div>
				<div class="table-view__pagination-list">
					<div
						v-for="(item, index) in pages"
						:key="index + 1"
						class="table-view__pagination-item"
            :class="{'table-view__pagination-active': paginationActive == item}"
						@click="() => onPaginationPage(item)"
					>
						{{ item }}
					</div>
				</div>
				<div class="table-view__pagination-next" @click="onPaginationNext">
					<v-icon class="arrow-next" name="md-arrowbackios-round" fill="#3360F4" />
				</div>
				<div class="table-view__amount-records">
					<p>Записей:</p>
					<select-group
						width="72px"
						:default="10"
            :on-change="(value) => onPerPage(value)"
            :options="[
							{ value: 10, name: 10 },
							{ value: 20, name: 20 },
							{ value: 30, name: 30 },
							{ value: 40, name: 40 },
						]"
						@input="currentPerPage"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import moment from "moment";
import './style.scss';

// Исключения ASC = DESC, DESC = ASC из-за особенностей сортировки по id поля на бэке
const filterDirExceptions = ['type', 'gender_group', 'born_date'];
// Кастомные поля для сортировки (если в поле содержится id, а сортировка нужна по алфавиту)
const filterDirCustom = ['assignment.name']

export default {
	name: 'TableView',
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
    pages: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Function,
      default: () => true,
    },
		checkbox: {
			type: Boolean,
			default: true,
		},
    clearCheckboxList: {
			type: Boolean,
			default: false,
		},
		edit: {
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
    onPagination: {
      type: Function,
      default: () => null,
    },
    onChangeRow: {
      type: Function,
      default: () => null,
    },
    onRemoveRow: {
      type: Function,
      default: () => null,
    },
    onCheckboxList: {
      type: Function,
      default: () => [],
    },
		onFilterSubmit: {
			type: Function,
      default: () => false,
		},
		minBodyWidth: {
			type: String,
			default: '760px',
		},
		// Без редактирования, только удаление
		deleteOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			tableRows: [],
			dataRows: [],
			isModalSort: false,
			isModalFilter: false,
			rowModalSort: [],
			rowModalFilter: [],
			showWidth: false,
			checkboxList: [],
			rowsChecked: false,
			amountChecked: 0,
			amountCheckbox: 0,
			editRow: {},
			actionDisabled: false,
			isModal: 0,
      paginationActive: 1,
      currentPerPage: 10,
      changeRow: {},
      dataTest: [],
      copyRow: false,
			formErrors: {},
			isCheckDefault: false,
			filters: {},
			filterDirExceptions: filterDirExceptions,
			filterDirCustom: filterDirCustom,
			// Обязательно заполнять для корректной
			// работы v-model у чекбоксов для фильтров ↓
			filterCheckboxes: {
				genderGroup: []
			},
			// Для сравнения при очистке формы фильтров,
			// чтобы не отправлять запросы, если данные по фильтрам не изменились
			hasSavedFilters: {},
			ranges: {},
			windowWidth: window?.innerWidth
		};
	},
	computed: {
		columns() {
			return this.table();
		},
		dataTable() {
			const data = this.data.filter((item) => item.id);
      const setData = () => this.dataRows = data;
      setData();
			const amountCheckbox = () => (this.amountCheckbox = data.length);
			const amountChecked = () => (this.amountChecked = data.length);
			const editRow = () => this.data.map((item) => (this.editRow[item.id] = false));
			if (this.rowsChecked) {
				amountChecked();
			}
			editRow();
			amountCheckbox();
			return this.dataRows;
		},
	},
	watch: {
		data(newValue, prevValue) {
			if (JSON.stringify(newValue) !== JSON.stringify(prevValue)) {
				this.actionDisabled = false;
			}
		},
		columns(newValue, prevValue) {
			if (JSON.stringify(newValue) !== JSON.stringify(prevValue)) {
				this.updateTable();
			}
		},
		sortMenu(newValue) {
			let amount = 0;
			for (let val in newValue) {
				if (newValue[val] === false) {
					amount = amount + 1;
				}
			}

			if (amount >= 2) {
				this.showWidth = true;
			} else {
				this.showWidth = false;
			}
		},
    clearCheckboxList: {
      immediate: true,
      handler() {
        if (this.clearCheckboxList) {
          this.onClearCheckboxList();
        }
      }
    }
	},
	mounted() {
		this.updateTable();
		window && window.addEventListener("resize", this.handleResize);
	},
	unmounted() {
		window && window.removeEventListener("resize", this.handleResize);
	},
	methods: {
		updateTable() {
			const tableData = this.table();
			// this.currentPerPage = this.perPage;
			this.tableRows = tableData.tables;
			// this.dataRows = this.data;

			tableData.tables.map(() => {
				this.rowModalSort.push(false);
				this.rowModalFilter.push(false);
			});

			this.data.map((row, index) => {
				this.checkboxList[index] = false;
			});
		},
    onShowColumn(name, isView = true, sortMenu) {
      if(!isView) {
        return false
      } else {
        return sortMenu ? sortMenu[name] : true
      }
      // isView || sortMenu ? sortMenu[name] : true
    },
		onSort(i, sortItem, customSortItem) {
			let sortName = '';

			if (!this.rowModalSort[i]) {
				delete this.filters?.sortAsc;
				delete this.filters?.sortDesc;
				delete this.filters?.sortAscCustom;
				delete this.filters?.sortDescCustom;
			}

			if ((!this.filters?.sortAsc && !this.filters?.sortDesc)
					|| (!this.filters?.sortAscCustom && !this.filters?.sortDescCustom)) {
				if (!filterDirCustom.includes(customSortItem)) {
					sortName = filterDirExceptions.includes(sortItem) ? 'sortDesc' : 'sortAsc';
				} else {
					sortName = 'sortAscCustom';
				}
			}

			// 1 нажатие на кнопку сортировки
			if (!filterDirExceptions.includes(sortItem) && this.filters?.sortAsc) {
				delete this.filters.sortAsc;
				sortName = 'sortDesc';
			}

			if (!filterDirCustom.includes(customSortItem) && this.filters?.sortAscCustom) {
				delete this.filters.sortAscCustom;
				sortName = 'sortDescCustom';
			}

			if (filterDirExceptions.includes(sortItem) && this.filters?.sortDesc) {
				delete this.filters.sortDesc;
				sortName = 'sortAsc';
			}

			let reset = false;

			// 2 нажатие на кнопку сортировки
			if (!filterDirExceptions.includes(sortItem) && this.filters?.sortDesc) {
				reset = true;
				delete this.filters.sortDesc;
				this.filters = { ...this.filters}
			}

			if (!filterDirCustom.includes(customSortItem) && this.filters?.sortDescCustom) {
				reset = true;
				delete this.filters.sortDescCustom;
				this.filters = { ...this.filters}
			}

			if (filterDirExceptions.includes(sortItem) && this.filters?.sortAsc) {
				reset = true;
				delete this.filters.sortAsc;
				this.filters = { ...this.filters}
			}

			// 3 сброс сортировки
			if (!this.filters?.sortAsc && !this.filters?.sortDesc
					&& !this.filters?.sortAscCustom && !this.filters?.sortDescCustom) {
				if (reset) {
					this.filters = { ...this.filters}
				} else {
					if (filterDirCustom.includes(customSortItem)) {
						this.filters = {
							...this.filters,
							[sortName]: [
								customSortItem
							]
						}
					} else {
						this.filters = {
							...this.filters,
							[sortName]: [
								sortItem
							]
						}
					}
				}
			}

			this.rowModalSort.map((item, index) => {
				if (index == i && (this.filters?.sortAsc || this.filters?.sortDesc
					|| this.filters?.sortAscCustom || this.filters?.sortDescCustom)) {
					this.rowModalSort[index] = true;
				} else {
					this.rowModalSort[index] = false;
				}
			});

			if (sortName !== '') {
				this.hasSavedFilters[sortName] = true;
			}
			this.onFilterSubmit(this.filters);
		},
		isViewFilter(i) {
			// this.isModalFilter = !this.isModalFilter;
			// this.isModalSort = false;
			this.rowModalFilter.map((item, index) => {
				if (index == i) {
					this.rowModalFilter[index] = !this.rowModalFilter[index];
				} else {
					this.rowModalFilter[index] = false;
				}
			});
			// this.rowModalSort.map((item, index) => (this.rowModalSort[index] = false));
		},
		onRangeChange(value, filterName) {
			if (filterName === 'age') {
				if (value?.length) {
					this.ranges = {
						...this.ranges,
						[filterName]: [...value]
					}
					this.filters = {
						...this.filters,
						ageFrom: value[0],
						ageTo: value[1],
					}
				}
			}
		},
		async filterCheckboxChange(filterName, filterItem, value) {
			if (value) {
				const arr = this.filters[filterName];
				const newArr = arr?.length > 0 ? arr : [];
				this.filterCheckboxes = {
					...this.filterCheckboxes,
					[filterName]: [
						...newArr,
						filterItem
					]
				}
				this.filters = {
					...this.filters,
					[filterName]: [
						...newArr,
						filterItem
					]
				}
			} else {
				const arr = this.filters[filterName]?.map(item => item)?.filter(el => el !== filterItem);
				const newArr = arr?.length > 0 ? arr : [];
				this.filterCheckboxes = {
					...this.filterCheckboxes,
					[filterName]: [
						...newArr
					]
				}
				this.filters = {
					...this.filters,
					[filterName]: [
						...newArr
					]
				}
			}

			await this.filterCheckboxes;
		},
		filterSave(filterName, index) {
			this.hasSavedFilters[filterName] = true;
			this.onFilterSubmit(this.filters);
			this.paginationActive = 1;
			this.rowModalFilter[index] = !this.rowModalFilter[index];
		},
		async filterClear(filterName, index, defaultValue) {
			delete this.filters?.[filterName];
			delete this.filterCheckboxes?.[filterName];

			if (filterName === 'age') {
				this.ranges = {
					...this.ranges,
					[filterName]: [...defaultValue]
				}
				delete this.filters?.ageFrom;
				delete this.filters?.ageTo;
			}
			// Если модальное окно закрывается по клику на очистить,
			// а изменения списка не требуется, т.к. фильтры не были применены
			// if (this.hasSavedFilters[filterName] || filterName === 'age') {
				this.onFilterSubmit(this.filters);
				this.paginationActive = 1;
			// }
			this.rowModalFilter[index] = !this.rowModalFilter[index];
		},
		hideFilter(e, index) {
			// this.isModalFilter = false;
			// this.isModalSort = false;
			if (e.target.nodeName !== 'svg' && e.target.nodeName !== 'path') {
				this.rowModalFilter[index] = false;
				//   this.rowModalFilter[index] = false;
			}
		},
    onPaginationPage(value) {
      if(this.paginationActive !== value) {
        this.paginationActive = value;
        this.onPagination(value, this.currentPerPage, this.filters);
      }
		},
		onPaginationPrev() {
      if(this.paginationActive !== 1) {
        this.paginationActive = this.paginationActive - 1;
        this.onPagination(this.paginationActive, this.currentPerPage, this.filters);
      }
		},
		onPaginationNext() {
      if(this.paginationActive !== this.pages) {
        this.paginationActive = this.paginationActive + 1;
        this.onPagination(this.paginationActive, this.currentPerPage, this.filters);
      }
		},
    onPerPage(value) {
      this.perPage(value.name);
      this.currentPerPage = value.name;
    },
		onRoutePage(event, row) {
			if (event.target.className !== 'checkbox') {
				this.rowRoute(row);
			}
		},
		onRowCheckbox(value, index, row) {
			this.checkboxList[index] = value;
			this.rowsChecked = false;
			this.amountChecked = value ? this.amountChecked + 1 : this.amountChecked - 1;
      this.onCheckboxList([{id: row.id, value: value, national_id: row.national_id}]);

		},
    onClearCheckboxList() {
        this.amountChecked = 0;
        this.checkboxList = [];
    },
		onAllRowCheckbox(value) {
			this.rowsChecked = value;
			this.amountChecked = value ? this.amountCheckbox : 0;
			// let listCheckbox = [...this.checkboxList];
      //
			// listCheckbox.map((item, index) => {
			// 	listCheckbox[index] = value;
			// });
			// this.checkboxList = listCheckbox;

      let listCheckbox = [];
      let report = [];

      for (let i = 0; i < this.amountCheckbox; i++) {
        listCheckbox[i] = value;
      }

         this.dataRows.map(item => report.push({id: item.id, value: value}))
         this.onCheckboxList(report);

      this.checkboxList = listCheckbox;
		},
    onEditRow(value, name, ind) {
      if (!this.copyRow) {
        const data = {...this.dataRows[ind]};
        this.copyRow = data;
      }
      this.dataRows[ind][name] = value;
      this.changeRow[name] = value;
    },
		onChangeEditRow(row, id) {
			row[id] = !row[id];
			this.actionDisabled = true;
		},
		async onSaveRow(row, id, index) {
			this.isCheckDefault = true;
			await this.isCheckDefault;
			if (this.formErrors[id] && Object.values(this.formErrors[id])?.filter(Boolean)?.length > 0) {
				notify({
          text: "Поля заполнены некорректно",
        })
			} else {
				row[id] = !row[id];
				this.actionDisabled = false;
				this.dataRows[index] = {...this.dataRows[index], ...this.changeRow};
				this.onChangeRow(id, this.changeRow);
				this.copyRow = false;
				this.changeRow = {};
      }
		},
		onCancelRow(row, id, index) {
			row[id] = !row[id];
			this.actionDisabled = false;
      this.dataRows[index] = {...this.dataRows[index], ...this.copyRow} ;
      this.copyRow = false;
			this.changeRow = {};
			this.formErrors = {};
			this.isCheckDefault = false;
		},
    async onDeleteRow(id) {
      await this.onRemoveRow(id);
      this.copyRow = false;
    },
		updateFormErrors(error) {
			const rowName = Object.keys(this.editRow).find(key => this.editRow[key]);
			this.formErrors = {
				...this.formErrors,
				[rowName]: {
					...this.formErrors[rowName],
					...error
				}
			};
		},
		cancelEdit(row, name) {
			this.onCancelRow(row, name);
		},
		checkMinDate(row) {
			if (row?.equalOrMoreThan) {
				return this.changeRow?.[row?.equalOrMoreThan];
			}
			if (row?.moreThan) {
				const moreThanDate = this.changeRow?.[row?.moreThan];
				const date = moment(moreThanDate, "YYYY-MM-DD").add(1, "days").format("YYYY-MM-DD");
				return date;
			}
				return row?.minDate || ''
		},
		checkMaxDate(row) {
			if (row?.equalOrLessThan) {
				return this.changeRow?.[row?.equalOrLessThan]
			}
			if (row?.lessThan) {
				const lessThanDate = this.changeRow?.[row?.lessThan];
				const date = moment(lessThanDate, "YYYY-MM-DD").subtract(1, "days").format("YYYY-MM-DD");
				return date;
			}
				return row?.maxDate || ''
		},
		checkFormula(tableRow, dataRow, ind) {
			if (!tableRow?.formula) {
				if (tableRow?.data) {
					return tableRow.data(dataRow, dataRow[tableRow.name], ind)
				} else {
					return dataRow[tableRow.name];
				}
			}

			let result = 0;

			if (tableRow?.formula?.type === 'dates' && tableRow?.formula?.arr?.length === 2) {
				const firstDate = tableRow?.formula?.arr[0];
				const secondDate = tableRow?.formula?.arr[1];

				const startDate = moment(this.changeRow?.[firstDate?.field], firstDate?.format);
				const endDate = moment(this.changeRow?.[secondDate?.field], secondDate?.format);

				const diff = (startDate.diff(endDate, tableRow?.formula?.dateDiff))
				if (diff) {
					result = diff;
				}
			}

			return Math.abs(result);
		},
		toggleModal(value) {
			this.isModal = value;
		},
		handleResize(e) {
			this.windowWidth = e?.target?.innerWidth;
		}
	},
};
</script>

<style scoped></style>
