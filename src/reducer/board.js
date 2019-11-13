const BOARD_STATE = 'board/BOARD_STATE';

export const changeboardstate = boardstate => ({ type : BOARD_STATE, boardstate });

const initialState = {
    boardstate: 'All',
};

export default function board(state = initialState, action) {
  switch (action.type) {
    case BOARD_STATE:
      return {
        ...state,
        boardstate: action.boardstate,
      };
    default:
      return state;
  }
}