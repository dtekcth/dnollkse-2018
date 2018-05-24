import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";

import DashboardLayout from "/imports/ui/layouts/dashboard.jsx";
import AuthorizedLayout from "/imports/ui/layouts/authorized.jsx";

export default class HomePage extends Component {
  render() {
    return (
      <DashboardLayout>
        <AuthorizedLayout
          loginRoute="/login"
        >
          <div className="p-4">
            <h4>This is the homepage!</h4>
            <p>
              It's pretty empty here, sorry about that.
              It'll hopefully get something later, maybe. No promise though.
            </p>

            <Link
              className={
                cx("button rounded inline-block",
                   "bg-blue text-white",
                   "py-1 px-2 mt-2"
                )
              }
              to="/test"
            >
              Go somewhere useful
            </Link>
          </div>
        </AuthorizedLayout>
      </DashboardLayout>
    );
  }
}

