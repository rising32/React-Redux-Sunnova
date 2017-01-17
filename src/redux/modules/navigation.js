const SET_LAST_VIEW = 'sunnova/navigation/SET_LAST_VIEW';
const SET_ORIGIN = 'sunnova/navigation/SET_ORIGIN';

const initialState = {
  last: {
    mainView: '',
    rightSlideView: '',
    topSlideView: ''
  },
  origin: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_LAST_VIEW:
      return {
        ...state,
        last: {
          ...state.last,
          ...action.data
        }
      };
    case SET_ORIGIN:
      return {
        ...state,
        origin: action.data
      };
    default:
      return state;
  }
}

export function setLastView(obj) {
  return {
    type: SET_LAST_VIEW,
    data: obj
  };
}

export function setOrigin(name) {
  return {
    type: SET_ORIGIN,
    data: name || ''
  };
}
