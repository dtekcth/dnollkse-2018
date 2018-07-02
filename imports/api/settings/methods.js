import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import _ from "lodash";
import SimpleSchema from "simpl-schema";

import Settings from "./collections";

export const settingsSetupMethod = new ValidatedMethod({
  name: "settings.setup",
  validate: new SimpleSchema({}).validator({}),

  run({}) {
    if (!this.userId) {
      throw new Meteor.Error("settings.methods.setup.noUser",
                             "Need to be signed in to setup website");
    }

    const settings = Settings.findOne("development");
    if (settings && settings.setup) {
      throw new Meteor.Error("settings.methods.setup.alreadySetup",
                             "Website has already been set up");
    }

    Roles.addUsersToRoles(this.userId, [ "admin" ]);

    Settings.upsert({ _id: "development" }, {
      $set: {
        setup: true
      }
    }, {
      removeEmptyStrings: false
    });
  }
});

export const settingsUpdateMethod = new ValidatedMethod({
  name: "settings.update",
  validate: new SimpleSchema({
    committee       : Settings.simpleSchema().schema("committee"),
    gcalId          : Settings.simpleSchema().schema("gcalId"),
    gcalKey         : Settings.simpleSchema().schema("gcalKey"),

    navigation      : Settings.simpleSchema().schema("navigation"),
    "navigation.$"  : Settings.simpleSchema().schema("navigation.$"),

    questions       : Settings.simpleSchema().schema("questions"),
    "questions.$"   : Settings.simpleSchema().schema("questions.$"),

    links           : Settings.simpleSchema().schema("links"),
    "links.$"       : Settings.simpleSchema().schema("links.$"),

    documents       : Settings.simpleSchema().schema("documents"),
    "documents.$"   : Settings.simpleSchema().schema("documents.$"),

    contacts        : Settings.simpleSchema().schema("contacts"),
    "contacts.$"    : Settings.simpleSchema().schema("contacts.$")
  }).validator({}),

  run({ committee, gcalId, gcalKey, questions,
        navigation, links, documents, contacts }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_SETTINGS"])) {
      throw new Meteor.Error("settings.methods.update.notAuthorized",
                             "Not authorized to update settings");
    }

    const foundEmptyNav = _.find(navigation, i => {
      return _.isEmpty(i.text) || _.isEmpty(i.link);
    });

    if (foundEmptyNav) {
      throw new Meteor.Error("settings.methods.update.navInvalid",
                             "Nav links must have a name and a link!");
    }

    const foundEmptyQuestion = _.find(questions, i => {
      return _.isEmpty(i.question) || _.isEmpty(i.answer);
    });

    if (foundEmptyQuestion) {
      throw new Meteor.Error("settings.methods.update.questionInvalid",
                             "FAQ questions must have a question and an answer!");
    }

    const foundEmptyLink = _.find(links, i => {
      return _.isEmpty(i.title) || _.isEmpty(i.link);
    });

    if (foundEmptyLink) {
      throw new Meteor.Error("settings.methods.update.linkInvalid",
                             "Links must have a title and a link!");
    }

    const foundEmptyDoc = _.find(documents, i => {
      return _.isEmpty(i.title) || _.isEmpty(i.text);
    });

    if (foundEmptyDoc) {
      throw new Meteor.Error("settings.methods.update.docInvalid",
                             "Documents must have a title and a text!");
    }

    const foundEmptyContact = _.find(contacts, i => {
      return _.isEmpty(i.name) || _.isEmpty(i.value);
    });

    if (foundEmptyContact) {
      throw new Meteor.Error("settings.methods.update.contactInvalid",
                             "Contacts must have a name and a value!");
    }

    Settings.upsert({ _id: "development" }, {
      $set: {
        committee,
        gcalId,
        gcalKey,
        navigation,
        questions,
        links,
        documents,
        contacts
      }
    });
  }
});
