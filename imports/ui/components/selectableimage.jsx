import React, { Fragment as F, Component } from "react";
import Modal from "react-responsive-modal";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import ImageGallery from "/imports/ui/components/imagegallery";
import ImageFileContainer from "/imports/ui/containers/imagefile";

class SelectableImage extends Component {
  static propTypes = {
    imageId     : PropTypes.string,
    imageId     : PropTypes.string,
    renderImage : PropTypes.bool,
    onChange    : PropTypes.func,
  }

  static defaultProps = {
    placeholder: "/static/images/placeholder-1000x700.png",
    renderImage: true
  }

  state = {
    modal   : false,
    imageId : this.props.imageId
  }

  componentDidUpdate(prevProps) {
    if (prevProps.imageId !== this.props.imageId) {
      this.setState({
        imageId: this.props.imageId
      });
    }
  }

  @autobind
  handleSelectImage(img, i, e) {
    e.preventDefault();

    this.setState({
      imageId: img._id,
      modal: false
    });

    this.props.onChange && this.props.onChange(img);
  }

  @autobind
  handleCloseModal() {
    this.setState({
      modal: false
    });
  }

  render() {
    const { props } = this;

    return (
      <F>
        {
          props.renderImage &&
          <a
            className={cx("block", props.className)}
            href="#"
            onClick={
              e => {
                e.preventDefault();
                this.setState({ modal: true });
              }
            }
            >
            <ImageFileContainer
              imageId={this.state.imageId}
              defaultSrc={props.placeholder}/>
          </a>
        }

        <Modal
          classNames={{
            modal: "w-4/5 p-2 rounded"
          }}
          onClose={() => {}}
          showCloseIcon={false}
          open={this.state.modal}
        >
          <div className="flex justify-between">
            <h3 className="ml-2">Select an image</h3>
            <button
              className={
                cx("inline-flex justify-center items-center",
                   "w-6 h-6 rounded-full transition-colors",
                   "bg-transparent hover:bg-red",
                   "text-red hover:text-white")
              }
              onClick={this.handleCloseModal}
            >
              <FontAwesomeIcon icon="times" fixedWidth size="sm" />
            </button>
          </div>

          <div className="mt-2">
            <ImageGallery
              cellClassName={
                cx("p-1 rounded bg-white transition-shadows",
                   "shadow hover:shadow-lg cursor-pointer")
              }
              onCellClick={this.handleSelectImage}
              cellWidth={100}
              cellHeight={100}
            />
          </div>
        </Modal>
      </F>
    );
  }
}

export default SelectableImage;