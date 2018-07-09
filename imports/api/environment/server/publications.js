import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";

import Environment from "./../collections";

Meteor.publish("environment", function(options) {
  if (!Roles.userIsInRole(this.userId, [ "ENVIRONMENT_VIEW" ])) {
    this.stop();
    return;
  }

  return Environment.find({
    date: { $gte: options.from }
  });
});
