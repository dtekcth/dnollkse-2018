import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";

import Environment from "./../collections";

Meteor.publish("environment", function() {
  return Environment.find({});
});
