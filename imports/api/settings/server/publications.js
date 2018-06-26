import { Meteor } from "meteor/meteor";

import Settings from "./../collections";

Meteor.publish("settings.all", function() {
  return Settings.find({});
});

Meteor.publish("settings.setup", function() {
  return Settings.find("development", {
    fields: {
      "setup": 1
    }
  });
});
