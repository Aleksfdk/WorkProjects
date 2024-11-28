import * as Constants from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {};

const storeRegistry = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@registry', jsonValue);
  } catch (e) {
   console.error(e);
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.getCowCard:
      storeRegistry(action.payload.data);
      return action.payload;
    case Constants.resetCowCardRegistry:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
