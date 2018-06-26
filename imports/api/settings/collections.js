import { Mongo } from "meteor/mongo";

import SimpleSchema from "simpl-schema";

import { schemaCreatedAt } from "/imports/helpers/createdat";

const Settings = new Mongo.Collection("settings");
export default Settings;

Settings.schema = new SimpleSchema({
  committee: {
    type: String,
    label: "Main committee",
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  setup: {
    type: Boolean,
    optional: true
  },
  created_at: schemaCreatedAt()
});

Settings.attachSchema(Settings.schema);
