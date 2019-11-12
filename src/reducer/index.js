import { combineReducers } from 'redux';
import screen from './screen';
import board from './board';

export default combineReducers({
    screen,
    board,
    // other reducers..
});