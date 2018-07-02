import { Meteor } from "meteor/meteor";

import Pages from "./../collections";

Meteor.publish("pages.all", function() {
  return Pages.find({});
});
