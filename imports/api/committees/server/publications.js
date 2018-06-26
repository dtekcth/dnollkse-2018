import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";

import Committees from "./../collections";

Meteor.publish("committees.all", function() {
  return Committees.find({});
});

Meteor.publish("committees.id", function(id) {
  return Committees.find(id);
});
