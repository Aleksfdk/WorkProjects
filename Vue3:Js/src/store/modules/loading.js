export const loading = {
    state: () => ({
        loading: false,
    }),
    getters: {
        getLoading(state) {
            return state.loading;
        }
    },
    mutations: {
        setLoading(state, data) {
            state.loading = data;
        }
    },
    actions: {
        setLoading({commit}, data) {
            commit('setLoading', data);
        }
    },
}