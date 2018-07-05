import composeWithTracker from "/imports/helpers/composetracker";
import { Committees } from "/imports/api/committees";

import CommitteeComponent from "/imports/ui/components/committee";

export default composeWithTracker((props, onData) => {
  if (props.committeeId) {
    const handle = Meteor.subscribe("committees.id", props.committeeId);

    if (handle.ready()) {
      const result = Committees.findOne(props.committeeId);

      if (result) {
        onData(null, {
          committee: result
        });

        return;
      }
    }
  }
})(CommitteeComponent);