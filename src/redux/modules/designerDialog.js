const OPEN = 'sunnova/designerDialog/OPEN';
const CLOSE = 'sunnova/designerDialog/CLOSE';

const initialState = {
  switchedOn: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN:
      return {
        switchedOn: true
      };
    case CLOSE:
        return {
          switchedOn: false
        };
    default:
      return state;
  }
}

export function open() {
  return {
    type: OPEN
  };
}


export function close() {
  return {
    type: CLOSE
  };
}

