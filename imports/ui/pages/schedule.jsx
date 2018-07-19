import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

import DocumentTitle from "/imports/ui/components/documenttitle";
import Loader from "/imports/ui/components/loader";

class SchedulePage extends Component {
  static propTypes = {
    gcalId  : PropTypes.string.isRequired,
    minDate : PropTypes.instanceOf(Date).isRequired
  }

  render() {
    const calId = this.props.gcalId;

    if (!calId)
      return (
        <F>
          <div className="text-grey italic">No calendar configured</div>
        </F>
      );

    const date = moment.max(moment(), moment(this.props.minDate));
    const dateStr = date.format("YYYYMMDD");

    return (
      <div className="container mx-auto">
        <div className="p-2 bg-white rounded">
          <iframe
            src={
              `https://calendar.google.com/calendar/embed?dates=${dateStr}/${dateStr}&src=${calId}&ctz=Europe%2FStockholm&mode=WEEK&`
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