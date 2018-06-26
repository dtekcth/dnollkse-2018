import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import autobind from "autobind-decorator";

import AdminLayout from "/imports/ui/layouts/admin";
 
class AdminIndexPage extends Component {
  render() {
    return (
      <AdminLayout>
        <div className="p-4">
          <div className="flex -mx-2">
            <div className="w-1/2 px-2">
              <div className="p-2 h-64 rounded bg-white">
              </div>
            </div>
            <div className="w-1/2 px-2">
              <div className="p-2 h-64 rounded bg-white">
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminIndexPage;