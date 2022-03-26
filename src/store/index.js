import { createStore, combineReducers} from 'redux'
import storage from '../utils/storage'

function users(state=storage.get('users') || {}, action){
    switch (action.type) {
        case 'USERS_UPDATE':
            return action.payload;
        default:
            return state;
    }
}

let rootReducer = combineReducers({
    users
})

let store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  
export default store;