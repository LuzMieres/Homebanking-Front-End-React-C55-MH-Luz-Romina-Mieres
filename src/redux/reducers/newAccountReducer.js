const initialState = {
    accounts: [],
    error: null,
  };
  
  export const accountReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'NEW_ACCOUNT_SUCCESS':
        return {
          ...state,
          accounts: [...state.accounts, action.payload],
          error: null,
        };
      case 'NEW_ACCOUNT_FAILURE':
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  