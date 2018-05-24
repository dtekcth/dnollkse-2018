import { Meteor } from "meteor/meteor";

Accounts.onCreateUser((options, user) => {
  return user;
});

Accounts.onLogin(data => {
  const user = data.user;
});



