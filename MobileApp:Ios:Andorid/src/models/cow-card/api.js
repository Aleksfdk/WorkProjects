import axios from 'axios';
import * as Constants from './constants';
import * as Action from './action';
import {
  getRequest,
  postRequest,
  putRequest,
  defaultAction,
  removeRequest, getBodyRequest,
} from '../../utils';


export const getCowCard = data =>
  getRequest('/api/test/xxx', Action.getCowCard);

export const getDetailedCowCard = data =>
  getRequest(`/api/test/xxx/${data.id}`, Action.getDetailedCowCard);

export const getTagCowCard = data =>
  getRequest(`/api/test/xxx/${data.mark}`, Action.getTagCowCard);

export const getTagsCheck = data =>
  getRequest(`/api/test/xxx/${data.mark}`, Action.getTagsCheck);

export const getCowCardScanner = data =>
  postRequest('/api/test/xxx', Action.getCowCardScanner, data);

export const getCowCardDetailedPregnancy = data =>
  postRequest(
    '/api/test/xxx',
    Action.getCowCardDetailedPregnancy,
    data,
  );
