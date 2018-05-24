
// Reducer for meteor user data
export const user = (state = {}, action) => {
  switch (action.type) {
  case "USER_UPDATE":
    return {
      userId     : action.userId,
      data       : action.data,
      isLoggingIn: action.isLoggingIn,
      isLoading  : action.isLoading
    };
  default:
    return state;
  }
};

// Reducer for all meteor users
export const users = (state = {}, action) => {
  switch (action.type) {
  case "USER_UPDATE":
    return {
      userId     : action.userId,
      user       : action.user,
      isLoggingIn: action.isLoggingIn,
      isLoading  : action.isLoading
    };
  default:
    return state;
  }
};
