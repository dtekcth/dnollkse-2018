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
