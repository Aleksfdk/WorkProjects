

export default {
    data() {
        return {
            mask: {
                phone: ''
            }
        }
    },
    mounted(el) {
        el.addEventListener('change', () => {
           el.mask('978-999-99-99', {placeholder: "+7-969-999-99-99" });
        });
    },
    name: 'masktest',
}