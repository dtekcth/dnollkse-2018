import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { Link } from "react-router-dom";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import moment from "moment";
import PropTypes from "prop-types";
import qs from "query-string";

import DocumentTitle from "/imports/ui/components/documenttitle";
import Loader from "/imports/ui/components/loader";

class SchedulePage extends Component {
  static propTypes = {
    gcalId  : PropTypes.string.isRequired,
    minDate : PropTypes.instanceOf(Date).isRequired,
    params  : PropTypes.string,
    text    : PropTypes.string
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

    let params = {};
    try {
      params = JSON.parse(this.props.params);
    }
    catch (e) {
    }

    const dateUrl = `https://calendar.google.com/calendar/embed?` + qs.stringify({
      src   : calId,
      color : "#BE6D00", // predefined google calendar color, orange-ish
      dates : dateStr + "/" + dateStr,
      ctz   : "Europe/Stockholm",
      mode  : "WEEK",
      ...params
    });

    return (
      <div className="container mx-auto">
        <div className="p-2 bg-white rounded">
          {
            !!this.props.text &&
            <div className="mb-3">
              <FroalaEditorView
                model={this.props.text}
              />
            </div>
          }

          <iframe
            src={dateUrl}
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