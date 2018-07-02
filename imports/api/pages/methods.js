import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import _ from "lodash";
import SimpleSchema from "simpl-schema";

import Pages from "./collections";

export const pagesCreateMethod = new ValidatedMethod({
  name: "pages.create",
  validate: new SimpleSchema({
    title   : Pages.simpleSchema().schema("title"),
    url     : Pages.simpleSchema().schema("url"),
    type    : Pages.simpleSchema().schema("type"),
    content : Pages.simpleSchema().schema("content")
  }).validator({}),

  run({ title, url, type, content }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_PAGES"])) {
      throw new Meteor.Error("pages.methods.create.notAuthorized",
                             "Not authorized to manage pages");
    }

    Pages.insert({
      title,
      url,
      type,
      content
    });
  }
});

export const pagesUpdateMethod = new ValidatedMethod({
  name: "pages.update",
  validate: new SimpleSchema({
    pageId  : { type: String, label: "Page ID", regEx: SimpleSchema.RegEx.Id },
    title   : Pages.simpleSchema().schema("title"),
    url     : Pages.simpleSchema().schema("url"),
    type    : Pages.simpleSchema().schema("type"),
    content : Pages.simpleSchema().schema("content")
  }).validator({}),

  run({ pageId, title, url, type, content }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_PAGES"])) {
      throw new Meteor.Error("pages.methods.update.notAuthorized",
                             "Not authorized to manage pages");
    }

    Pages.update(pageId, {
      $set: {
        title,
        url,
        type,
        content
      }
    });
  }
});

export const pagesRemoveMethod = new ValidatedMethod({
  name: "pages.remove",
  validate: new SimpleSchema({
    pageId  : { type: String, label: "Page ID", regEx: SimpleSchema.RegEx.Id }
  }).validator({}),

  run({ pageId }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_PAGES"])) {
      throw new Meteor.Error("pages.methods.remove.notAuthorized",
                             "Not authorized to manage pages");
    }

    Pages.remove(pageId);
  }
});
