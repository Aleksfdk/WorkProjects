import * as Constants from './constants';

export const getCowCard = data => {
  return {
    type: Constants.getCowCard,
    payload: data,
  };
};

export const getDetailedCowCard = data => {
  return {
    type: Constants.getDetailedCowCard,
    payload: data,
  };
};

export const getTagCowCard = data => {
  return {
    type: Constants.getTagCowCard,
    payload: data,
  };
};

export const getTagsCheck = data => {
  return {
    type: Constants.getTagsCheck,
    payload: data,
  };
};

export const resetCowCardRegistry = () => {
  return {
    type: Constants.resetCowCardRegistry,
  };
};
