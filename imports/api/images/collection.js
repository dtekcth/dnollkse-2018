import { FilesCollection } from "meteor/ostrio:files";

import SimpleSchema from "simpl-schema";

const checkFile = file => {
  // Allow upload files under 10MB, and only in png/jpg/jpeg formats
  if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
    return true;
  } else {
    return "Please upload image, with size equal or less than 10MB";
  }
};

/* Uploadable Images */
const Images = new FilesCollection({
  collectionName  : "images",
  storagePath     : Meteor.settings.public.fileStoragePath,
  allowClientCode : false, // Disallow remove files from Client
  onBeforeUpload  : checkFile
});
Images.collection.attachSchema(new SimpleSchema(Images.schema));

if (Meteor.isClient) {
  Meteor.subscribe("files.images.all");
}

if (Meteor.isServer) {
  Meteor.publish("files.images.all", function() {
    return Images.find().cursor;
  });

  Meteor.publish("files.images.id", function(id) {
    return Images.find(id).cursor;
  });
}

export default Images;
