import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  LOGOUT
} from '../actions/types';

const initialState = {
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  isAuthenticated: null,
  user: null
};

export default function(state = initialState, action) {
  const {type, payload} = action;

  switch(type) {
    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true
      }
    case AUTHENTICATED_FAIL:
      return {
        ...state,
        isAuthenticated: false
      }
    case LOGIN_SUCCESS:
      localStorage.setItem('access', payload.access)
      return {
        ...state,
        isAuthenticated:true,
        access: payload.access,
        refresh: payload.refresh
      }
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated:false
      }
    case REGISTER_FAIL:
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        user: payload
      }
    case LOAD_USER_FAIL:
      return {
        ...state,
        user: null
      }
    case LOGIN_FAIL:
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null
      }
    case LOGOUT:
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null
      }
    case PASSWORD_RESET_SUCCESS:
    case PASSWORD_RESET_FAIL:
    case PASSWORD_RESET_CONFIRM_SUCCESS:
    case PASSWORD_RESET_CONFIRM_FAIL:
    case ACTIVATION_SUCCESS:
    case ACTIVATION_FAIL:
    default:
      return state;
  }
}
