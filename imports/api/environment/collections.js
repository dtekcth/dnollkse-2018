import { Mongo } from "meteor/mongo";

import SimpleSchema from "simpl-schema";

import { schemaCreatedAt } from "/imports/helpers/createdat";

const Environment = new Mongo.Collection("environment");
export default Environment;

Environment.schema = new SimpleSchema({
  date: {
    type: Date,
    label: "Date"
  },
  temperature: {
    type: Number,
    label: "Temperature"
  },
  humidity: {
    type: Number,
    label: "Humidity"
  },
  entry_id: {
    type: Number,
    label: "Entry ID"
  },
  created_at: schemaCreatedAt()
});

Environment.attachSchema(Environment.schema);
