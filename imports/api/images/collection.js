import { FilesCollection } from "meteor/ostrio:files";

import SimpleSchema from "simpl-schema";
import bytes from "bytes";

import { imagesUpdate } from "/imports/actions";
import store from "/imports/store";

const checkFile = file => {
  const size = bytes.parse(Meteor.settings.public.fileMaxSize);
  const regexp = new RegExp(Meteor.settings.public.fileExtensions, "i");

  // Allow upload files under 10MB, and only in png/jpg/jpeg formats
  if (file.size <= size && regexp.test(file.extension)) {
    return true;
  } else {
    return "Please upload file (" + Meteor.settings.public.fileExtensions +
      "), with size equal or less than " + bytes.format(size);
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
  Tracker.autorun(() => {
    const handle = Meteor.subscribe("files.images.all");

    store.dispatch(imagesUpdate(
      handle.ready()
    ));
  });
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
