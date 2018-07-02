import { Mongo } from "meteor/mongo";

import SimpleSchema from "simpl-schema";

import { schemaCreatedAt } from "/imports/helpers/createdat";

const Settings = new Mongo.Collection("settings");
export default Settings;

Settings.navSchema = new SimpleSchema({
  text: {
    type: String,
    label: "NavLink Text"
  },
  link: {
    type: String,
    label: "NavLink URL"
  }
});

Settings.faqSchema = new SimpleSchema({
  question: {
    type: String,
    label: "FAQ Question"
  },
  answer: {
    type: String,
    label: "FAQ Answer"
  }
});

Settings.linkSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Link Title"
  },
  link: {
    type: String,
    label: "Link URL"
  },
  text: {
    type: String,
    label: "Link Text",
    optional: true
  }
});

Settings.docSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Document Title"
  },
  text: {
    type: String,
    label: "Document Text"
  }
});

Settings.contactListSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Contact Name"
  },
  value: {
    type: String,
    label: "Contact Value"
  }
});

Settings.contactsSchema = new SimpleSchema({
  jour: {
    type: String,
    label: "Jour Number",
    optional: true
  },
  irc: {
    type: String,
    label: "IRC Channel",
    optional: true
  },
  list: {
    type: Array,
    label: "Other Contacts",
    optional: true,
    defaultValue: []
  },
  "list.$": Settings.contactListSchema
});

Settings.schema = new SimpleSchema({
  committee: {
    type: String,
    label: "Main committee",
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  gcalId: {
    type: String,
    label: "Google Calendar ID",
    optional: true
  },
  gcalKey: {
    type: String,
    label: "Google Calendar Key",
    optional: true
  },
  setup: {
    type: Boolean,
    optional: true
  },

  navigation: {
    type: Array,
    label: "Navigation",
    optional: true,
    defaultValue: []
  },
  "navigation.$": Settings.navSchema,

  questions: {
    type: Array,
    label: "FAQ",
    optional: true,
    defaultValue: []
  },
  "questions.$": Settings.faqSchema,

  links: {
    type: Array,
    label: "Links",
    optional: true,
    defaultValue: []
  },
  "links.$": Settings.linkSchema,

  documents: {
    type: Array,
    label: "Documents",
    optional: true,
    defaultValue: []
  },
  "documents.$": Settings.docSchema,

  contacts: {
    type: Settings.contactsSchema,
    optional: true
  },

  created_at: schemaCreatedAt()
});

Settings.attachSchema(Settings.schema);
