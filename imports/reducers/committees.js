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
