import { settingsUpdate } from "/imports/actions/settings";
import store from "/imports/store";

import Settings from "./../collections";

Tracker.autorun(() => {
  const handle = Meteor.subscribe("settings.all");

  let settings;

  if (handle.ready()) {
    settings = Settings.findOne({ _id: "development" });
  }

  store.dispatch(settingsUpdate(
    settings,
    handle.ready()
  ));
});
