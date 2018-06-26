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
