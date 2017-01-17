const ACTIVATE = 'sunnova/glass/ACTIVATE';
const DEACTIVATE = 'sunnova/glass/DEACTIVATE';
const TOGGLE = 'sunnova/glass/TOGGLE';
const OPEN = 'sunnova/glass/OPEN';

const initialState = {
  active: false,
  name: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN:
      return {
        active: true,
        name: action.data.name
      };
    case ACTIVATE:
      return {
        active: true,
        name: ''
      };
    case DEACTIVATE:
      return {
        active: false,
        name: ''
      };
    case TOGGLE:
      const { active } = state;
      return {
        active: !active,
        name: action.data.name
      };
    default:
      return state;
  }
}

export function open(name) {
  return {
    type: OPEN,
    data: {
      name: name
    }
  };
}

export function toggle(name) {
  if (!name) {
    return {
      type: DEACTIVATE
    };
  }

  return {
    type: TOGGLE,
    data: {
      name: name
    }
  };
}

export function activate() {
  return {
    type: ACTIVATE
  };
}

export function deactivate() {
  return {
    type: DEACTIVATE
  };
}
