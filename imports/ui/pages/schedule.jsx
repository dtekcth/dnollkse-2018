import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

import DocumentTitle from "/imports/ui/components/documenttitle";
import Loader from "/imports/ui/components/loader";

class SchedulePage extends Component {
  static propTypes = {
    gcalId: PropTypes.string.isRequired
  }

  render() {
    const calId = this.props.gcalId;

    if (!calId)
      return (
        <F>
          <DocumentTitle title="Schedule" />

          <div className="text-grey italic">No calendar configured</div>
        </F>
      );

    return (
      <div className="container mx-auto mt-4 mb-4">
        <DocumentTitle title="Schedule" />

        <div className="p-2 bg-white rounded">
          <iframe
            src={
              `https://calendar.google.com/calendar/embed?src=${calId}&ctz=Europe%2FStockholm&mode=WEEK`
            }
            style={{ "border": 0}}
            width="100%"
            height="800"
            frameBorder="0"
            scrolling="no"
          />
        </div>
      </div>
    );
  }
}

export default SchedulePage;