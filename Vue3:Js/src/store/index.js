import { createStore } from 'vuex';
import { permissionModule, loading, breadCrumbs, registry, directory, events, productivity, reproduction, laboratory, health, auth, origin, development } from '@/store/modules/index.js';

export default createStore({
	modules: {
		permission: permissionModule,
		loading,
		registry,
		development
	},
});
