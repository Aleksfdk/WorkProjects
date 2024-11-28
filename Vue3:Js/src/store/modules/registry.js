import http from '../http.js';
import { object2Url } from "../utils.js";
import { notify } from '@kyvg/vue3-notification';

export const registry = {
	state: () => ({
		loading: false,
		list: [],
		pagination: {},
		animalCard: {},
		reports: [],
		dataSocket: {},
		isNationalIdError: false,
		isMotherError: false,
		isFatherError: false,
		filters: {},
		statistics: {}
	}),
	getters: {
		getRegistryList(state) {
			return state.list;
		},
	},
	mutations: {
		setLoading(state, data) {
			state.loading = data;
		},
		setAnimalCard(state, data) {
			state.animalCard = data;
		},
		setSocketReports(state, data) {
			state.dataSocket = data;
		},
		setIsNationalIdError(state, data) {
			state.isNationalIdError = data;
		},
		// Для проверки пола предка
		// по данным national_id из mother_id / father_id
		setIsMotherError(state, data) {
			state.isMotherError = data;
		},
		setIsFatherError(state, data) {
			state.isFatherError = data;
		},
		setFilters(state, data) {
			state.filters = data;
		},
	},
	actions: {
		getList({ state, dispatch, commit }, data) {
			dispatch('setLoading', true);
			const params = object2Url(data);
			// ?paginate[page]=2&paginate[per_page]=100
			http.get(`/animal${params ? params : ''}`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (!res?.data?.data?.data) {
						notify({
							text: "Произошла ошибка при загрузке спиcка животных",
						});
					} else {
						state.list = res.data.data.data;
						state.pagination = res.data.data.pagination;
						if (data?.filters) {
							commit('setFilters', data?.filters);
						} else {
							commit('setFilters', {});
						}
					}
				})
		},
		getListSearch({ state, dispatch }, data) {
			dispatch('setLoading', true);
			// ?paginate[page]=2&paginate[per_page]=100
			http.get(`/animal?filters[nationalIdSearch]=${data.national_id}`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (!res?.data?.data?.data) {
						notify({
							text: "Произошла ошибка при поиске животных",
						});
					} else {
						state.list = res.data.data.data;
						state.pagination = res.data.data.pagination;
					}
				})
		},
		async getRegistryPagination({ state, dispatch, commit }, data) {
			dispatch('setLoading', true);
			const params = object2Url(data);
			// ?paginate[page]=2&paginate[per_page]=100
			await http.get(`/animal${params ? `${params}&` : '?'}paginate[page]=${data.page}&paginate[perpage]=${data.perPage}}`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (!res?.data?.data?.data) {
						notify({
							text: "Произошла ошибка при загрузке спиcка животных",
						});
					} else {
						state.list = res.data.data.data;
						state.pagination = res.data.data.pagination;
						if (data?.filters) {
							commit('setFilters', data?.filters);
						} else {
							commit('setFilters', {});
						}
					}
				})
		},
		async setRegistryAnimal({ dispatch, commit }, data) {
			commit('setIsNationalIdError', false);
			dispatch('setLoading', true);
			await http.post('/animal', data)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						if (res?.data?.errors?.find(item => item?.message.indexOf('The national id has already been taken') !== -1)) {
							commit('setIsNationalIdError', true);
							notify({
								text: "Указанный национальный идентификационный номер животного уже содержится в системе",
							});
						} else {
							notify({
								text: "Произошла ошибка при добавлении животного в реестр",
							});
						}
					} else {
						notify({
							text: "Животное успешно добавлено в реестр",
						});
					}
				})
		},
		async getDetailedAnimal({ state, dispatch }, data) {
			dispatch('setLoading', true);
			await http.get(`/animal/${data.id}`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (!res?.data?.data) {
						notify({
							text: "Произошла ошибка при загрузке карточки животного",
						});
					} else {
						state.animalCard = res.data.data;
						state.defaultAnimalCard = res.data.data;
					}
				})
		},
		async changeRegistryAnimal({ dispatch, commit }, data) {
			commit('setIsNationalIdError', false);
			dispatch('setLoading', true);
			await http.put(`/animal/${data.id}`, data.data)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (!res?.data?.data) {
						if (res?.data?.errors?.find(item => item?.message.indexOf('The national id has already been taken') !== -1)) {
							commit('setIsNationalIdError', true);
							notify({
								text: "Указанный национальный идентификационный номер животного уже содержится в системе",
							});
						} else {
							notify({
								text: "Произошла ошибка при редактировании основных данных по животному",
							});
						}
					} else {
						commit('setAnimalCard', res.data.data);
						notify({
							text: "Основные данные по животному успешно отредактированы",
						});
					}
				})
		},
		async removeRegistryAnimal({ dispatch }, data) {
			dispatch('setLoading', true);
			await http.delete(`/animal/${data.id}`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						notify({
							text: "Произошла ошибка при удалении животного",
						});
					} else {
						notify({
							text: "Животное успешно удалено",
						});
					}
				})
		},
		setAnimalCard({ commit }, data) {
			commit('setAnimalCard', data);
		},
		async getReportAnimal({ dispatch }, data) {
			dispatch('setLoading', true);
			await http.post('/animal/report/xlsx', data)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						notify({
							text: "Произошла ошибка при запросе на формирование отчёта",
						});
					} else {
						notify({
							text: "Запрос на формирование отчёта успешно отправлен",
							ignoreDuplicates: true
						});
					}
				})
		},
		async getReportAnimalPDF({ dispatch }, data) {
			dispatch('setLoading', true);
			await http.post('/animal/report/pdf', data)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						notify({
							text: "Произошла ошибка при запросе на формирование отчёта",
						});
					} else {
						notify({
							text: "Запрос на формирование отчёта успешно отправлен",
							ignoreDuplicates: true
						});
					}
				})
		},
		async getListReports({ state, dispatch }, data) {
			dispatch('setLoading', true);
			await http.get(`/queue-task/${data.id}`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.data) {
						state.reports = res?.data?.data;
					}
				})
		},
		async checkRelativeNationalId({ dispatch, commit }, data) {
			dispatch('setLoading', true);
			// isHidden=2 - чтобы отображать и скрытых и нескрытых животных
			await http.get(`/animal/?filters[nationalId][]=${data.national_id}&filters[isHidden]=2`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						notify({
							text: "Произошла ошибка при установлении связи с предком",
						})
					} else {
						return res;
					}
				})
				.then((res) => {
					if (res?.data?.status === "success" && !res?.data?.errors) {
						if (res.data?.data?.data?.length > 0) {
							const resData = res.data?.data?.data?.[0];
							if (data.gender_group === resData?.gender_group) {
								if (data.gender_group === 1) {
									commit('setIsMotherError', false);
								}
								if (data.gender_group === 2) {
									commit('setIsFatherError', false);
								}
							} else {
								if (data.gender_group === 1) {
									commit('setIsMotherError', true);
									notify({
										text: "Идентификационный номер животного из поля Мать не соответствует полу найденного в базе животного",
									})
								}
								if (data.gender_group === 2) {
									commit('setIsFatherError', true);
									notify({
										text: "Идентификационный номер животного из поля Отец не соответствует полу найденного в базе животного",
									})
								}
							}
						} else {
							if (data.gender_group === 1) {
								commit('setIsMotherError', false);
							}
							if (data.gender_group === 2) {
								commit('setIsFatherError', false);
							}
						}
					}
				})
		},
		async getAnimalStatistics({ state, dispatch }) {
			dispatch('setLoading', true);
			await http.get(`/animal/statistics`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.data) {
						state.statistics = res?.data?.data;
					}
				})
		},
		setIsNationalIdError({ commit }, data) {
			commit('setIsNationalIdError', data);
		},
		setIsMotherError({ commit }, data) {
			commit('setIsMotherError', data);
		},
		setIsFatherError({ commit }, data) {
			commit('setIsFatherError', data);
		},
		setFilters({ commit }, data) {
			commit('setFilters', data);
		},
	},
};
