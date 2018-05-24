import { userUpdate } from "/imports/actions/user";
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
});
