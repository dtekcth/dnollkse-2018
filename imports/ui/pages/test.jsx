import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";

import AdminLayout from "/imports/ui/layouts/admin";
import AuthorizedLayout from "/imports/ui/layouts/authorized";

class TestPage extends Component {
  render() {
    return (
      <DashboardLayout>
        <AuthorizedLayout
          loginRoute="/login"
        >
          <div className="p-4">
            <h4>This is a test!</h4>
            <p>
            </p>

            <Link
              className={
                cx("button rounded inline-block",
                   "bg-blue text-white",
                   "py-1 px-2 mt-2"
                )
              }
              to="/"
            >
              Go home
            </Link>
          </div>
        </AuthorizedLayout>
      </DashboardLayout>
    );
  }
}

export default TestPage;