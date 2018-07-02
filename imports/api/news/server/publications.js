import { Meteor } from "meteor/meteor";

import News from "./../collections";

Meteor.publish("news.all", function() {
  return News.find({});
});
