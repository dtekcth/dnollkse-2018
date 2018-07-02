import { committeeUpdate } from "/imports/actions";
import store from "/imports/store";

import Committees from "./../collections";

const handler = () => {
  const state = store.getState();

  if (state.settings.ready) {
    const handle = Meteor.subscribe("committees.id", state.settings.data.committee);

    let committee;

    if (handle.ready()) {
      committee = Committees.findOne(state.settings.data.committee);
    }

    store.dispatch(committeeUpdate(
      committee,
      handle.ready()
    ));
  }
};

let currentSettings;
store.subscribe(c => {
  const prevSettings = currentSettings;
  currentSettings = store.getState().settings;

  if (prevSettings != currentSettings) {
    handler();
  }
});


Tracker.autorun(() => {
  handler();
});
