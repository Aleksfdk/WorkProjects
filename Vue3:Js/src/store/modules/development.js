import http from '../http.js';
import { notify } from '@kyvg/vue3-notification';

export const development = {
	state: () => ({
		list: {},
		listOption: [],
		pagination: {},
		exteriorList: [],
		extraList: [],
		defectList: [],
		defectDetailed: {},
		limbList: [],
		udderList: [],
		exteriorAssessmentList: [],
	}),
	getters: {},
	mutations: {
		setDevelopmentOptionList(state, data) {
			state.listOption = data;
		},
		setDevelopmentDefectList(state, data) {
			state.defectList = data;
		},
		setDevelopmentDefectDetailed(state, data) {
			state.defectDetailed = data;
		},
		setDevelopmentLimbList(state, data) {
			state.limbList = data;
		},
		setDevelopmentUdderList(state, data) {
			state.udderList = data;
		},
		setExteriorAssessmentList(state, data) {
			state.exteriorAssessmentList = data;
		}
	},
	actions: {
		async getDevelopmentOptionList({ state, dispatch }, data) {
			dispatch('setLoading', true);
			// ?paginate[page]=2&paginate[per_page]=100
			await http
				.get(`/event/evolution/development_and_evaluation_option?filters[animal][]=${data.id}&filters[sortDesc][0]=date&filters[sortDesc][1]=id`)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (!res?.data?.data?.data) {
							notify({
								text: "Произошла ошибка при загрузке спиcка записей о развитии и оценке животного",
							});
						} else {
							state.listOption = res.data.data.data;
							state.pagination = res.data.data.pagination;
						}
					})
		},
		async getDevelopmentOptionPagination({ state, dispatch }, data) {
			dispatch('setLoading', true);
			// ?paginate[page]=2&paginate[per_page]=100
			await http
				.get(
					`/event/evolution/development_and_evaluation_option?filters[animal][]=${data.id}&filters[sortDesc][0]=date&filters[sortDesc][1]=id&paginate[page]=${data.page}&paginate[perpage]=${data.perPage}`,
				)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.data?.data) {
						state.listOption = res.data.data.data;
						state.pagination = res.data.data.pagination;
					}
				})
		},
		async setDevelopmentOptionResult({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.post('/event/evolution/development_and_evaluation_option', data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при добавлении записи о развитии и оценке животного",
							});
						} else {
							notify({
								text: "Запись о развитии и оценке животного успешно добавлена",
							});
						}
					})
		},
		async changeDevelopmentOptionResult({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.put(`/event/evolution/development_and_evaluation_option/${data.id}`, data.data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при редактировании записи о развитии и оценке животного",
							});
						} else {
							notify({
								text: "Запись о развитии и оценке животного успешно отредактирована",
							});
						}
					})
		},
		async removeDevelopmentOptionResult({ state, dispatch, commit }, data) {
			dispatch('setLoading', true);
			await http
				.delete(`/event/evolution/development_and_evaluation_option/${data.id}`)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при удалении записи о развитии и оценке животного",
							});
						} else {
							const newList = [...state.listOption]?.filter(el => el.id != data?.id);
							commit('setDevelopmentOptionList', newList);
							notify({
								text: "Запись о развитии и оценке животного успешно удалена",
							});
						}
					})
		},
		async getDevelopmentList({ state, dispatch }, data) {
			dispatch('setLoading', true);
			// ?paginate[page]=2&paginate[per_page]=100
			await http
				// .get(`/event/evolution/development_and_evaluation?filters[animal][]=${data.id}`)
				.get(`/event/evolution/development_and_evaluation/${data.id}`)
					.then((res) => {
						state.list = res.data.data;
						dispatch('setLoading', false);
				});
		},
		async setDevelopmentResult({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.post('/event/evolution/development_and_evaluation', data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при добавлении записи о развитии и оценке животного",
							});
						} else {
							notify({
								text: "Запись о развитии и оценке животного успешно добавлена",
							});
						}
					})
		},
		async changeDevelopmentResult({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.put(`/event/evolution/development_and_evaluation/${data.id}`, data.data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при редактировании записи о развитии и оценке животного",
							});
						} else {
							notify({
								text: "Запись о развитии и оценке животного успешно отредактирована",
							});
						}
					})
		},

		async getDevelopmentExteriorList({ state, dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.get(`/event/evolution/linear_assessment_exterior?filters[animal][]=${data.animal_id}`)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (!res?.data?.data?.data) {
							notify({
									text: "Произошла ошибка при загрузке спиcка результатов линейной оценки экстерьера животного",
							});
						} else {
							state.exteriorList = res.data.data.data;
						}
					})
		},
		async setDevelopmentExteriorResult({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.post('/event/evolution/linear_assessment_exterior', data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при регистрации результата линейной оценки экстерьера животного",
							});
						} else {
							notify({
								text: "Результат линейной оценки экстерьера животного успешно зарегистрирован",
							});
						}
					})
		},
		async changeDevelopmentExteriorResult({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.put(`/event/evolution/linear_assessment_exterior/${data.id}`, data.data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при редактировании результата линейной оценки экстерьера животного",
							});
						} else {
							notify({
								text: "Результат линейной оценки экстерьера животного успешно отредактирован",
							});
						}
					})
		},

		async getDevelopmentExtraList({ state, dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.get(`/event/evolution/additional_signs/?filters[animal][]=${data.animal_id}`)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (!res?.data?.data?.data) {
								notify({
										text: "Произошла ошибка при загрузке спиcка результатов оценки дополнительных признаков животного",
								});
						} else {
							state.extraList = res.data.data.data;
						}
					})
		},
		async setDevelopmentExtraResult({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.post('/event/evolution/additional_signs', data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при регистрации результата оценки дополнительных признаков животного",
							});
						} else {
							notify({
								text: "Результат оценки дополнительных признаков животного успешно зарегистрирован",
							});
						}
					})
		},
		async changeDevelopmentExtraResult({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.put(`/event/evolution/additional_signs/${data.id}`, data.data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при редактировании результата оценки дополнительных признаков животного",
							});
						} else {
							notify({
								text: "Результат оценки дополнительных признаков животного успешно отредактирован",
							});
						}
					})
		},
		async getDevelopmentDefectList({ dispatch, commit }, data) {
			dispatch('setLoading', true);
			await http
				.get(`/event/vice_and_lack?filters[animal][]=${data.animal_id}`)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (!res?.data?.data?.data) {
							notify({
								text: "Произошла ошибка при запросе списка записей о пороках и недостатках животного",
							});
						} else {
							commit('setDevelopmentDefectList', res.data.data.data);
						}
					})
		},
		async setDevelopmentDefect({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.post('/event/vice_and_lack', data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при добавлении записи о пороках и недостатках животного",
							});
						} else {
							notify({
								text: "Запись о пороках и недостатках животного успешно добавлена",
							});
						}
					})
		},
		async changeDevelopmentDefect({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.put(`/event/vice_and_lack/${data.id}`, data.data)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						notify({
							text: "Произошла ошибка при редактировании записи о пороках и недостатках животного",
						});
					} else {
						notify({
							text: "Запись о пороках и недостатках животного успешно отредактирована",
						});
					}
				})
		},
		async removeDevelopmentDefect({ state, dispatch, commit }, data) {
			dispatch('setLoading', true);
			await http
				.delete(`/event/vice_and_lack/${data.id}`)
					.then((res) => {
							dispatch('setLoading', false);
							return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при удалении записи о пороках и недостатках животного",
							});
						} else {
							const newList = [...state.defectList]?.filter(el => el.id != data?.id);
							commit('setDevelopmentDefectList', newList);
							notify({
								text: "Запись о пороках и недостатках животного успешно удалена",
							});
						}
					})
		},
		// Конечности
		async getDevelopmentLimbList({ dispatch, commit }, data) {
			dispatch('setLoading', true);
			await http
				.get(`/event/limb?filters[animal][]=${data.id}`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (!res?.data?.data?.data) {
						notify({
							text: "Произошла ошибка при загрузке спиcка результатов оценки конечности животного",
						});
					} else {
						commit('setDevelopmentLimbList', res.data.data.data);
					}
				})
		},
		async setDevelopmentLimb({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.post('/event/limb', data)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						notify({
							text: "Произошла ошибка при регистрации результата оценки конечности животного",
						});
					} else {
						notify({
							text: "Результат оценки конечности животного успешно зарегистрирован",
						});
					}
				})
		},
		async changeDevelopmentLimb({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.put(`/event/limb/${data.id}`, data.data)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						notify({
							text: "Произошла ошибка при редактировании результата оценки конечности животного",
						});
					} else {
						notify({
							text: "Результат оценки конечности животного успешно отредактирован",
						});
					}
				})
		},
		async removeDevelopmentLimb({state, dispatch, commit}, data) {
			dispatch('setLoading', true);
			http.delete(`/event/limb/${data.id}`)
			.then((res) => {
				dispatch('setLoading', false);
				return res;
			})
			.then((res) => {
				if (res?.data?.errors) {
						notify({
								text: "Произошла ошибка при удалении результата оценки конечности по животному",
						});
				} else {
						const newList = [...state.limbList]?.filter(el => el.id != data?.id);
						commit('setDevelopmentLimbList', newList);
						notify({
								text: "Результат оценки конечности по животному успешно удален",
							});
						}
				})
		},
		// Вымя
		async getDevelopmentUdderList({ dispatch, commit }, data) {
			dispatch('setLoading', true);
			await http
				.get(`/event/evolution/udder?filters[animal][]=${data.animal_id}`)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (!res?.data?.data?.data) {
							notify({
								text: "Произошла ошибка при загрузке спиcка результатов оценки вымени животного",
							});
						} else {
							commit('setDevelopmentUdderList', res.data.data.data);
						}
					})
		},
		async setDevelopmentUdder({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.post('/event/evolution/udder', data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при регистрации результата оценки вымени животного",
							});
						} else {
							notify({
								text: "Результат оценки вымени животного успешно зарегистрирован",
							});
						}
					})
		},
		async changeDevelopmentUdder({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.put(`/event/evolution/udder/${data.id}`, data.data)
					.then((res) => {
						dispatch('setLoading', false);
						return res;
					})
					.then((res) => {
						if (res?.data?.errors) {
							notify({
								text: "Произошла ошибка при редактировании результата оценки вымени животного",
							});
						} else {
							notify({
								text: "Результат оценки вымени животного успешно отредактирован",
							});
						}
					})
		},
		async removeDevelopmentUdder({state, dispatch, commit}, data) {
			dispatch('setLoading', true);
			http.delete(`/event/evolution/udder/${data.id}`)
			.then((res) => {
					dispatch('setLoading', false);
					return res;
			})
			.then((res) => {
					if (res?.data?.errors) {
							notify({
									text: "Произошла ошибка при удалении результата оценки вымени по животному",
							});
					} else {
							const newList = [...state.udderList]?.filter(el => el.id != data?.id);
							commit('setDevelopmentUdderList', newList);
							notify({
									text: "Результат оценки вымени по животному успешно удален",
							});
					}
			})
		},

		// Стобальная оценка

		async getExteriorAssessmentList({ dispatch, commit }, data) {
			dispatch('setLoading', true);
			await http
				.get(`/event/exterior_assessment?filters[animal][]=${data.id}`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (!res?.data?.data?.data) {
						notify({
							text: "Произошла ошибка при загрузке спиcка результатов стобальной оценки животного",
						});
					} else {
						commit('setExteriorAssessmentList', res.data.data.data);
					}
				})
		},
		async setExteriorAssessment({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.post('/event/exterior_assessment', data)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						notify({
							text: "Произошла ошибка при регистрации результата стобальной оценки животного",
						});
					} else {
						notify({
							text: "Результат стобальной оценки животного успешно зарегистрирован",
						});
					}
				})
		},
		async changeExteriorAssessment({ dispatch }, data) {
			dispatch('setLoading', true);
			await http
				.put(`/event/exterior_assessment/${data.id}`, data.data)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						notify({
							text: "Произошла ошибка при редактировании результата оценки конечности животного",
						});
					} else {
						notify({
							text: "Результат оценки конечности животного успешно отредактирован",
						});
					}
				})
		},
		async removeExteriorAssessment({state, dispatch, commit}, data) {
			dispatch('setLoading', true);
			http.delete(`/event/exterior_assessment/${data.id}`)
				.then((res) => {
					dispatch('setLoading', false);
					return res;
				})
				.then((res) => {
					if (res?.data?.errors) {
						notify({
							text: "Произошла ошибка при удалении результата стобальной оценки животному",
						});
					} else {
						const newList = [...state.exteriorAssessmentList]?.filter(el => el.id != data?.id);
						commit('setExteriorAssessmentList', newList);
						notify({
							text: "Результат стобальной оценки по животному успешно удален",
						});
					}
				})
		},

		//
		setDevelopmentOptionList({commit}, data) {
			commit('setDevelopmentOptionList', data);
		},
		setDevelopmentDefectList({commit}, data) {
			commit('setDevelopmentDefectList', data);
		},
		setDevelopmentDefectDetailed({commit}, data) {
			commit('setDevelopmentDefectDetailed', data);
		},
		setDevelopmentLimbList({commit}, data) {
			commit('setDevelopmentLimbList', data);
		},
		setDevelopmentUdderList({commit}, data) {
			commit('setDevelopmentUdderList', data);
		},
		setExteriorAssessmentList({commit}, data) {
			commit('setExteriorAssessmentList', data);
		}
	},
};
