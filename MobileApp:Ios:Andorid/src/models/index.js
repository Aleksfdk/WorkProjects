import {combineReducers} from 'redux';

import scanner from './scanner/reducer';

const modules = [scanner];

export default modules;

export const reducers = combineReducers(
  modules.reduce(
    (previousValue, {reducers, options}) =>
      reducers ? {...previousValue, [options.name]: reducers} : previousValue,
    {},
  ),
);
