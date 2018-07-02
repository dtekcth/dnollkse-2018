import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import _ from "lodash";
import SimpleSchema from "simpl-schema";

import News from "./collections";

export const newsCreateMethod = new ValidatedMethod({
  name: "news.create",
  validate: new SimpleSchema({
    title   : News.simpleSchema().schema("title"),
    date    : News.simpleSchema().schema("date"),
    content : News.simpleSchema().schema("content")
  }).validator({}),

  run({ title, date, content }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_NEWS"])) {
      throw new Meteor.Error("news.methods.create.notAuthorized",
                             "Not authorized to manage news");
    }

    News.insert({
      title,
      date,
      content
    });
  }
});

export const newsUpdateMethod = new ValidatedMethod({
  name: "news.update",
  validate: new SimpleSchema({
    postId  : { type: String, label: "Post ID", regEx: SimpleSchema.RegEx.Id },
    title   : News.simpleSchema().schema("title"),
    date    : News.simpleSchema().schema("date"),
    content : News.simpleSchema().schema("content")
  }).validator({}),

  run({ postId, title, date, content }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_NEWS"])) {
      throw new Meteor.Error("news.methods.update.notAuthorized",
                             "Not authorized to manage news");
    }

    News.update(postId, {
      $set: {
        title,
        date,
        content
      }
    });
  }
});

export const newsRemoveMethod = new ValidatedMethod({
  name: "news.remove",
  validate: new SimpleSchema({
    postId  : { type: String, label: "Post ID", regEx: SimpleSchema.RegEx.Id }
  }).validator({}),

  run({ postId }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_News"])) {
      throw new Meteor.Error("news.methods.remove.notAuthorized",
                             "Not authorized to manage news");
    }

    News.remove(postId);
  }
});
