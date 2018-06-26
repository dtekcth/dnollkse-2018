import { combineReducers } from "redux";

import { user, roles } from "./user";
import { settings } from "./settings";
import { committee } from "./committees";

export default combineReducers({
  user,
  roles,
  settings,
  committee
});

