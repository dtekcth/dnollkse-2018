import React, { Component } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";

import Images from "/imports/api/images/collection";

class DroppableImage extends Component {
  static propTypes = {
    imageId          : PropTypes.string,
    onUploadStart    : PropTypes.func,
    onUploadProgress : PropTypes.func,
    onUpload         : PropTypes.func,
  }

  state = {
    imageFile: this.props.imageId
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  onDropImage(files) {
    if (files.length === 0) return;
    let file = files[0];

    this.setState({
      file
    });
  }

  upload(cb) {
    const { file } = this.state;

    if (!file) return;

    const uploadInstance = Images.insert({
      file: file,
      streams: "dynamic",
      chunkSize: "dynamic",
      onProgress: (progress, fileData) => { // eslint-disable-line no-unused-vars
        if (!this.unmounted)
          this.setState({
            progress: progress
          });

        this.props.onUploadProgress && this.props.onUploadProgress(progress, fileData);
      },
      onStart: (err, fileData) => { // eslint-disable-line no-unused-vars
        if (!this.unmounted)
          this.setState({
            uploading: true,
            showProgress: true,
            progress: 0
          });

        this.props.onUploadStart && this.props.onUploadStart(fileData);
      },
      onUploaded: (err, fileRef) => {
        if (err) return;

        if (!this.unmounted)
          this.setState({
            uploading: false,
            fileRef: fileRef,
            imageId: fileRef._id,
            progress: 100
          });

        this.props.onUpload && this.props.onUpload(fileRef);

        setTimeout(() => {
          if (!this.unmounted)
            this.setState({
              showProgress: false
            });
        }, 500);

        cb(err, fileRef);
      },
      onError: (err, fileData) => { // eslint-disable-line no-unused-vars
        if (!this.unmounted)
          this.setState({
            uploading: false,
            showProgress: false,
          });
      }
    }, false);

    uploadInstance.on("end", (err, fileRef) => {
      if (err) {
        throw err;
      }
      else {
        if (!this.unmounted)
          this.setState({
            fileRef: fileRef
          });
      }
    });

    uploadInstance.start();
  }

  render() {
    let props = this.props;

    let progressCls = "droppable-image-progress progress";
    if (this.state.showProgress) {
      progressCls += " active";
    }

    if (props.enableDrop) {
      return (
        <Dropzone
          className={"droppable-image " + props.className}
          activeClassName="active"
          multiple={false}
          onDrop={this.onDropImage.bind(this)}
        >
          <img
            alt={props.alt}
            src={this.state.file ? this.state.file.preview : props.defaultSrc}
          />

          {
            this.state.uploading
              ? <div className="spinner spinner-inverse spinner-big"></div>
              : <span className="text-sm text-grey-light pointer-events-none droppable-image-label">
                  Click or drop image
                </span>
          }

          <div className={progressCls}>
            <div
              className="progress-bar bg-success progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: this.state.progress + "%", maxWidth: this.state.progress + "%" }}
              aria-valuenow={this.state.progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </Dropzone>
      );
    }
    else {
      return (
        <img
          alt={props.alt}
          src={this.state.file ? this.state.file.preview : props.defaultSrc}
        />
      );
    }
  }
}

export default DroppableImage;