import { Meteor } from "meteor/meteor";

import Settings from "./../collections";

Meteor.publish("settings.all", function() {
  if (Roles.userIsInRole(this.userId, [ "ADMIN_SETTINGS" ])) {
    return Settings.find();
  }

  return Settings.find({}, {
    fields: {
      "committee"  : 1,
      "gcalId"     : 1,
      "navigation" : 1,
      "questions"  : 1,
      "contacts"   : 1,
      "setup"      : 1,
      "created_at" : 1
    }
  });
});
