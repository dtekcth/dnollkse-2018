import { newsUpdate } from "/imports/actions";
import store from "/imports/store";

import News from "./../collections";

Tracker.autorun(() => {
  const handle = Meteor.subscribe("news.all");

  let news;

  if (handle.ready()) {
    news = News.find().fetch();
  }

  store.dispatch(newsUpdate(
    news,
    handle.ready()
  ));
});
