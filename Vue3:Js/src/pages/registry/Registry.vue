<template>
  <div class="registry">
    <div class="registry-header">
      <div class="registry-header__filter">
        <img
            class="registry-header__filter-modal"
            src="../../../public/img/filterIcon.png"
            alt="filter"
            @click="onShowModal"
        />
        <p>{{ pagination.total }} животных</p>
      </div>
      <div class="registry-header__filter-actions">
        <button-group
            v-show="profile.role == 'sh'"
            :click="() => $router.push('/addanimal')"
            class="registry-header__filter-actions__btn"
            :size="'small'"
            type="primary"
        >Добавить животное
        </button-group>
        <input-group
            class="registry-header__filter-actions__input"
            :width="'400px'"
            :on-change="(value) => onSearch(value)"
            :on-clear="(value) => onClearSearch(value)"
            :type="'search'"
            :placeholder="'Поиск'"
            size="small"
        />
        <img
            v-if="!isAnim"
            class="registry-header__icon-upload"
            src="../../../public/img/Upload.png"
            alt="upload"
        />
        <v-icon
            v-else
            v-data-anim
            class="registry-header__icon-reports"
            width="25"
            height="25"
            name="hi-document-report"
            fill="#3360F4"
        />
        <div
            v-show="isReportList"
            v-click-outside="(e) => hideReportsList(e)"
            class="registry-header__reports-list"
        >
          <div v-if="!isAnim">
            <p class="registry-header__reports-download" @click="() => onGetReport('xlsx')">
              Экспорт в формате XLSX
            </p>
            <p class="registry-header__reports-download" @click="() => onGetReport('pdf')">
              Экспорт в формате PDF
            </p>
          </div>
          <div v-else-if="dataSocketComp.task_id">
            <p class="registry-header__reports-url">
              Файл: {{ dataSocketComp.file.link.split('/').slice(-1)[0] }}
            </p>
            <div class="registry-header__reports-url-btns">
              <p class="registry-header__reports-clear" @click="clearReport">Очистить</p>
              <p
                  class="registry-header__reports-save"
                  @click="() => saveReport(dataSocketComp.file.link)"
              >
                Скачать
              </p>
            </div>
          </div>
          <p v-else>Идет подготовка файла...</p>
        </div>
      </div>
    </div>
    <ul class="registry-tab-panel">
      <li class="registry-tab-panel__btns" :class="{'registry-tab-panel__btns-active': activeTab === 0 }"
          @click="() => onListAnimalType(0)">
        Активные
      </li>
      <li class="registry-tab-panel__btns" :class="{'registry-tab-panel__btns-active': activeTab === 1 }"
          @click="() => onListAnimalType(1)">
        Архивные
      </li>
    </ul>

    <table-view
        :table="table"
        :data="searchData"
        :on-pagination="(value, perPage) => onPagination(value, perPage)"
        :pages="pagination.pages"
        :per-page="(value) => onPerPage(value)"
        :sort-menu="sortMenu"
        :row-route="(row) => $router.push(`/card/${row.national_id}/${row.id}`)"
        :on-checkbox-list="(value) => onCheckboxList(value)"
        :clear-checkbox-list="clearCheckboxList"
        :on-filter-submit="onFilterSubmit"
        :min-body-width="`calc(${Object.values(sortMenu)?.filter(Boolean)?.length > 0 && Object.values(sortMenu)?.filter(Boolean)?.length * 130}px)`"
    />
    <modal-checkbox-sort
        v-model:show="show"
        :title="'Настройка списка в Цифровом паспорте животного'"
        :on-submit="onRecordSortMenu"
        :sort-menu="sortMenu"
    >
      <template #default="{ sortChange, onChange }">
        <p class="registry-header__modal-content__title">Отметьте разделы, которые будут видны</p>
        <div class="registry-header__filter-modal__checkboxs">
          <div class="registry-header__filter-modal__checkboxs-block">
            <checkbox-group
                :checked="sortChange.national_id"
                :on-change="(value) => onChange(value, 'national_id')"
            >Номер RFID бирки
            </checkbox-group>
            <checkbox-group :checked="sortChange.name" :on-change="(value) => onChange(value, 'name')"
            >Кличка
            </checkbox-group>
            <checkbox-group
                :checked="sortChange.gender_group"
                :on-change="(value) => onChange(value, 'gender_group')"
            >Половозрастная группа
            </checkbox-group>
            <checkbox-group :checked="sortChange.farm_id" :on-change="(value) => onChange(value, 'farm_id')"
            >Ферма
            </checkbox-group>
          </div>
          <div class="registry-header__filter-modal__checkboxs-block">
            <checkbox-group
                :checked="sortChange.born_date"
                :on-change="(value) => onChange(value, 'born_date')"
            >Возраст
            </checkbox-group>
            <!--						<checkbox-group :checked="sortChange.farm" :on-change="(value) => onChange(value, 'farm')"-->
            <!--							>Ферма</checkbox-group-->
            <!--						>-->
            <!--						<checkbox-group :checked="sortChange.area" :on-change="(value) => onChange(value, 'area')"-->
            <!--							>Район</checkbox-group-->
            <!--						>-->
            <checkbox-group :checked="sortChange.type" :on-change="(value) => onChange(value, 'type')"
            >Тип животного
            </checkbox-group>
            <checkbox-group
                :checked="sortChange.assignment_id"
                :on-change="(value) => onChange(value, 'assignment_id')"
            >Назначение животного
            </checkbox-group>
            <checkbox-group
                v-show="profile.role !== 'sh'"
                :checked="sortChange.district"
                :on-change="(value) => onChange(value, 'district')"
            >Район
            </checkbox-group>
          </div>
        </div>
      </template>
    </modal-checkbox-sort>
  </div>
</template>

<script>
import './style.scss';
import './media.scss';
import {mapActions, mapState} from 'vuex';
import _ from 'lodash';
import {notify} from '@kyvg/vue3-notification';
import {ageСalculation} from '../data.js'
import {socket} from "@/pages/socketInit.js";

import.meta.env.MODE;

export default {
  name: 'PageContent',
  data() {
    return {
      show: false,
      activeSearch: false,
      searchItem: '',
      dataSocket: {},
      isAnim: false,
      isReportList: false,
      clearCheckboxList: false,
      filters: {isArchive: 0},
      searchValue: '',
      sortMenu: {
        national_id: true,
        name: true,
        gender_group: true,
        type: true,
        born_date: true,
        assignment_id: true,
        farm_id: true,
        district: true,
        posIcon: 0,
      },
      genderGroup: {
        1: 'Корова',
        2: 'Бык',
      },
      type: {
        2: 'Племенное',
        1: 'Товарное',
      },
      checkboxChange: {},
      keys: [true, false],
      activeTab: 0,
      checkboxList: [],
    };
  },
  computed: {
    ...mapState({
      farm: (state) => state.directory.farm,
      list: (state) => state.registry.list,
      pagination: (state) => state.registry.pagination,
      assignment: (state) => state.directory.assignment,
      district: (state) => state.directory.district,
      reports: (state) => state.registry.reports,
      dataSocket: (state) => state.registry.dataSocket,
      filters: (state) => state.registry.filters,
      profile: (state) => state.auth.profile,
      statistics: (state) => state.registry.statistics,
    }),
    dataSocketComp() {
      if (typeof this.dataSocket == 'string') {
        return JSON.parse(this.dataSocket);
      } else {
        return this.dataSocket;
      }
    },
    searchData() {
      const value = this.searchItem.toLowerCase().trim();

      if (value !== '') {
        return this.list.map((item) => {
          if (item.name.toLowerCase().search(value) == -1) {
            return false;
          } else {
            return item;
          }
        });
      } else {
        return this.list;
      }
    },
    ageRange() {
      let range = [0, 0]
      if (this.statistics?.ages) {
        const arr = Object.values(this.statistics?.ages)?.map(item => item?.age)?.filter(el => el >= 0);
        const ages = arr?.length > 0 ? [...arr] : [];
        const min = Math.min(...ages);
        const max = Math.max(...ages) + 1;
        return [min, max];
      }
      return range;
    }
  },
  watch: {
		dataSocket: {
			immediate: true,
			handler(newValue, prevValue) {
				const newValueJSON = JSON.stringify(newValue);
				if (newValueJSON !== JSON.stringify(prevValue)) {
					if (newValueJSON === '{}') {
						this.isAnim = false;
					} else {
						this.isAnim = true;
					}
				}
			}
		}
  },
  async mounted() {
    // console.log('import.meta.env.VITE_DEBUG', import.meta.env.VITE_DEBUG);
    this.dataSocket = localStorage.getItem('dataSocket') || {};
    this.$store.commit('setBreadCrumbs', [
      {
        title: 'Цифровой паспорт животного',
        to: '/',
      },
    ]);

    socket.on('new_action', (data) => {
      this.dataSocket = data.body.data;
      localStorage.setItem('dataSocket', JSON.stringify(data.body.data));
      notify({
        text: `${data.body.message}`,
        ignoreDuplicates: true
      });
    });

    this.getDirectoryAssignment();
    this.getDirectoryFarm();
    this.getDirectoryDistrict();
    this.getList({filters: this.filters});
    this.getDirectoryFarm();
    await this.getAnimalStatistics();
  },
  methods: {
    ...mapActions({
      getDirectoryFarm: 'getDirectoryFarm',
      getList: 'getList',
      getRegistryPagination: 'getRegistryPagination',
      getDirectoryAssignment: 'getDirectoryAssignment',
      getDirectoryDistrict: 'getDirectoryDistrict',
      getReportAnimal: 'getReportAnimal',
      getReportAnimalPDF: 'getReportAnimalPDF',
      getListReports: 'getListReports',
      getListSearch: 'getListSearch',
      getAnimalStatistics: 'getAnimalStatistics',
    }),
    table() {
      const tables = [
        {
          id: 1,
          name: 'national_id',
          title: 'Номер  бирки',
          sort: true,
          filter: false,
          // width: 160,
          // width: 15,
        },
        {
          id: 2,
          name: 'name',
          title: 'Кличка',
          sort: true,
          filter: false,
          // width: 140,
        },
        {
          id: 3,
          name: 'gender_group',
          title: 'Половоз\u00adрастная гр.',
          sort: true,
          filter: [
            {id: 2, name: 'Бык', value: 2},
            {id: 1, name: 'Корова', value: 1},
          ],
          filterName: 'genderGroup',
          // width: 210,
          // width: 15,
          data: (row, text) => this.genderGroup[text],
        },
        {
          id: 4,
          name: 'type',
          title: 'Тип',
          sort: true,
          filter: [
            {id: 2, name: 'Племенное', value: 2},
            {id: 1, name: 'Товарное', value: 1},
          ],
          filterName: 'type',
          // width: 150,
          data: (row, text) => this.type[text],
        },
        {
          id: 5,
          name: 'born_date',
          title: 'Возраст',
          sort: true,
          filter: this.ageRange,
          filterType: 'range',
          filterName: 'age',
          data: (row, text) => ageСalculation(text, 'YYYY-MM-DD'),
          // width: 90,
        },
        {
          id: 6,
          name: 'assignment_id',
          title: 'Назначение',
          sort: true,
          sortName: 'assignment.name',
          filter: this.assignment.map(item => {
            return {...item, value: item.id}
          }),
          filterName: 'assignment',
          // width: '10%',
          data: (row) => this.getAssignment(row.assignment_id),
        },
        {
          id: 7,
          name: 'farm_id',
          title: 'Хозяйство',
          sort: true,
          filter: this.farm.map(item => {
            return {...item, value: item.id}
          }),
          filterName: 'farm',
          // width: '10%',
          data: (row) => this.getFarm(row.farm_id),
        },
        {
          id: 7,
          name: 'district',
          title: 'Район',
          isView: this.profile.role == 'msh' ? true : false,
          sort: false,
          filter: this.district.map(item => {
            return {...item, value: item.id}
          }),
          filterName: 'districtId',
          // width: '10%',
          data: (row) => row?.creator?.district?.name || 'Нет данных',
        },
      ];

      return {tables};
    },
    handleClick(i) {
      this.keys.map((item, index) => {
        if (index == i) {
          this.keys[index] = true;
        } else {
          this.keys[index] = false;
        }
      });
    },
    onShowModal() {
      this.show = true;
    },
    onRecordSortMenu(sortChange) {
      const newSortMenu = {...this.sortMenu, ...sortChange};
      this.sortMenu = newSortMenu;
    },

    onListAnimalType(value) {
      this.activeTab = value;
      this.filters.isArchive = value;
      this.getList({filters: this.filters});
    },

    onSearch(value) {
      this.searchValue = value;
      let params = {...this.filters};
      if (value == '') {
        if (params.filters) {
          delete params.filters.nationalIdSearch;
        } else {
          this.getList({filters: this.filters});
        }

      } else {
        if (params.filters) {
          params.filters.nationalIdSearch = value;
        } else {
          params = {};
          params.isArchive = this.activeTab;
          params.nationalIdSearch = value;
        }
        this.getList({filters: params});
      }
    },
    onClearSearch() {
      this.getList({filters: this.filters});
    },
    getAssignment(id) {
      const value = this.assignment.filter((item) => item.id == id);
      return value[0]?.name;
    },
    getFarm(id) {
      const value = this.farm.filter((item) => item.id == id);
      return value[0]?.name;
    },
    getDistrict(id) {
      const value = this.district.filter((item) => item.id == id);
      return value[0]?.name;
    },
    onPagination(value, perPage) {
      // localStorage.setItem('page', value);
      // localStorage.setItem('perPage', perPage);
      this.getRegistryPagination({page: value, perPage: perPage, filters: this.filters});
    },
    onPerPage(value) {
      // localStorage.setItem('perPage', value);
      this.getRegistryPagination({page: 1, perPage: value, filters: this.filters});
    },
    onCheckboxList(data) {
      let resultChecked = [...this.checkboxList];
      data.map((dataItem) => {
        if (dataItem.value) {
          resultChecked = [...resultChecked, ...[dataItem.id]];
        } else {
          resultChecked = resultChecked.filter((item) => item !== dataItem.id);
        }
      });

      const uniqResultChecked = _.uniq(resultChecked);

      this.checkboxList = uniqResultChecked;
    },
    onGetReport(type) {
      if (this.checkboxList.length > 0) {
        this.clearCheckboxList = true;
        this.isAnim = true;
        this.dataSocket = {};
        localStorage.removeItem('dataSocket');
        if (type === 'xlsx') {
          this.getReportAnimal({animals: this.checkboxList});
        } else if (type === 'pdf') {
          this.getReportAnimalPDF({animals: this.checkboxList});
        }
        this.checkboxList = [];
        this.animals = [];
      } else {
        notify({
          text: 'Вы не выбрали животного(ых)',
        });
      }
    },
    hideReportsList(e) {
      if (
          e.target.className === 'registry-header__icon-upload' ||
          e.target.className.baseVal === 'ov-icon registry-header__icon-reports'
      ) {
        this.isReportList = !this.isReportList;
      } else {
        this.isReportList = false;
      }
    },
    saveReport(link) {
      window.open(link, '_blank');
      // window.location.href = link;
      this.isReportList = false;
      this.isAnim = false;
      this.dataSocket = {};
			localStorage.removeItem('dataSocket');
      this.clearCheckboxList = false;
    },
    clearReport() {
      this.isReportList = false;
      this.isAnim = false;
      this.dataSocket = {};
			localStorage.removeItem('dataSocket');
      this.clearCheckboxList = false;
    },
    onFilterSubmit(filters) {
      this.filters = filters;
      if (this.searchValue !== '' || filters.nationalIdSearch) {
        filters.nationalIdSearch = this.searchValue;
      }
      this.getList({filters});
    }
  },
};
</script>

<style scoped></style>
