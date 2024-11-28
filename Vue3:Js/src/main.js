import { createApp } from 'vue';
import App from './App.vue';
import componentsUI from '@/components/UI';
import store from '@/store/index.js';
import '@/assets/fonts/font.css';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import {
	MdArrowbackiosRound,
	MdCloseRound,
	MdKeyboardarrowdownRound,
	MdClose,
	RiHome4Line,
	CoHackhands,
	IoNotificationsOutline,
	BiQuestionLg,
	BiBagPlus,
	FaUserAlt,
	PrSortAlt,
	HiArrowNarrowUp,
	HiArrowNarrowDown,
	HiFilter,
	RiSearchLine,
	BiCheckLg,
	IoClose,
	HiSolidCheck,
	HiDocumentReport,
} from 'oh-vue-icons/icons';
import directives from '@/directive/index.js';
import VueTheMask from 'vue-the-mask';
import 'v-calendar/dist/style.css';
import VCalendar from 'v-calendar';
import router from '@/router/router.js';
import vClickOutside from 'click-outside-vue3';
import Notifications from '@kyvg/vue3-notification';

addIcons(
	MdArrowbackiosRound,
	MdCloseRound,
	MdKeyboardarrowdownRound,
	MdClose,
	RiHome4Line,
	CoHackhands,
	IoNotificationsOutline,
	BiQuestionLg,
	BiBagPlus,
	FaUserAlt,
	PrSortAlt,
	HiArrowNarrowUp,
	HiArrowNarrowDown,
	HiFilter,
	RiSearchLine,
	BiCheckLg,
	IoClose,
	HiSolidCheck,
	HiDocumentReport,
);
const app = createApp(App);

directives.forEach((directiveItem) => {
	app.directive(directiveItem.name, directiveItem);
});

componentsUI.forEach((component) => {
	app.component(component.name, component);
});

app.component('VIcon', OhVueIcon);
app.component('PulseLoader', PulseLoader);


app.use(router)
	.use(store)
	.use(Notifications)
	.use(VueTheMask)
	.use(VCalendar)
	.use(vClickOutside)
	.mount('#app');
