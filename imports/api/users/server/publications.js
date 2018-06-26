import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";

let commonFields = {
  "username": 1,
  "roles": 1,
  "createdAt": 1
};

Meteor.publish("users.me", function() {
  return Meteor.users.find(
    { _id: this.userId },
    {
      fields: {
        ...commonFields,
        "keys": 1,
        "status": 1
      }
    }
  );
});

Meteor.publish("users.all", function() {
  return Meteor.users.find({}, {
    fields: commonFields
  });
});

Meteor.publish("users.id", function(id) {
  return Meteor.users.find(id, {
    fields: commonFields
  });
});


Meteor.publish("roles.all", function() {
  return Roles.getAllRoles();
});
