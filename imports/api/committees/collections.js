import { Mongo } from "meteor/mongo";

import SimpleSchema from "simpl-schema";

import { schemaCreatedAt } from "/imports/helpers/createdat";

const Committees = new Mongo.Collection("committees");
export default Committees;

Committees.memberSchema = new SimpleSchema({
  firstname : String,
  lastname  : String,
  position  : String,
  nickname: {
    type: String,
    optional: true
  },
  phone: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  image: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
});


Committees.schema = new SimpleSchema({
  name: {
    type: String,
    label: "Committee name"
  },
  description: {
    type: String,
    label: "Committee description",
    optional: true
  },
  logo: {
    type: String,
    label: "Committee logo",
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  cover: {
    type: String,
    label: "Committee cover",
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  members: {
    type: Array,
    label: "Committee members",
    optional: true,
    defaultValue: []
  },
  "members.$": Committees.memberSchema,
  created_at: schemaCreatedAt()
});

Committees.attachSchema(Committees.schema);

Committees.helpers({
  fullMemberName(member) {
    if (_.isEmpty(member.nickname) || member.firstname == member.nickname) {
      return `${member.firstname} ${member.lastname}`;
    }

    return `${member.firstname} "${member.nickname}" ${member.lastname}`;
  }
});
