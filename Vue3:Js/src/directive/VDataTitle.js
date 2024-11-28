export default {
    mounted(el) {
       const elementText = el.innerText;
       
       if (elementText.length >= 20) {
           const subElementText = elementText.substring(0, 15) + '...';
           el.innerText = subElementText;
           el.setAttribute('data-title', elementText);
       }
    },

    name: 'dataTitle',
}
