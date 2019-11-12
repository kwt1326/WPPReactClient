const SCREEN_STATE = 'screen/SCREEN_STATE';

export const changescreenstate = screenstate => ({ type : SCREEN_STATE, screenstate });

const initialState = {
  screenstate: 'desktop',
};

export default function screen(state = initialState, action) {
  switch (action.type) {
    case SCREEN_STATE:
      return {
        ...state,
        screenstate: action.screenstate,
      };
    default:
      return state;
  }
}