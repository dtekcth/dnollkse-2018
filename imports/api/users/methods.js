import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import SimpleSchema from "simpl-schema";

export const userAssignRoleMethod = new ValidatedMethod({
  name: "users.assignRole",
  validate: new SimpleSchema({
    userId: { type: String, label: "User ID", regEx: SimpleSchema.RegEx.Id },
    role: {
      type: String,
      label: "Role ID"
    }
  }).validator({}),

  run({ userId, role }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["admin"])) {
      throw new Meteor.Error("users.methods.assignRole.notAuthorized",
        "Not authorized to assign roles to users.");
    }

    Roles.addUsersToRoles(userId, role);
  }
});

export const userUnassignRoleMethod = new ValidatedMethod({
  name: "users.unassignRole",
  validate: new SimpleSchema({
    userId: { type: String, label: "User ID", regEx: SimpleSchema.RegEx.Id },
    role: {
      type: String,
      label: "Role ID"
    }
  }).validator({}),

  run({ userId, role }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["admin"])) {
      throw new Meteor.Error("users.methods.unassignRole.notAuthorized",
        "Not authorized to unassign roles from users.");
    }

    Roles.removeUsersFromRoles(userId, role);
  }
});

