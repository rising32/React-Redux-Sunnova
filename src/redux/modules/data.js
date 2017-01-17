// const LOAD = 'sunnova/data/LOAD';
// const LOAD_SUCCESS = 'sunnova/data/LOAD_SUCCESS';
// const LOAD_FAIL = 'sunnova/data/LOAD_FAIL';

const LOAD = 'sunnova/data/leads/LOAD';
const LOAD_SUCCESS = 'sunnova/data/leads/LOAD_SUCCESS';
const LOAD_FAIL = 'sunnova/data/leads/LOAD_FAIL';

const LOADID = 'sunnova/data/leads/LOADID';
const LOADID_SUCCESS = 'sunnova/data/leads/LOADID_SUCCESS';
const LOADID_FAIL = 'sunnova/data/leads/LOADID_FAIL';

const SAVE = 'sunnova/data/leads/SAVE';
const SAVE_SUCCESS = 'sunnova/data/leads/SAVE_SUCCESS';
const SAVE_FAIL = 'sunnova/data/leads/SAVE_FAIL';

const UPDATE = 'sunnova/data/leads/UPDATE';
const UPDATE_SUCCESS = 'sunnova/data/leads/UPDATE_SUCCESS';
const UPDATE_FAIL = 'sunnova/data/leads/UPDATE_FAIL';

const FLAG = 'sunnova/data/leads/FLAG';
const FLAG_SUCCESS = 'sunnova/data/leads/FLAG_SUCCESS';
const FLAG_FAIL = 'sunnova/data/leads/FLAG_FAIL';

const DELETE = 'sunnova/data/leads/DELETE';
const DELETE_SUCCESS = 'sunnova/data/leads/DELETE_SUCCESS';
const DELETE_FAIL = 'sunnova/data/leads/DELETE_FAIL';

const SERVING_ENTITIES = 'sunnova/data/leads/SERVING_ENTITIES';
const SERVING_ENTITIES_SUCCESS = 'sunnova/data/leads/SERVING_ENTITIES_SUCCESS';
const SERVING_ENTITIES_FAIL = 'sunnova/data/leads/SERVING_ENTITIES_FAIL';

const CREATE_ACCOUNT = 'sunnova/data/leads/CREATE_ACCOUNT';
const CREATE_ACCOUNT_SUCCESS = 'sunnova/data/leads/CREATE_ACCOUNT_SUCCESS';
const CREATE_ACCOUNT_FAIL = 'sunnova/data/leads/CREATE_ACCOUNT_FAIL';

const GET_TARIFFS = 'sunnova/data/leads/GET_TARIFFS';
const GET_TARIFFS_SUCCESS = 'sunnova/data/leads/GET_TARIFFS_SUCCESS';
const GET_TARIFFS_FAIL = 'sunnova/data/leads/GET_TARIFFS_FAIL';

const ARRAY = 'sunnova/data/leads/ARRAY';
const ARRAY_SUCCESS = 'sunnova/data/leads/ARRAY_SUCCESS';
const ARRAY_FAIL = 'sunnova/data/leads/ARRAY_FAIL';

const SAVE_BILLS = 'sunnova/data/leads/SAVE_BILLS';
const SAVE_BILLS_SUCCESS = 'sunnova/data/leads/SAVE_BILLS_SUCCESS';
const SAVE_BILLS_FAIL = 'sunnova/data/leads/SAVE_BILLS_FAIL';

const MONTHLY_VALUES = 'sunnova/data/leads/MONTHLY_VALUES';
const MONTHLY_VALUES_SUCCESS = 'sunnova/data/leads/MONTHLY_VALUES_SUCCESS';
const MONTHLY_VALUES_FAIL = 'sunnova/data/leads/MONTHLY_VALUES_FAIL';

const RESET_SELECTED = 'sunnova/data/leads/RESET_SELECTED';

const initialState = {
  assignLeads: [],
  leads: [],
  filter: 'all',
  refreshNeeded: false,
  lastSavedID: 0,
  selectedLead: {},
  arrays: []
};

export default function reducer(state = initialState, action = {}) {
  const { object } = action;

  switch (action.type) {
    case RESET_SELECTED:
      return {
        ...state,
        selectedLead: {}
      };
    case LOADID:
      return {
        ...state,
        leadloading: true
      };
    case LOADID_SUCCESS:
      const data = action.result.data;
      localStorage.setItem('mc_name', data.firstname);
      localStorage.setItem('mc_street', data.street);
      localStorage.setItem('mc_city', data.city + ' ' + data.state + ' ' + data.postalcode);
      return {
        ...state,
        leadLoading: false,
        leadLoaded: true,
        selectedLead: action.result.data,
      };
    case LOADID_FAIL:
      return {
        ...state,
        leadLoading: false,
        leadLoaded: false,
        error: action.error
      };
    case UPDATE:
      return {
        ...state,
        updateInProgress: true,
        selectedLead: {
          ...state.selectedLead,
          ...object,
        }
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        refreshNeeded: true,
        updateSuccess: true
      };
    case UPDATE_FAIL:
      console.log('fail', arguments);
      return {
        ...state,
        error: action.error
      };
    case DELETE:
      return {
        ...state,
        refreshNeeded: true,
        deleteInProgress: true
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        deleteSuccess: true
      };
    case DELETE_FAIL:
      return {
        ...state,
        error: action.error
      };
    case FLAG:
      return {
        ...state,
        flagInProgress: true
      };
    case FLAG_SUCCESS:
      return {
        ...state,
        refreshNeeded: true,
        flagSuccess: true
      };
    case FLAG_FAIL:
      return {
        ...state,
        error: action.error
      };
    case SAVE:
      return {
        ...state,
        saveInProgress: true,
        selectedLead: {
          ...state.selectedLead,
          ...object
        }
      };
    case SAVE_SUCCESS:
      if (object) {
        localStorage.setItem('mc_name', object.firstname);
        localStorage.setItem('mc_street', object.street);
        localStorage.setItem('mc_city', object.city + ' ' + object.state + ' ' + object.postalcode);
      }
      return {
        ...state,
        refreshNeeded: true,
        saveSuccess: true,
        lastSavedID: action.result.id,
        selectedLead: {
          ...state.selectedLead,
          ...object,
          id: action.result.id
        }
      };
    case SAVE_FAIL:
      console.log('fail', arguments);
      return {
        ...state,
        error: action.error
      };
    case LOAD:
      return {
        ...state,
        leadsloading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        refreshNeeded: false,
        leadsLoading: false,
        leadsLoaded: true,
        leads: action.result.data,
        leadsCount: parseInt(action.result.count, 10)
      };
    case LOAD_FAIL:
      return {
        ...state,
        leadsLoading: false,
        leadsLoaded: false,
        error: action.error
      };
    case SERVING_ENTITIES_SUCCESS:
      console.debug(action.result);
      return {
        ...state,
        servingEntities: action.result
      };
    case GET_TARIFFS_SUCCESS:
      console.debug(action.result);
      return {
        ...state,
        tariffs: action.result
      };
    case ARRAY_SUCCESS:
      return {
        ...state,
        arrays: action.result.data
      };
    default:
      return state;
  }
}

export function loadAssignLeads() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/assignLead')
  };
}


function load(page = 1, order = 'created_at', asc = false, filter = 'all') {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.post('/getLeads', {
      data: {
        page: page,
        order: order,
        ascending: asc,
        filter: filter
      }
    })
  };
}

function loadArrays(sfid) {
  return {
    types: [ARRAY, ARRAY_SUCCESS, ARRAY_FAIL],
    promise: (client) => client.post('/getArrays', {
      data: {
        sfid: sfid
      }
    })
  };
}

function loadOne(id) {
  console.debug(id);
  return {
    types: [LOADID, LOADID_SUCCESS, LOADID_FAIL],
    promise: (client) => client.post('/getLead', {
      data: {
        id: id
      }
    })
  };
}

function resetSelected() {
  return {
    type: RESET_SELECTED
  };
}

function update(id, object) {
  if (!id || !object) {
    console.error('[update leads] wrong input', id, object);
    return { type: UPDATE_FAIL };
  }
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    object,
    promise: (client) => client.post('/updateLead', {
      data: {
        id: id,
        object: object
      }
    })
  };
}

function save(object) {
  // TODO: basic validation
  if (!object) {
    console.error('Object not defined.');
  }
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    object,
    promise: (client) => client.post('/saveLead', {
      data: {
        object: object,
      }
    })
  };
}

function setFlag() {
  // TODO: basic validation
  // if (!id) {
  //   console.error('ID not defined.');
  // }
  return {
    types: [FLAG, FLAG_SUCCESS, FLAG_FAIL],
    promise: (client) => client.post('/setLeadFlag', {
      data: {
        id: window.selectedId,
      }
    })
  };
}

function remove() {
  // TODO: basic validation
  // if (!id) {
  //   console.error('ID not defined.');
  // }
  console.log('removing...');
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client) => client.post('/deleteLead', {
      data: {
        id: window.selectedId,
      }
    })
  };
}

function getServingEntity(postalcode) {
  return {
    types: [SERVING_ENTITIES, SERVING_ENTITIES_SUCCESS, SERVING_ENTITIES_FAIL],
    promise: (client) => client.post('/getServingEntity', {
      data: {
        postalcode
      }
    })
  };
}

function getTariffs(uuid) {
  return {
    types: [GET_TARIFFS, GET_TARIFFS_SUCCESS, GET_TARIFFS_FAIL],
    promise: (client) => client.post('/getTariffs', {
      data: {
        uuid
      }
    })
  };
}

function saveBills(leadId, bills) {
  console.log('bills', leadId, bills);
  return {
    types: [SAVE_BILLS, SAVE_BILLS_SUCCESS, SAVE_BILLS_FAIL],
    promise: (client) => client.post('/saveBills', {
      data: {
        leadId,
        bills
      }
    })
  };
}

function getMonthlyValues(leadId, accountId) {
  console.log('get montly values', leadId);
  return {
    types: [MONTHLY_VALUES, MONTHLY_VALUES_SUCCESS, MONTHLY_VALUES_FAIL],
    promise: (client) => client.post('/getMonthlyValues', {
      data: {
        leadId,
        accountId
      }
    })
  };
}

function createAccountGenability(userId, name, address) {
  return {
    types: [CREATE_ACCOUNT, CREATE_ACCOUNT_SUCCESS, CREATE_ACCOUNT_FAIL],
    promise: (client) => client.post('/createAccount', {
      data: {
        userId,
        name,
        address
      }
    })
  };
}

export const API = { load, loadOne, save, setFlag, remove, update, resetSelected, getServingEntity, createAccountGenability, getTariffs, loadArrays, saveBills, getMonthlyValues };
