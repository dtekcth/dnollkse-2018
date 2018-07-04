import { Meteor } from "meteor/meteor";
import { Roles } from 'meteor/alanning:roles';

import SimpleSchema from "simpl-schema";
import _ from "lodash";

const createDefaultPermissions = () => {
  console.log("Create defaults");

  const permissions = {
    admin: [
      "ADMIN_MANAGE_ROLES",
      "ADMIN_SETTINGS",
    ],
    moderator: [
      "ADMIN_VIEW",
      "ADMIN_MANAGE_USERS",
      "ADMIN_MANAGE_COMMITTEES",
      "ADMIN_MANAGE_UPLOADS",
      "ADMIN_MANAGE_PAGES",
    ],
    env: [
      "ENVIRONMENT_VIEW"
    ],
    user: [
    ]
  };

  const allPermissions = [];
  _.each(permissions, (perms, role) => {
    _.each(perms, perm => {
      console.log(`Created role "${perm}" for role "${role}"`);

      // Roles.createRole(perm, { unlessExists: true });
      Roles.addRolesToParent(perm, role);

      allPermissions.push(perm);
    });
  });

  Meteor.roles.update({
    _id: { $in: allPermissions }
  }, {
    $set: {
      permission: true
    }
  }, { multi: true });
};

Meteor.startup(() => {
  const rolesCount = Roles.getAllRoles().count();

  const permissions = [
    "ADMIN_VIEW",
    "ADMIN_MANAGE_ROLES",
    "ADMIN_MANAGE_USERS",
    "ADMIN_MANAGE_COMMITTEES",
    "ADMIN_MANAGE_UPLOADS",
    "ADMIN_MANAGE_PAGES",
    "ADMIN_MANAGE_NEWS",
    "ADMIN_SETTINGS",
    "ENVIRONMENT_VIEW",
  ];

  Roles.createRole("admin", { unlessExists: true });
  Roles.createRole("moderator", { unlessExists: true });
  Roles.createRole("user", { unlessExists: true });
  Roles.createRole("env", { unlessExists: true });

  Roles.addRolesToParent("moderator", "admin");
  Roles.addRolesToParent("user", "moderator");

  _.each(permissions, perm => {
    Roles.createRole(perm, { unlessExists: true });
  });

  Meteor.roles.update({
    _id: { $in: permissions }
  }, {
    $set: {
      permission: true
    }
  }, { multi: true });

  if (rolesCount == 0) {
    createDefaultPermissions();
  }
});

Accounts.config({
  forbidClientAccountCreation: true
});

Accounts.onCreateUser((options, user) => {
  console.log(options, user);

  Roles.addUsersToRoles(user._id, [ "user" ]);
    
  return user;
});

Accounts.onLogin(data => {
  const user = data.user;
});

// Ensuring every user has an email address, should be in server-side code
Accounts.validateNewUser((user) => {
  new SimpleSchema({
    _id: { type: String },
    username: { type: String },
    createdAt: { type: Date },
    services: { type: Object, blackbox: true }
  }).validate(user);

  // throw new Meteor.Error(403, "Not authorized to create new users");


  // Return true to allow user creation to proceed
  return true;
});

