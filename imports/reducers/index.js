import { combineReducers } from "redux";

// Reducer for committee data
export const committee = (state = {}, action) => {
  switch (action.type) {
  case "COMMITTEE_UPDATE":
    return {
      data  : action.data || {},
      ready : action.ready
    };
  default:
    return state;
  }
};

// Reducer for pages
export const pages = (state = {}, action) => {
  switch (action.type) {
  case "PAGES_UPDATE":
    return {
      list  : action.list || [],
      ready : action.ready
    };
  default:
    return state;
  }
};

// Reducer for news
export const news = (state = {}, action) => {
  switch (action.type) {
  case "NEWS_UPDATE":
    return {
      list  : action.list || [],
      ready : action.ready
    };
  default:
    return state;
  }
};

// Reducer for settings data
export const settings = (state = {}, action) => {
  switch (action.type) {
  case "SETTINGS_UPDATE":
    return {
      data  : action.data || {},
      ready : action.ready
    };
  default:
    return state;
  }
};


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

// Reducer for all meteor roles
export const roles = (state = {}, action) => {
  switch (action.type) {
  case "ROLES_UPDATE":
    return {
      list  : action.roles,
      ready : action.ready
    };
  default:
    return state;
  }
};

export default combineReducers({
  user,
  roles,
  settings,
  pages,
  news,
  committee
});

