import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import _ from "lodash";
import SimpleSchema from "simpl-schema";

const rolePrecedence = {
  admin     : 2,
  moderator : 1,
  user      : 0
};

const checkPrecedence = (user, role) => {
  const highest = _
        .chain(user.roles)
        .map(r => rolePrecedence[r._id] || 0)
        .max()
        .value();

  return (rolePrecedence[role] || 0) <= highest;
};

export const userAuthenticateMethod = new ValidatedMethod({
  name: "users.authenticate",
  validate: new SimpleSchema({
    cid: { type: String, label: "CID" },
    password: { type: String, label: "Password" }
  }).validator({}),

  run({ cid, password }) {}
});

export const userAssignRoleMethod = new ValidatedMethod({
  name: "users.assignRole",
  validate: new SimpleSchema({
    userId : { type: String, label: "User ID", regEx: SimpleSchema.RegEx.Id },
    role   : { type: String, label: "Role ID" }
  }).validator({}),

  run({ userId, role }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_USERS"])) {
      throw new Meteor.Error("users.methods.assignRole.notAuthorized",
                             "Not authorized to assign roles to users.");
    }

    const user = Meteor.users.findOne(this.userId);

    if (!checkPrecedence(user, role)) {
      throw new Meteor.Error("users.methods.assignRole.lowerPrecedence",
                             "Not authorized to assign roles of higher precedence than your own.");
    }

    Roles.addUsersToRoles(userId, role);
  }
});

export const userUnassignRoleMethod = new ValidatedMethod({
  name: "users.unassignRole",
  validate: new SimpleSchema({
    userId : { type: String, label: "User ID", regEx: SimpleSchema.RegEx.Id },
    role   : { type: String, label: "Role ID" }
  }).validator({}),

  run({ userId, role }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_USERS"])) {
      throw new Meteor.Error("users.methods.unassignRole.notAuthorized",
                             "Not authorized to unassign roles from users.");
    }

    if (this.userId === userId && role === "admin") {
      throw new Meteor.Error("users.methods.unassignRole.adminSelf",
                             "Cannot unassign admin role on yourself");
    }

    const user = Meteor.users.findOne(this.userId);

    if (!checkPrecedence(user, role)) {
      throw new Meteor.Error("users.methods.unassignRole.lowerPrecedence",
                             "Not authorized to unassign roles of higher precedence than your own.");
    }

    Roles.removeUsersFromRoles(userId, role);
  }
});

export const addRolesToParentMethod = new ValidatedMethod({
  name: "roles.addToParent",
  validate: new SimpleSchema({
    parent : { type: String, label: "Parent Role ID" },
    role   : { type: String, label: "Role ID" }
  }).validator({}),

  run({ parent, role }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_ROLES"])) {
      throw new Meteor.Error("roles.methods.addToParent.notAuthorized",
                             "Not authorized to manage role hierarchy.");
    }

    if (this.isSimulation) return;

    Roles.addRolesToParent(role, parent);
  }
});

export const removeRolesFromParentMethod = new ValidatedMethod({
  name: "roles.removeFromParent",
  validate: new SimpleSchema({
    parent : { type: String, label: "Parent Role ID" },
    role   : { type: String, label: "Role ID" }
  }).validator({}),

  run({ parent, role }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_ROLES"])) {
      throw new Meteor.Error("roles.methods.removeFromParent.notAuthorized",
                             "Not authorized to manage role hierarchy.");
    }

    if (this.isSimulation) return;

    Roles.removeRolesFromParent(role, parent);
  }
});
