import { combineReducers } from 'redux';
import screen from './screen';
import board from './board';
import toggle from './toggle';

export default combineReducers({
    screen,
    board,
    toggle,
    // other reducers..
});