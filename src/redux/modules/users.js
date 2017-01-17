// const LOAD = 'sunnova/data/LOAD';
// const LOAD_SUCCESS = 'sunnova/data/LOAD_SUCCESS';
// const LOAD_FAIL = 'sunnova/data/LOAD_FAIL';

const LOAD = 'sunnova/data/users/LOAD';
const LOAD_SUCCESS = 'sunnova/data/users/LOAD_SUCCESS';
const LOAD_FAIL = 'sunnova/data/users/LOAD_FAIL';

const initialState = {
  rows: [],
  refreshNeeded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        refreshNeeded: false,
        loading: false,
        rows: action.result.data,
        count: parseInt(action.result.count, 10)
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };


    default:
      return state;
  }
}

function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.post('/getAllUsers', {
      data: {}
    })
  };
}

export const API = { load };
