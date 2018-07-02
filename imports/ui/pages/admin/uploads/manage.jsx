import _ from "lodash";
import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import { connect } from "react-redux";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import InputGroup from "/imports/ui/components/inputgroup";
import AutoForm from "/imports/ui/components/autoform";
import DroppableImage from "/imports/ui/components/droppableimage";
import AdminLayout from "/imports/ui/layouts/admin";

import composeWithTracker from "/imports/helpers/composetracker";
import { Images, imageRemoveMethod } from "/imports/api/images";

const mapStateToProps = (state) => {
  return {
    ready: state.images.ready
  };
};

@connect(mapStateToProps)
@composeWithTracker((props, onData) => {
  if (props.new) {
    onData(null, {});

    return;
  }

  const { uploadId } = props.match.params;

  let image = Images.findOne(uploadId);

  onData(null, {
    image,
  });
})
class AdminUploadsManagePage extends Component {
  state = {
    name        : "",
    description : ""
  }

  updateInfo() {
    const { image } = this.props;
    if (!image) return;

    this.setState({
      name        : image.meta.name,
      description : image.meta.description,
    });
  }

  componentDidMount() {
    if (this.props.ready)
      this.updateInfo();
  }

  componentDidUpdate(prevProps) {
    if (this.props.ready != prevProps.ready)
      this.updateInfo();
  }

  @autobind
  handleSubmit(e) {
    e.preventDefault();

    const { name, description, image } = this.state;

    if (!this.droppableImage) return;

    if (!image) {
      NotificationManager.error("Must provide an image!");
      return;
    }

    if (_.isEmpty(name)) {
      NotificationManager.error("Must provide an image name!");
      return;
    }

    this.droppableImage.upload((err, file) => {
      setTimeout(() => {
        this.props.history.push("/admin/uploads");
      }, 500);
    }, {
      name, description
    });
  }

  @autobind
  handleDelete(e) {
    if (this.props.image)
      imageRemoveMethod.call({ imageId: this.props.image._id}, () => {
        this.props.history.push("/admin/uploads");
      });
  }

  render() {
    const props = this.props;

    let deleteBtn;
    if (!props.new)
      deleteBtn = (
        <button
          className={
            cx("py-1 px-2 rounded-full inline-block",
               "bg-red text-white hover:bg-red-dark transition-colors")
          }
          onClick={this.handleDelete}
        >
          <FontAwesomeIcon icon="trash" fixedWidth />
          <span className="font-semibold ml-1">Delete</span>
        </button>
      );

    return (
      <AdminLayout title="Manage Upload">
        <div className="progress h-2">
          <div
            className="progress-bar active bg-dtek progress-bar-striped progress-bar-animated"
            style={{
              width: this.state.progress + "%",
              maxWidth: this.state.progress + "%"
            }}
          ></div>
        </div>

        <div className="p-4">
          <div className="flex justify-between">
            <h2 className="ml-2">
              {
                this.props.new ? "Manage Upload" : "New Upload"
              }
            </h2>
            {deleteBtn}
          </div>

          <AutoForm onSubmit={this.handleSubmit}>
            <div className="mt-2 p-2 rounded bg-white">
              <div className="flex -mx-1">
                <div className="w-1/3 md:w-1/4 xl:w-1/5 px-1">
                  <DroppableImage
                    enableDrop
                    onUploadProgress={
                      p =>
                        this.setState({
                          progress: p
                        })
                    }
                    onChange={f => this.setState({ image: f })}
                    ref={e => this.droppableImage = e}
                    defaultSrc="/static/images/placeholder-1000x700.png"
                  />
                </div>

                <div className="w-2/3 md:w-3/4 xl:w-4/5 px-1">
                  <InputGroup
                    id="name"
                    text="Image name"
                    value={this.state.name || ""}
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                  <InputGroup
                    textarea
                    className="mt-1"
                    id="description"
                    value={this.state.description || ""}
                    onChange={e => this.setState({ description: e.target.value })}
                    text="Description (optional)"
                    rows="4"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                {
                  this.props.new &&
                  <button
                    className={
                      cx("py-1 px-2 rounded-full inline-block",
                         "bg-green text-white hover:bg-green-dark transition-colors")
                    }
                    >
                    <span className="font-semibold">Save</span>
                    <FontAwesomeIcon className="ml-1" icon="check" fixedWidth />
                  </button>
                }
              </div>
            </div>
          </AutoForm>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminUploadsManagePage;