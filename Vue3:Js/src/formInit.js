export const formInit = (formName, data) => {
    let formsList = document.querySelectorAll('form');
    let formsListArr = Array.from(formsList);
    let form = formsListArr.filter(item => item.dataset.formName === formName)[0];

    let input = form.querySelectorAll('input');
    for (let item of input) {
        if(data[item.name]) {
            item.value = data[item.name];
            // Если данные меняются динамически скриптом, 
            // value в InputGroup не отслеживается через v-model и watch
            // нужен dispatchEvent
            item.dispatchEvent(new Event('input'));
            item.dispatchEvent(new Event('change'));
        }
    }
}

export const formClear = (formName) => {
    let formsList = document.querySelectorAll('form');
    let formsListArr = Array.from(formsList);
    let form = formsListArr.filter(item => item.dataset.formName === formName)[0];

    let input = form.querySelectorAll('input');
    for (let item of input) {
            item.value = '';
            // Если данные меняются динамически скриптом, 
            // value в InputGroup не отслеживается через v-model и watch
            // нужен dispatchEvent
            item.dispatchEvent(new Event('input'));
            item.dispatchEvent(new Event('change'));
    }
}