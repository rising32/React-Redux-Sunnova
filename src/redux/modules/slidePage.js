const OPEN = 'sunnova/slidePage/OPEN';
const CLOSE = 'sunnova/slidePage/CLOSE';
const TOGGLE = 'sunnova/slidePage/TOGGLE';

const OPEN_TOP = 'sunnova/slidePage/OPEN_TOP';

const initialState = {
  opened: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN_TOP:
      const { topOpened } = state;
      return {
        topOpened: !topOpened
      };
    case OPEN:
      return {
        opened: true
      };
    case CLOSE:
      return {
        opened: false
      };
    case TOGGLE:
      const { opened } = state;
      return {
        opened: !opened
      };
    default:
      return state;
  }
}

export function openTop() {
  console.log('open fucking top!');
  return {
    type: OPEN_TOP
  };
}

export function toggle() {
  return {
    type: TOGGLE
  };
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
