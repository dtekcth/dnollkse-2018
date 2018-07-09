import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import BigCalendar from "react-big-calendar";
import { compose } from "react-komposer"
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import moment from "moment";

import DocumentTitle from "/imports/ui/components/documenttitle";
import Loader from "/imports/ui/components/loader";

const mapStateToProps = (state) => {
  return {
    settings: state.settings
  };
};

@connect(mapStateToProps)
class SchedulePage extends Component {
  render() {
    const { settings } = this.props;

    if (!settings.ready)
      return (
        <Loader delay={1000} size="lg" />
      );

    /* const timeRangeFormat = (range) =>*/
    /* moment(range.start).format("HH:mm") + " - " + moment(range.end).format("HH:mm");*/

    const calId = settings.data.gcalId;

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

          {/* <BigCalendar */}
            {/* events={events} */}
            {/* defaultView="week" */}
            {/* startAccessor="start" */}
            {/* endAccessor="end" */}
            {/* formats={{ */}
             {/* timeGutterFormat: "HH:mm", */}
             {/* agendaTimeFormat: "HH:mm", */}
             {/* agendaTimeRangeFormat: timeRangeFormat, */}
             {/* eventTimeRangeFormat: timeRangeFormat, */}
             {/* eventTimeRangeStartFormat: "HH:mm", */}
             {/* eventTimeRangeEndFormat: "HH:mm", */}
             {/* }} */}
            {/* /> */}
        </div>
      </div>
    );
  }
}

export default SchedulePage;