import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import ReduxThunk from "redux-thunk";

import rootReducer from "./reducers";

const logger = createLogger();

const middleware = [ReduxThunk];

let enhancers;
if (Meteor.isClient) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancers = composeEnhancers(
    applyMiddleware(...middleware),
  );
}
else if (Meteor.isServer) {
  enhancers = applyMiddleware(...middleware);
}

const store = createStore(
  rootReducer,
  {},
  enhancers
);

export default store;
