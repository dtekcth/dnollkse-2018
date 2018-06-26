import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import cx from "classnames";

import Loader from "/imports/ui/components/loader";

@withRouter
class NotFoundPage extends Component {
  render() {
    return (
      <div className={this.props.className}>
        <div className="bg-grey-lighter flex justify-center p-4">
          <div className="px-6 py-4 inline-block mx-auto bg-white rounded">
            <h1 className="text-dtek text-center font-bold text-5xl">404</h1>
            <h2 className="text-dtek text-center uppercase mt-1">Not found</h2>

            <button
              className={
                cx("bg-dtek py-1 px-2 rounded-full text-white w-full mt-2",
                   "hover:bg-dtek-dark transition-colors font-bold uppercase")
              }
              onClick={
                e =>
                  this.props.history.goBack()
              }
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFoundPage;