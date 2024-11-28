<template>
	<div class="add-animal">
		<div class="add-animal__header">
			<p class="add-animal__header-title">Добавление животного</p>
			<button-round-group :click="() => $router.push('/')" :type="'round-arrow-back'"></button-round-group>
		</div>
		<FormList :on-submit="onSubmit" :form-name="'ADD_ANIMAL_FORM'">
			<div class="add-animal__form">
				<form-line>
					<div class="form-col">
						<form-item :required="true">Дата добавления</form-item>
						<input-date
							:width="'100%'"
							name="addition_date"
							:on-change="() => true"
							:on-clear="() => true"
							:is-required="true"
							:max-date="new Date()"
							size="small"
						/>
					</div>
				</form-line>
				<form-line>
					<div class="form-col">
						<div class="add-animal__form-item__type-radio">
							<form-item :required="true">Тип животного</form-item>
							<div class="add-animal__radio-group">
								<radio-button :active="keys[0]" :on-change="(value) => handleClick(value, 0, 2)"
									>Племенное</radio-button
								>
								<radio-button :active="keys[1]" :on-change="(value) => handleClick(value, 1, 1)"
									>Товарное</radio-button
								>
							</div>
						</div>
					</div>
					<div class="form-col">
						<form-item :required="true">Хозяйство</form-item>
						<select-group
							:width="'100%'"
							name="farm_id"
							:options="farm"
							:sub-title="{ visible: true, title: 'inn' }"
							:is-required="true"
						/>
					</div>
				</form-line>
				<form-line>
					<div class="form-col">
						<form-item :required="true">Национальный идентификационный номер</form-item>
						<input-group
							:width="'100%'"
							name="national_id"
							:maxlength="11"
							:on-change="() => true"
							:on-clear="() => true"
							:is-required="true"
							size="small"
						/>
					</div>
					<div class="form-col">
						<form-item>Кличка животного</form-item>
						<input-group
							:width="'100%'"
							:val="'Не назначено'"
							name="name"
							:on-change="() => true"
							:on-clear="() => true"
							size="small"
						/>
					</div>
				</form-line>
				<form-line>
					<div class="form-col">
						<form-item>Место рождения животного</form-item>
						<input-group
							:width="'100%'"
							name="born_place"
							:on-change="() => true"
							:on-clear="() => true"
							size="small"
						/>
					</div>
					<div class="form-col">
						<form-item :required="true">Дата рождения животного</form-item>
						<input-date
							:width="'100%'"
							name="born_date"
							:on-change="() => true"
							:on-clear="() => true"
							:is-required="true"
							:max-date="new Date()"
							size="small"
						/>
					</div>
				</form-line>
				<form-line>
					<div class="form-col">
						<form-item :required="true">Половозрастная группа</form-item>
						<select-group
							:width="'100%'"
							name="gender_group"
							:options="[
								{ id: 1, name: 'Корова' },
								{ id: 2, name: 'Бык' },
							]"
							:is-required="true"
							:on-change="(value) => (genderGroup = value?.id)"
						/>
					</div>
					<div class="form-col">
						<form-item :required="true">Назначение животного</form-item>
						<select-group
							:width="'100%'"
							name="assignment_id"
							:options="assignmentOptions"
							:is-required="true"
							:is-disabled="!genderGroup"
							:disabled-text="'Для формирования списка укажите половозрастную группу животного'"
						/>
					</div>
				</form-line>
				<form-line>
					<div class="form-col">
						<form-item :required="true">Порода</form-item>
						<select-group
							:search-list="true"
							:width="'100%'"
							name="breed_id"
							:options="breed"
							:on-pagination="(value) => onPagination(value)"
							:pages="breedPagination.pages"
							:total="breedPagination?.total"
							:per-page="(value) => onPerPage(value)"
              :on-search="(value) => onGetBreedSearch(value)"
							:is-required="true"
						/>
					</div>
					<div class="form-col">
						<form-item :required="true">Масть</form-item>
						<select-group :width="'100%'" name="suit_id" :options="suit" :is-required="true" />
					</div>
				</form-line>

				<form-line>
					<div class="form-col">
						<form-item>Линия</form-item>
						<select-group :width="'100%'" name="line_id" :options="line" />
					</div>
					<div class="form-col">
						<form-item :required="true">Живая масса</form-item>
						<input-group
							:width="'100%'"
							name="weight"
							:is-required="true"
							:type="'number'"
							:min="0"
							:max="2000"
							:on-change="() => true"
							:on-clear="() => true"
							size="small"
						/>
					</div>
				</form-line>

				<form-line>
					<div class="form-col">
						<form-item>Мать</form-item>
						<input-group
							:width="'100%'"
							name="mother_id"
							:maxlength="11"
							:on-change="() => true"
							:on-clear="() => true"
							:is-check-default="isMotherError"
							:is-highlight="isMotherError"
							size="small"
						/>
					</div>
					<div class="form-col">
						<form-item>Отец</form-item>
						<input-group
							:width="'100%'"
							name="father_id"
							:maxlength="11"
							:on-change="() => true"
							:on-clear="() => true"
							:is-check-default="isFatherError"
							:is-highlight="isFatherError"
							size="small"
						/>
					</div>
				</form-line>

				<form-line v-if="typeAnimal === 2">
					<div class="form-col">
						<form-item>Достоверность происхождения</form-item>
						<select-group :width="'100%'" name="authenticity_origin_id" :options="authenticity" />
					</div>
					<div class="form-col">
						<form-item>Группа крови/микросателлитный анализ</form-item>
						<input-group
							:width="'100%'"
							name="blood_group"
							:on-change="() => true"
							:on-clear="() => true"
							size="small"
						/>
					</div>
				</form-line>

				<form-line v-if="typeAnimal === 2">
					<div class="form-col">
						<form-item>Улучшающая порода</form-item>
						<select-group :width="'100%'" name="improving_breed_id" :options="improving" />
					</div>
					<div class="form-col">
						<form-item>Кровность улучшающей породы</form-item>
						<input-group
							:width="'100%'"
							name="bloodline"
							:type="'number'"
							:min="0"
							:max="100"
							:on-change="() => true"
							:on-clear="() => true"
							size="small"
						/>
					</div>
				</form-line>


			</div>
			<div class="add-animal__footer">
				<button-group :size="'small'" :type="'secondary'" @click.stop="onCancel">Отмена</button-group>
				<button-group :submit="'submit'" :size="'small'">Применить</button-group>
			</div>
		</FormList>

	</div>
</template>

<script>
import './style.scss';
import FormItem from '@/components/UI/Form/FormItem.vue';
import ButtonGroup from '@/components/UI/ButtonGroup.vue';
import FormList from '@/components/UI/Form/FormList.vue';
import { mapState, mapActions } from 'vuex';
import FormLine from '@/components/UI/Form/FormLine.vue';
import { notify } from '@kyvg/vue3-notification';
import { assignmentByGenderGroup } from '../data.js';

export default {
	name: 'AddAnimal',
	components: { FormLine, FormList, ButtonGroup, FormItem },
	data() {
		return {
			keys: [true, false],
			typeAnimal: 2,
			genderGroup: false,
		};
	},
	computed: {
		...mapState({
			farm: (state) => state.directory.farm,
			line: (state) => state.directory.line,
			breed: (state) => state.directory.breed,
			breedPagination: (state) => state.directory.breedPagination,
			suit: (state) => state.directory.suit,
			authenticity: (state) => state.directory.authenticity,
			assignment: (state) => state.directory.assignment,
			improving: (state) => state.directory.improving,
			disease: (state) => state.directory.disease,
			isMotherError: (state) => state.registry.isMotherError,
			isFatherError: (state) => state.registry.isFatherError,
			isNationalIdError: (state) => state.registry.isNationalIdError,
		}),
		assignmentOptions() {
			if (this.assignment && this.genderGroup) {
				const assignmentList = assignmentByGenderGroup(this.genderGroup);
				return this.assignment?.filter((el) => assignmentList?.includes(el?.name?.toLowerCase()));
			} else {
				return [];
			}
		},
	},
	mounted() {
		this.$store.commit('setBreadCrumbs', [
			{
				title: 'Цифровой паспорт животного',
				to: '/',
			},
			{
				title: 'Добавление животного',
				to: '/addanimal',
			},
		]);

		this.getDirectoryFarm();
		this.getDirectoryLine();
		this.getDirectoryBreedPagination({ page: 1, perPage: 6 });
		this.getDirectorySuit();
		this.getDirectoryAuthenticity();
		this.getDirectoryAssignment();
		this.getDirectoryImproving();
		this.getDirectoryDisease();
	},
	methods: {
		...mapActions({
			getDirectoryFarm: 'getDirectoryFarm',
			getDirectoryLine: 'getDirectoryLine',
			getDirectoryBreed: 'getDirectoryBreed',
			getDirectoryBreedPagination: 'getDirectoryBreedPagination',
			getBreedSearch: 'getBreedSearch',
			getDirectorySuit: 'getDirectorySuit',
			getDirectoryAuthenticity: 'getDirectoryAuthenticity',
			getDirectoryAssignment: 'getDirectoryAssignment',
			getDirectoryImproving: 'getDirectoryImproving',
			getDirectoryDisease: 'getDirectoryDisease',
			setRegistryAnimal: 'setRegistryAnimal',
			checkRelativeNationalId: 'checkRelativeNationalId',
			setIsMotherError: 'setIsMotherError',
			setIsFatherError: 'setIsFatherError',
		}),
		handleClick(value, i, type) {
			if (value) {
				this.typeAnimal = type;
				this.keys.map((item, index) => {
					if (index == i) {
						this.keys[index] = true;
					} else {
						this.keys[index] = false;
					}
				});
			}
		},
		async onSubmit(values, validateForm, formClear) {
			await this.checkRelatives(values);
			values.type = this.typeAnimal;

			if (!this.isMotherError && !this.isFatherError) {
				if (!validateForm.status) {
					await this.setRegistryAnimal(values).then(() => {
						if (!this.isNationalIdError) {
							formClear && formClear();
							this.$router.push('/');
						}
					});
				} else {
					notify({
						text: validateForm.message,
					});
				}
			}
		},
		onCancel() {
			this.setIsMotherError(false);
			this.setIsFatherError(false);
			this.$router.push('/');
		},
		async checkRelatives(values) {
			if (values?.mother_id) {
				await this.checkRelativeNationalId({ national_id: values.mother_id, gender_group: 1 });
			} else {
				this.setIsMotherError(false);
			}

			if (values?.father_id) {
				await this.checkRelativeNationalId({ national_id: values.father_id, gender_group: 2 });
			} else {
				this.setIsFatherError(false);
			}

			if (!values.mother_id) {
				values.mother_id = null;
			}
			if (!values.father_id) {
				values.father_id = null;
			}
		},
		onPagination(value) {
			this.getDirectoryBreedPagination({ page: value, perPage: 6});
		},
		onPerPage() {
			this.getDirectoryBreedPagination({ page: 1, perPage: 6 });
		},
		onGetBreedSearch(value) {
			this.getBreedSearch({ search: value });
		},
	},
};
</script>

<style scoped></style>
