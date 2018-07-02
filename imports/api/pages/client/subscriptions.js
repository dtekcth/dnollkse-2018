import { pagesUpdate } from "/imports/actions";
import store from "/imports/store";

import Pages from "./../collections";

Tracker.autorun(() => {
  const handle = Meteor.subscribe("pages.all");

  let pages;

  if (handle.ready()) {
    pages = Pages.find().fetch();
  }

  store.dispatch(pagesUpdate(
    pages,
    handle.ready()
  ));
});
