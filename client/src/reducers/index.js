import {combineReducers} from 'redux';
import {authReducer} from './auth';

//combine multiple users
const rootReducer = combineReducers({
    auth: authReducer,
  });

  export default rootReducer;