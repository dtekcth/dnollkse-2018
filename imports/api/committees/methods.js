import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import _ from "lodash";
import SimpleSchema from "simpl-schema";

import Committees from "./collections";

export const committeeCreateMethod = new ValidatedMethod({
  name: "committees.create",
  validate: new SimpleSchema({
    name        : Committees.simpleSchema().schema("name"),
    description : Committees.simpleSchema().schema("description"),
    logo        : Committees.simpleSchema().schema("logo"),
    cover       : Committees.simpleSchema().schema("cover"),
    members     : Committees.simpleSchema().schema("members"),
    "members.$" : Committees.simpleSchema().schema("members.$")
  }).validator({}),

  run({ name, description, logo, cover, members }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_COMMITTEES"])) {
      throw new Meteor.Error("committees.methods.create.notAuthorized",
                             "Not authorized to create committees");
    }

    if (_.isEmpty(name)) {
      throw new Meteor.Error("committees.methods.create.nameEmpty",
                             "Committee name cannot be empty");
    }

    Committees.insert({
      name,
      description,
      logo,
      cover,
      members
    }, {
      removeEmptyStrings: false
    });
  }
});

export const committeeUpdateMethod = new ValidatedMethod({
  name: "committees.update",
  validate: new SimpleSchema({
    committeeId : { type: String, label: "Committee ID", regEx: SimpleSchema.RegEx.Id },
    name        : Committees.simpleSchema().schema("name"),
    description : Committees.simpleSchema().schema("description"),
    logo        : Committees.simpleSchema().schema("logo"),
    cover       : Committees.simpleSchema().schema("cover"),
    members     : Committees.simpleSchema().schema("members"),
    "members.$" : Committees.simpleSchema().schema("members.$")
  }).validator({}),

  run({ committeeId, name, description, logo, cover, members }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_COMMITTEES"])) {
      throw new Meteor.Error("committees.methods.update.notAuthorized",
                             "Not authorized to update committees");
    }

    if (_.isEmpty(name)) {
      throw new Meteor.Error("committees.methods.update.nameEmpty",
                             "Committee name cannot be empty");
    }

    Committees.update(committeeId, {
      $set: {
        name,
        description,
        logo,
        cover,
        members
      }
    });
  }
});

export const committeeRemoveMethod = new ValidatedMethod({
  name: "committees.remove",
  validate: new SimpleSchema({
    committeeId : { type: String, label: "Committee ID", regEx: SimpleSchema.RegEx.Id }
  }).validator({}),

  run({ committeeId }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_COMMITTEES"])) {
      throw new Meteor.Error("committees.methods.remove.notAuthorized",
                             "Not authorized to remove committees");
    }

    Committees.remove(committeeId);
  }
});
