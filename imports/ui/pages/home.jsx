import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";

import DocumentTitle from "/imports/ui/components/documenttitle";

class HomePage extends Component {
  render() {
    return (
      <div className="container mx-auto mt-4 p-4 bg-white rounded">
        <DocumentTitle title="Home" />

        <h4>This is the homepage!</h4>
        <p>
          It's pretty empty here, sorry about that.
          It'll hopefully get something later, maybe. No promise though.
        </p>

        <div className="my-2">
          <iframe
            src="https://snapwidget.com/embed/555594"
            className="snapwidget-widget"
            allowtransparency="true"
            frameBorder="0"
            scrolling="no"
            style={{
              border: "none",
              overflow: "hidden",
              width: "495px",
              height: "330px"
            }}
          >
          </iframe>
        </div>
        
      </div>
    );
  }
}

export default HomePage;