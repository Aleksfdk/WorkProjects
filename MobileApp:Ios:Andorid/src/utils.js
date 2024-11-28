import React from 'react';
import axios from 'axios';
import {KJUR} from 'jsrsasign';
import {isLoading} from './models/loading/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setNotification} from '../src/models/notification/action';
import notificationMessage from './notificationMessage';
// import Sqlite from 'react-native-sqlite-storage';
import moment from 'moment';

const getStorageData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const dateToken = await AsyncStorage.getItem('dateToken');
    const host = await AsyncStorage.getItem('hostFarm');
    return {token, refreshToken, dateToken, host};
  } catch (e) {
    // error reading value
  }
};

export const getRequest = (url, action) => {
  return async dispatch => {
    dispatch(isLoading({state: true}));
    await getStorageData().then(async asyncStorage => {
      const {token, refreshToken, dateToken, host} = asyncStorage;

      const hostFarm = host + url;
      const currentDate = moment.unix(dateToken).utc().add(1, 'days').utc();
      const checkToken = moment.utc().isSameOrBefore(currentDate);
      const generateToken = checkToken ? await token : await refreshToken;

      await axios({
        method: 'get',
        url: hostFarm,
        headers: {
          token: generateToken,
        },
      })
        .then(async response => {
          return await Promise.resolve(
            dispatch(action({data: response.data, isAuth: true})),
          );
        })
        .then(() => {
          notificationMessage.map(item => {
            if (item.title == action.name) {
              dispatch(setNotification({isActive: true, info: item.success}));
            }
          });
          dispatch(isLoading({state: false}));
        })
        .catch(async error => {
          console.log('errorConsole', error);
          notificationMessage.map(item => {
            if (item.title == action.name) {
              dispatch(setNotification({isActive: true, info: item.error}));
            }
          });
          dispatch(isLoading({state: false}));
          return await Promise.resolve(dispatch(action({isAuth: false})));
        });
    });
  };
};

export const getBodyRequest = (url, action, data) => {
  return async dispatch => {
    dispatch(isLoading({state: true}));
    await getStorageData().then(async asyncStorage => {
      const {token, refreshToken, dateToken, host} = asyncStorage;

      const hostFarm = host + url;
      const currentDate = moment.unix(dateToken).utc().add(1, 'days').utc();
      const checkToken = moment.utc().isSameOrBefore(currentDate);
      const generateToken = checkToken ? await token : await refreshToken;

      await axios({
        method: 'get',
        url: hostFarm,
        body: data,
        headers: {
          token: generateToken,
        },
      })
        .then(async response => {
          return await Promise.resolve(
            dispatch(action({data: response.data, isAuth: true})),
          );
        })
        .then(() => {
          notificationMessage.map(item => {
            if (item.title == action.name) {
              dispatch(setNotification({isActive: true, info: item.success}));
            }
          });
          dispatch(isLoading({state: false}));
        })
        .catch(async error => {
          console.log('errorConsole', error);
          notificationMessage.map(item => {
            if (item.title == action.name) {
              dispatch(setNotification({isActive: true, info: item.error}));
            }
          });
          dispatch(isLoading({state: false}));
          return await Promise.resolve(dispatch(action({isAuth: false})));
        });
    });
  };
};

export const postRequest = (url, action, data) => {
  return async dispatch => {
    dispatch(isLoading({state: true}));
    await getStorageData().then(async asyncStorage => {
      const {token, refreshToken, dateToken, host} = asyncStorage;

      const hostFarm = host + url;
      const currentDate = moment.unix(dateToken).utc().add(1, 'days').utc();
      const checkToken = moment.utc().isSameOrBefore(currentDate);
      const generateToken = checkToken ? await token : await refreshToken;

      await axios({
        method: 'post',
        url: hostFarm,
        data: data,
        headers: {
          token: generateToken,
        },
      })
        .then(async response => {
          return await Promise.resolve(
            dispatch(action({data: response.data, isAuth: true})),
          );
        })
        .then(() => {
          notificationMessage.map(item => {
            if (item.title == action.name) {
              dispatch(setNotification({isActive: true, info: item.success}));
            }
          });
          dispatch(isLoading({state: false}));
        })
        .catch(async error => {
          console.log('errorConsole', error);
          notificationMessage.map(item => {
            if (item.title == action.name) {
              dispatch(setNotification({isActive: true, info: item.error}));
            }
          });
          dispatch(isLoading({state: false}));
          return await Promise.resolve(dispatch(action({isAuth: false})));
        });
    });
  };
};

export const putRequest = (url, action, data) => {
  return async dispatch => {
    dispatch(isLoading({state: true}));
    await getStorageData().then(async asyncStorage => {
      const {token, refreshToken, dateToken, host} = asyncStorage;

      const hostFarm = host + url;
      const currentDate = moment.unix(dateToken).utc().add(1, 'days').utc();
      const checkToken = moment.utc().isSameOrBefore(currentDate);
      const generateToken = checkToken ? await token : await refreshToken;
      await axios({
        method: 'put',
        url: hostFarm,
        data: data,
        headers: {
          token: generateToken,
        },
      })
        .then(async response => {
          return await Promise.resolve(
            dispatch(action({data: response.data, isAuth: true})),
          );
        })
        .then(() => {
          notificationMessage.map(item => {
            if (item.title == action.name) {
              dispatch(setNotification({isActive: true, info: item.success}));
            }
          });
          dispatch(isLoading({state: false}));
        })
        .catch(async error => {
          console.log('errorConsole', error);
          notificationMessage.map(item => {
            if (item.title == action.name) {
              dispatch(setNotification({isActive: true, info: item.error}));
            }
          });
          dispatch(isLoading({state: false}));
          return await Promise.resolve(dispatch(action({isAuth: false})));
        });
    });
  };
};

export const removeRequest = (url, action, data) => {
  return async dispatch => {
    dispatch(isLoading({state: true}));
    await getStorageData().then(async asyncStorage => {
      const {token, refreshToken, dateToken, host} = asyncStorage;

      const hostFarm = host + url;
      const currentDate = moment.unix(dateToken).utc().add(1, 'days').utc();
      const checkToken = moment.utc().isSameOrBefore(currentDate);
      const generateToken = checkToken ? await token : await refreshToken;
      await axios({
        method: 'delete',
        url: hostFarm,
        data: data,
        headers: {
          token: generateToken,
        },
      })
        .then(async response => {
          return await Promise.resolve(
            dispatch(action({data: response.data, isAuth: true})),
          );
        })
        .then(() => {
          notificationMessage.map(item => {
            if (item.title == action.name) {
              dispatch(setNotification({isActive: true, info: item.success}));
            }
          });
          dispatch(isLoading({state: false}));
        })
        .catch(async error => {
          console.log('errorConsole', error);
          notificationMessage.map(item => {
            if (item.title == action.name) {
              dispatch(setNotification({isActive: true, info: item.error}));
            }
          });
          dispatch(isLoading({state: false}));
          return await Promise.resolve(dispatch(action({isAuth: false})));
        });
    });
  };
};

export const defaultAction = (action, data = []) => {
  return async dispatch => {
    return await Promise.resolve(dispatch(action(data)));
  };
};

export const validateFields = data => {
  data.map(item => {
    if (!item) {
      return dispatch =>
        dispatch(
          setNotification({
            isActive: true,
            info: {
              title: 'Обязательные поля',
              status: 'warning',
              description: 'Вы не заполнили обязатльные поля',
            },
          }),
        );
    } else {
      return true;
    }
  });
};

export const validateFormObj = value => {
  let result = true;
  for (let i in value) {
    let result = true;
    if (!value[i] || value[i] == '') {
      result = false;
    }
  }
  return Promise.resolve(result);
};

// Подключение к локальной БД и взаимодействие с ней

// const db = Sqlite.openDatabase(
//   {
//     name: 'ld_db',
//     location: 'default',
//   },
//   () => {},
//   error => {
//     console.log(error);
//   },
// );

// 'CREATE TABLE IF NOT EXISTS weighing (ID INTEGER, Tag_id INTEGER, Weight INTEGER, Date TEXT, Fatness TEXT, Method TEXT);'
export const onCreateTableDB = async sqlReq => {
  await db.transaction(tx => {
    tx.executeSql(
      sqlReq,
      [],
      (sqlTxn, result) => {
        console.log('Таблица усепшно создана');
      },
      error => {
        console.log('Ошибка создания таблицы', error);
      },
    );
  });
};

// 'INSERT INTO weighing (ID, Tag_id, Weight, Date, Fatness, Method) VALUES (?,?,?,?,?,?)'
// [1, 'RU1234566778', 250, '12.12.2022', 'testFat', 'middle']
export const onSetDataDB = async (sqlReq, arg) => {
  await db.transaction(tx => {
    tx.executeSql(
      sqlReq,
      arg,
      (sqlTxn, result) => {
        console.log('Данные успешно добавлены в таблицу');
      },
      error => {
        console.log('Произошла ошибка при доавблении данных в таблицу', error);
      },
    );
  });
};

//'SELECT ID, Tag_id, Weight, Date, Fatness, Method FROM weighing'
export const onGetDataDB = async sqlReq => {
  await db.transaction(tx => {
    tx.executeSql(sqlReq, [], (tx, result) => {
      let len = result.rows.length;
      if (len > 0) {
        // const data = result.rows.item(3);
        // console.log('data', data);
        // return data;
        let data = [];
        for (let i = 0; i < len; i++) {
          let item = result.rows.item(i);
          data.push(item);
        }
        return data;
      }
    });
  });
};
