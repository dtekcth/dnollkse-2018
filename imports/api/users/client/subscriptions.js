import { Roles } from "meteor/alanning:roles";

import { userUpdate, rolesUpdate } from "/imports/actions/user";
import store from "/imports/store";

Tracker.autorun(() => {
  const userDataHandle = Meteor.subscribe("users.data");
  const usersHandle = Meteor.subscribe("users.all");

  store.dispatch(userUpdate(
    Meteor.userId(),
    Meteor.user(),
    Meteor.loggingIn(),
    !userDataHandle.ready() || !usersHandle.ready()
  ));

  const rolesHandle = Meteor.subscribe("roles.all");
  let roles = [];

  if (rolesHandle.ready()) {
    roles = Roles.getAllRoles().fetch();
  }

  store.dispatch(rolesUpdate(
    roles,
    rolesHandle.ready()
  ));
});
