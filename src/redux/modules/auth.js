import { API } from './data';
import { resetLayout } from './layout';

const LOAD = 'redux-example/auth/LOAD';
const LOAD_SUCCESS = 'redux-example/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/auth/LOAD_FAIL';
const INVITATION = 'redux-example/auth/INVITATION';
const INVITATION_SUCCESS = 'redux-example/auth/INVITATION_SUCCESS';
const INVITATION_FAIL = 'redux-example/auth/INVITATION_FAIL';
const LOGOUT = 'redux-example/auth/LOGOUT';
const LOGOUT_SUCCESS = 'redux-example/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'redux-example/auth/LOGOUT_FAIL';
const LOGIN = 'redux-example/auth/LOGIN';
const LOGIN_SUCCESS = 'redux-example/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'redux-example/auth/LOGIN_FAIL';
const PHONE_SET = 'redux-example/auth/PHONE_SET';
const PHONE_SET_SUCCESS = 'redux-example/auth/PHONE_SET_SUCCESS';
const PHONE_SET_FAIL = 'redux-example/auth/PHONE_SET_FAIL';
const VALIDATE_CODE = 'redux-example/auth/VALIDATE_CODE';
const VALIDATE_CODE_SUCCESS = 'redux-example/auth/VALIDATE_CODE_SUCCESS';
const VALIDATE_CODE_FAIL = 'redux-example/auth/VALIDATE_CODE_FAIL';

const SET_PROFILE_PICTURE = 'sunnova/data/user/SET_PROFILE_PICTURE';
const SOCIAL_LOGIN = 'sunnova/data/user/SOCIAL_LOGIN';

const CHANGE_PASSWORD = 'sunnova/data/user/CHANGE_PASSWORD';
const CHANGE_PASSWORD_SUCCESS = 'sunnova/data/user/CHANGE_PASSWORD_SUCCESS';
const CHANGE_PASSWORD_FAIL = 'sunnova/data/user/CHANGE_PASSWORD_FAIL';

const initialState = {
  loaded: false,
  invited: false,
  locked: false,
  codeValid: null
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
        loading: false,
        loaded: true,
        user: action.result,
        invited: !!action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case INVITATION:
      return {
        ...state,
        invitationLoggingIn: true
      };
    case INVITATION_SUCCESS:
      return {
        ...state,
        invitationLoggingIn: false,
        invited: true
      };
    case INVITATION_FAIL:
      return {
        ...state,
        invitationLoggingIn: false,
        invited: false,
        invitationError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null,
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true,
        loginError: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        locked: true,
        loggingIn: false,
        user: action.result,
        loginError: null
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        loginError: action.error
      };
    case PHONE_SET:
      return {
        ...state,
        settingPhoneIn: true
      };
    case PHONE_SET_SUCCESS:
      return {
        ...state,
        settingPhoneIn: false,
        phone: action.result,
      };
    case PHONE_SET_FAIL:
      return {
        ...state,
        settingPhoneIn: false,
        phoneError: action.error
      };
    case VALIDATE_CODE:
      return {
        ...state,
        codeValid: null,
      };
    case VALIDATE_CODE_SUCCESS:
      console.log('valid');
      return {
        ...state,
        locked: false,
        codeValid: true,
      };
    case VALIDATE_CODE_FAIL:
      return {
        ...state,
        locked: true,
        codeValid: false,
      };
    case SET_PROFILE_PICTURE:
      console.debug(action);
      return {
        ...state,
        user: {
          ...state.user,
          profile_picture: action.data.profile_picture.split('"').join('')
        }
      };
    case CHANGE_PASSWORD:
      return {
        ...state,
        passwordChangeSuccess: null,
        passwordChangeError: null
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        passwordChangeSuccess: true
      };
    case CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        passwordChangeError: true
      };
    case SOCIAL_LOGIN:
      return {
        ...state,
        user: {
          ...state.user,
          social: true
        }
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
  };
}

export function invitation(name) {
  return {
    types: [INVITATION, INVITATION_SUCCESS, INVITATION_FAIL],
    promise: (client) => client.post('/invitation', {
      data: {
        name: name
      }
    })
  };
}

export function login(email, password) {
  console.debug('[auth] ', email, password);
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/login', {
      data: {
        email: email,
        password: password
      }
    })
  };
}

export function useAuthy(userId) {
  return {
    types: [PHONE_SET, PHONE_SET_SUCCESS, PHONE_SET_FAIL],
    promise: (client) => client.post('/useAuthy', {
      data: {
        id: userId
      }
    })
  };
}

export function changePassword(userId, oldPassword, newPassword) {
  return {
    types: [CHANGE_PASSWORD, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL],
    promise: (client) => client.post('/changePassword', {
      data: {
        userId,
        oldPassword,
        newPassword
      }
    })
  };
}

export function validateCodeAuthy(userId, code) {
  return {
    types: [VALIDATE_CODE, VALIDATE_CODE_SUCCESS, VALIDATE_CODE_FAIL],
    promise: (client) => client.post('/validateCodeAuthy', {
      data: {
        id: userId,
        code: code
      }
    })
  };
}

export function setProfilePicture(url) {
  return {
    type: SET_PROFILE_PICTURE,
    data: {
      profile_picture: url
    }
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/logout')
  };
}

export function logoutAndResetRedux() {
  return [
    logout(),
    API.resetSelected(),
    resetLayout()
  ];
}

export function setSocialLogin() {
  return {
    type: SOCIAL_LOGIN
  };
}
