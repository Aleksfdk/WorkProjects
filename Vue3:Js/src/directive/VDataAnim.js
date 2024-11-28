export default {
    mounted(el) {
        const anim = () => {
           return  setInterval(() => {
               el.style.transition = '0.3s all ease-in';
               if(el.style.bottom === '5px') {
                   el.style.bottom = '0px';
               }  else {
                   el.style.bottom = '5px';
               }
            }, 300)
        }

        requestAnimationFrame(anim);
    },

    name: 'dataAnim',
}