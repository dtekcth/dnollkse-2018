import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import SimpleSchema from "simpl-schema";

import Images from "./collection";

export const imageRemoveMethod = new ValidatedMethod({
  name: "images.remove",
  validate: new SimpleSchema({
    imageId : { type: String, label: "Image ID", regEx: SimpleSchema.RegEx.Id }
  }).validator({}),

  run({ imageId }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ["ADMIN_MANAGE_UPLOADS"])) {
      throw new Meteor.Error("images.methods.remove.notAuthorized",
                             "Not authorized to manage images");
    }

    if (this.isSimulation) return;

    Images.find(imageId).remove();
  }
});
