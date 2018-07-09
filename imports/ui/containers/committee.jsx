import React, { Component } from "react";

import CommitteeComponent from "/imports/ui/components/committee";
import Loader from "/imports/ui/components/loader";

import composeWithTracker from "/imports/helpers/composetracker";
import { Committees } from "/imports/api/committees";

@composeWithTracker((props, onData) => {
  if (props.committeeId) {
    const handle = Meteor.subscribe("committees.id", props.committeeId);

    if (handle.ready()) {
      const result = Committees.findOne(props.committeeId);

      if (result) {
        onData(null, {
          committee: result,
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

  onData(new Error("Missing committee ID"));
})
class CommitteeContainer extends Component {
  render() {
    const { props } = this;

    if (!props.ready) {
      return (
        <Loader delay={1000} size="lg" />
      );
    }

    return (
      <CommitteeComponent committee={props.committee} />
    );
  }
}

export default CommitteeContainer;