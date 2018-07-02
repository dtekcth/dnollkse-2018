import { combineReducers } from "redux";

import { user, roles } from "./user";
import { settings } from "./settings";
import { pages } from "./pages";
import { committee } from "./committees";

export default combineReducers({
  user,
  roles,
  settings,
  pages,
  committee
});

