import axios from 'axios';
import { notify } from "@kyvg/vue3-notification";

export default {
    get: async (link) => {
        try {
            let token = localStorage.getItem('token');
            return await axios.get('https://test.ru/api' + link, {
                headers: {
                    "Authorization": token,
                    "Content-type": "application/json"
                },
            })
                .then(response => {
                    return response;
                })
        } catch (err) {
            if (err?.response?.status === 401) {
                return await axios.get('https://test.ru/api/link/auth', {
                    headers: {
                        "Content-type": "application/json"
                    },
                }).then(response => {
                    return window.location.href = response.data.data.link;
                })
            }
            if (err?.response?.data?.message?.toLowerCase()?.indexOf('too many attempts') !== -1) {
				notify({
                    text: "Ошибка соединения: поступает слишком много запросов",
                    ignoreDuplicates: true
                })
            }
            return err?.response;
        }
    },

    post: async (link, data) => {
        try {
            let token = localStorage.getItem('token');
            return await axios.post('https://test.ru/api' + link, data, {
                headers: {
                    "Authorization": token,
                    "Content-type": "application/json"
                },
            }).then(response => {
                return response;
            });
        } catch (err) {
            if (err?.response?.status === 401) {
                return await axios.get('https://test.ru/auth/link/auth', {
                    headers: {
                        "Content-type": "application/json"
                    },
                }).then(response => {
                    return window.location.href = response.data.data.link;
                })

            }
            if (err?.response?.data?.message?.toLowerCase()?.indexOf('too many attempts') !== -1) {
				notify({
                    text: "Ошибка соединения: поступает слишком много запросов",
                    ignoreDuplicates: true
                })
            }
            return err?.response;
        }
    },

    put: async (link, data) => {
        try {
            let token = localStorage.getItem('token');
            return await axios.put('https://test.ru/api' + link, data, {
                headers: {
                    "Authorization": token,
                    "Content-type": "application/json"
                },
            }).then(response => {
                return response;
            });
        } catch (err) {
            if (err?.response?.status === 401) {
                return await axios.get('https://test.ru/api/link/auth', {
                    headers: {
                        "Content-type": "application/json"
                    },
                }).then(response => {
                    return window.location.href = response.data.data.link;
                })
            }
            if (err?.response?.data?.message?.toLowerCase()?.indexOf('too many attempts') !== -1) {
				notify({
                    text: "Ошибка соединения: поступает слишком много запросов",
                    ignoreDuplicates: true
                })
            }
            return err?.response;
        }
    },
    delete: async (link, data) => {
        try {
            let token = localStorage.getItem('token');
            return await axios.delete('https://test.ru/api' + link, {
                headers: {
                    "Authorization": token,
                    "Content-type": "application/json"
                },
                data: data,
            }).then(response => {
                return response;
            });
        } catch (err) {
            if (err?.response?.status === 401) {
                return await axios.get('https://test.ru/api/link/auth', {
                    headers: {
                        "Content-type": "application/json"
                    },
                }).then(response => {
                   return window.location.href = response.data.data.link;
                })

            }
            if (err?.response?.data?.message?.toLowerCase()?.indexOf('too many attempts') !== -1) {
				notify({
                    text: "Ошибка соединения: поступает слишком много запросов",
                    ignoreDuplicates: true
                })
            }
            return err?.response;
        }
    }
}
