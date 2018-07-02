import { Mongo } from "meteor/mongo";

import SimpleSchema from "simpl-schema";

import { schemaCreatedAt } from "/imports/helpers/createdat";

const Pages = new Mongo.Collection("pages");
export default Pages;

Pages.schema = new SimpleSchema({
  title: {
    type: String,
    label: "Page Title"
  },
  url: {
    type: String,
    label: "Page URL"
  },
  type: {
    type: String,
    label: "Page Type"
  },
  content: {
    type: Object,
    label: "Page Content",
    defaultValue: {},
    blackbox: true,
    optional: true
  },
  created_at: schemaCreatedAt()
});

Pages.attachSchema(Pages.schema);
