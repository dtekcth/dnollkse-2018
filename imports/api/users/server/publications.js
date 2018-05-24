import { Meteor } from "meteor/meteor";

let commonFields = {
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



