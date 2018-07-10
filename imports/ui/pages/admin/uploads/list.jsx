import _ from "lodash";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import AdminLayout from "/imports/ui/layouts/admin";
import ImageGallery from "/imports/ui/components/imagegallery";

class AdminUploadsPage extends Component {
  getFileIcon(file) {
    const mime = file.get("mime");

    if (_.startsWith(mime, "image"))
      return "file-image";
    else if (mime === "application/pdf")
      return "file-pdf";

    return "file";
  }

  createImageCell(img, func) {
    return (
      <Link
        key={img._id}
        to={`/admin/uploads/${img._id}`}
        style={{ width: 200, height: 200 }}
        className={
          cx("mx-auto flex justify-center items-center relative p-2",
             "rounded bg-white transition-shadows hover:shadow-lg")
        }
      >
        {func()}

        <div className="absolute pin-b pin-x px-2 py-1 bg-white">
          <FontAwesomeIcon icon="file-image" className="text-dtek" />
          <span className="ml-1">
            {img.meta.name}
          </span>
        </div>
      </Link>
    );
  }

  render() {
    const props = this.props;

    return (
      <AdminLayout title="Uploads">
        <div className="p-4">
          <div className="flex justify-between px-2">
            <h2 className="ml-2">Uploads</h2>

            <Link
              to="/admin/uploads/new"
              className={
                cx("button py-1 px-2 rounded-full inline-block",
                   "bg-green text-white hover:bg-green-dark transition-colors")
              }
            >
              <FontAwesomeIcon icon="plus" fixedWidth />
              <span className="ml-1">Add new upload</span>
            </Link>
          </div>

          <div className="flex justify-center mt-2">
            <ImageGallery
              createCell={this.createImageCell}
              cellClassName=""
              gridGap={20}
            />
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminUploadsPage;