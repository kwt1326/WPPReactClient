const TOGGLE_INTRODUCE_VIEWSTATE = 'toggle/TOGGLE_INTRODUCE_VIEWSTATE';

export const changeviewstate = viewstate => ({ type : TOGGLE_INTRODUCE_VIEWSTATE, intro_viewstate : viewstate });

const initialState = {
    intro_viewstate: '2D',
};

export default function toggle(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_INTRODUCE_VIEWSTATE:
      return {
        ...state,
        intro_viewstate: action.viewstate,
      };
    default:
      return state;
  }
}