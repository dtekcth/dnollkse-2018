import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { ValidatedMethod } from "meteor/mdg:validated-method";

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
    committee: Settings.simpleSchema().schema("committee")
  }).validator({}),

  run({ committee }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_SETTINGS"])) {
      throw new Meteor.Error("settings.methods.update.notAuthorized",
                             "Not authorized to update settings");
    }

    Settings.upsert({ _id: "development" }, {
      $set: {
        committee
      }
    }, {
      removeEmptyStrings: false
    });
  }
});
