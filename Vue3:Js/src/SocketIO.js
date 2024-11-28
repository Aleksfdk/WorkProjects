import { io } from 'socket.io-client'
import store from "@/store/index.js";

export default {
    install: (app) => {
            console.log('localStorage.getItem(\'token\')', localStorage.getItem('token'));
            let config = {
                connection: 'https://dap.stageogip.ru:3000',
                options: {
                    extraHeaders: {
                        Authorization: localStorage.getItem('token'),
                    },
                    vuex: {
                        store,
                        // actionPrefix: 'SOCKET_',
                        // mutationPrefix: 'SOCKET_'
                    },
                },
            };

            const socket = io(config.connection, config.options);
            app.config.globalProperties.$socket = socket;

            app.provide('socket', socket);

    },
}