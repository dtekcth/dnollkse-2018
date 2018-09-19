import React, { Component } from "react";

import CommitteeListComponent from "/imports/ui/components/committeelist";
import Loader from "/imports/ui/components/loader";

import composeWithTracker from "/imports/helpers/composetracker";
import { Committees } from "/imports/api/committees";

@composeWithTracker((props, onData) => {
  if (props.list) {
    const handle = Meteor.subscribe("committees.all");

    if (handle.ready()) {
      const result = Committees.find({
        _id: { $in: props.list }
      }).fetch();

      if (result) {
        const sorted = result.sort((a, b) => {
          if (props.list.indexOf(a._id) > props.list.indexOf(b._id)) {
            return 1;
          } else {
            return -1;
          }
        });

        onData(null, {
          committees: sorted,
          ready: true
        });

        return;
      }
    }

    onData(null, {
      ready: false
    });

    return;
  }

  onData(new Error("Missing committee list"));
})
class CommitteeListContainer extends Component {
  render() {
    const { props } = this;

    if (!props.ready) {
      return (
        <Loader classNames={{ loader: "mx-auto" }} delay={1000} size="lg" />
      );
    }

    return (
      <CommitteeListComponent {...props} committees={props.committees} />
    );
  }
}

export default CommitteeListContainer;