import {createStore, combineReducers, applyMiddleware} from 'redux';
import scanner from './models/scanner/reducer/scanner-result';
import auth from './models/auth/reducer/auth';
import loading from './models/loading/reducer/loading';
import cowCard from './models/cow-card/reducer/cowCard';
import cowCardScanner from './models/cow-card/reducer/cowCardScanner';
import cowCardDetailed from './models/cow-card/reducer/cowCardDetailed';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';


const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  scanner: scanner,
  auth: auth,
  loading: loading,
  cowCard: cowCard,
  cowCardDetailed: cowCardDetailed,
  cowCardScanner: cowCardScanner
});

const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(sagaMiddleware, thunk));
};

export default configureStore;
