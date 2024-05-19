import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import axios from 'axios';
import ErrorMessage from './error';

// Initial state
const initialState = {
  searchTerm: '',
  data: [],
  loading: false,
  error: null,
  message: '',
};

// Action types
const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
const EDIT_ITEM_SUCCESS = 'EDIT_ITEM_SUCCESS';
const DELETE_ITEM_SUCCESS = 'DELETE_ITEM_SUCCESS';
const ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';
const SET_SUCCESS_MESSAGE = 'SET_SUCCESS_MESSAGE'
const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE'
const CLEAR_MESSAGE= 'CLEAR_MESSAGE'
// Action creators
export const setSearchTerm = (term) => ({
  type: SET_SEARCH_TERM,
  payload: term,
});

// export const fetchData = () => async (dispatch) => {
//   dispatch({ type: CLEAR_MESSAGE });
// }
export const fetchData = () => async (dispatch) => {
  dispatch({ type: FETCH_DATA_REQUEST });
  try {
    const response = await axios.get('http://localhost:8080/users');
    dispatch({ type: FETCH_DATA_SUCCESS, payload: response.data.data,message: "Data Fetched successfully"});
    console.log(response);
  } catch (error) {
    dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
  }
};

export const editItem = (item) => async (dispatch) => {
  try {
    const response = await axios.put(`http://localhost:8080/users/${item.Id}`, item);
    dispatch({ type: EDIT_ITEM_SUCCESS, payload: response.data, message: response.data.message});
  } catch (error) {
    console.error(error);
  }
};

export const deleteItem = (Id) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:8080/users/${Id}`);
    dispatch({ type: DELETE_ITEM_SUCCESS, payload: Id, message: 'Data deleted successfully'});
  } catch (error) {
    console.error(error);
  }
};

export const addItem = (item) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:8080/users', item);
   if(response.data.success===true){
     dispatch({ type: ADD_ITEM_SUCCESS, payload: response.data,  message:response.data.message  });
    }
    else{
      dispatch({ type:SET_ERROR_MESSAGE, payload: 'Failed to add item',  message:response.data.message  });
    }
   // dispatch({ type: SET_SUCCESS_MESSAGE, payload: 'Item added successfully' }); 
  } catch (error) {
    console.error(error);
    dispatch({ type: SET_ERROR_MESSAGE, payload: 'Failed to add item' });
  }
};

// Reducer
const reducer = (state = initialState, action,message) => {
  switch (action.type) {
    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    case FETCH_DATA_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_DATA_SUCCESS:
      
      return { ...state, loading: false, data: action.payload, message: action.message};
    case FETCH_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case  CLEAR_MESSAGE:
        return {
         ...state,
          message: "",
        };
    case SET_SUCCESS_MESSAGE:return {
      ...state,
       message: action.message,
     };
      case SET_ERROR_MESSAGE:
        return {
         ...state,
          message: action.message,
        };
    case EDIT_ITEM_SUCCESS:
      console.log(action.message)
      return {
        ...state,
        data: state.data.map((item) =>
          item.Id === parseInt(action.payload.Id) ? action.payload : item
        ),
        message: action.message
      };
    case DELETE_ITEM_SUCCESS:
      return {
        ...state,
        data: state.data.filter((item) => item.Id !== action.payload),
        message : action.message,
      };
    case ADD_ITEM_SUCCESS:
      console.log(action.message);
      return {
        ...state,
        data: [...state.data, action.payload],
        message : action.message,
      };
    default:
      return state;
  }
};

// Create store
const store = createStore(reducer, applyMiddleware(thunk));

export default store;
