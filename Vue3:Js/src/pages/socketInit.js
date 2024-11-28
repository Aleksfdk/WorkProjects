import store from "@/store/index.js";
import {io} from "socket.io-client";

let config = {
    connection: 'https://test.ru:3000',
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

export const socket = io(config.connection, config.options);
