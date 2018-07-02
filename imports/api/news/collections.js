import { Mongo } from "meteor/mongo";

import SimpleSchema from "simpl-schema";

import { schemaCreatedAt } from "/imports/helpers/createdat";

const News = new Mongo.Collection("news");
export default News;

News.schema = new SimpleSchema({
  title: {
    type: String,
    label: "Post Title"
  },
  content: {
    type: String,
    label: "Post Content"
  },
  created_at: schemaCreatedAt()
});

News.attachSchema(News.schema);
