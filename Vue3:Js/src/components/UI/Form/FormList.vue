<template>
	<form :data-form-name="formName" :data-can-clear="canClear" novalidate @submit="onSubmitForm">
		<slot></slot>
	</form>
</template>

<script>
import './style.scss';
import moment from 'moment';

export default {
	name: 'FormList',
	props: {
    formName: {
      type: String,
      default: '',
    },
		// Разрешиить отправку данных, если форма
		// не содержит значений после formClear
    canClear: {
      type: Boolean,
      default: false,
    },
		onSubmit: {
			type: Function,
			default: () => false,
		},
	},
	data() {
		return {
			data: [],
		};
	},
	watch: {
		data(newValue) {
			console.log('newValue', newValue);
		},
	},
	mounted() {},
	methods: {
		onSubmitForm(e) {
			e.preventDefault();

			// const form = document.querySelector('form');
			// let input = document.querySelectorAll('input');
			let formsList = document.querySelectorAll('form');
      let formsListArr = Array.from(formsList);
      let form = formsListArr.filter(item => item.dataset.formName === this.formName)[0];

      let input = form.querySelectorAll('input');
			let newForm = {};
			// данные в массив попадают до начала заполнения полей
			let requiredFields = [];
			// данные в массив попадают после начала заполнения полей
			let invalidFields = [];
			let inputList = [];
			for (let item of input) {
				inputList.push(item);
			}
			let inputListFilter = inputList.filter((item) => item.attributes[1].nodeValue !== 'radio');

			inputListFilter.map((item) => {
        let name = item.getAttribute('name');
        const type = item.getAttribute('type');
        let id = item.id;
        let value = item.value;
        let isRequired = item.getAttribute('data-isRequired');
        let isValid = item.getAttribute('data-isValid');

				if (isValid !== 'true') {
					invalidFields.push(name);
				}

				if (isRequired === 'true') {
					if (item?.offsetParent?.className.indexOf('select-group') === -1) {
						if (value === '') {
							requiredFields.push(name);
						}
					} else {
						if (id === '' || id === 'false') {
							requiredFields.push(name);
						}
					}
				}

				if (name) {
					if (item?.offsetParent?.className.indexOf('select-group') === -1) {
            if (form.dataset.canClear === 'true' || value != '' || value != false) {
							if (type === 'number') {
								newForm[name] = Number(value);
							} else {
								newForm[name] = value;
							}
            }
          } else {
            if (id != 'false') {
              newForm[name] = Number(id)
            }
          }
					// ? (newForm[name] = value)
					// : (newForm[name] = id);
				}
			});

			const getMessage = () => {
				let message = 'Поля заполнены некорректно';
				if (requiredFields.length > 0 && invalidFields.length === 0) {
					message = 'Вы не заполнили обязательные поля';
				}
				return message;
			}

			const validateForm = {
				status: requiredFields.length > 0 || invalidFields.length > 0,
				fields: [...new Set([...requiredFields, ...invalidFields])],
				message: getMessage()
			};

			const formClear = () => this.onClearForm(e);
			this.onSubmit(newForm, validateForm, formClear);
		},
		onClearForm(e) {
			e.preventDefault();
      let formsList = document.querySelectorAll('form');
      let formsListArr = Array.from(formsList);
      let form = formsListArr.filter(item => item.dataset.formName === this.formName)[0];

      // form.reset();
      form.querySelectorAll('input').forEach( field => {
        const type = field.dataset.datatype;
				if (type == 'date') {
					field.value = moment(new Date()).format('YYYY-MM-DD');
				} else {
					field.text = '';
					field.value = '';
				}
			});
		},
	},
};
</script>

<style scoped></style>
