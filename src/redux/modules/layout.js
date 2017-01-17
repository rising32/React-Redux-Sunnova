const SET_NAME = 'sunnova/layout/SET_NAME';
const SET_ADDRESS = 'sunnova/layout/SET_ADDRESS';
const SET_LAYOUT_NAME = 'sunnova/layout/SET_LAYOUT_NAME';
const SET_PAGE_NUMBER = 'sunnova/layout/SET_PAGE_NUMBER';
const SET_USER = 'sunnova/layout/SET_USER';
const SET_FILTER = 'sunnova/layout/SET_FILTER';
const RESET_LAYOUT = 'sunnova/layout/RESET_LAYOUT';


const initialState = {
  name: 'Homeowner',
  address: 'Curry Residence at 21857 Brennan Rd.',
  layoutName: 'Let\'s get started',
  pageNumber: 0,
  loggedUser: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case RESET_LAYOUT:
      return {
        ...initialState
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.data
      };
    case SET_NAME:
      return {
        ...state,
        name: action.data
      };
    case SET_ADDRESS:
      return {
        ...state,
        address: action.data
      };
    case SET_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.data
      };
    case SET_LAYOUT_NAME:
      return {
        ...state,
        layoutName: action.data
      };
    case SET_USER:
      return {
        ...state,
        userLogged: action.data
      };
    default:
      return state;
  }
}

export function setFilter(str) {
  return {
    type: SET_FILTER,
    data: str
  };
}

export function setName(name) {
  return {
    type: SET_NAME,
    data: name
  };
}

export function setLoggedUser(name) {
  return {
    type: SET_USER,
    data: name
  };
}

export function setPageNumber(number) {
  return {
    type: SET_PAGE_NUMBER,
    data: number
  };
}

export function setAddress(val) {
  return {
    type: SET_ADDRESS,
    data: val
  };
}

export function setLayoutName(val) {
  return {
    type: SET_LAYOUT_NAME,
    data: val
  };
}

export function resetLayout() {
  return {
    type: RESET_LAYOUT,
  };
}
