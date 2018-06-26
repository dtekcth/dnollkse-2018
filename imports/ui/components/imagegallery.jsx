import React, { Component } from "react";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import cx from "classnames";
import PropTypes from "prop-types";

import Loader from "/imports/ui/components/loader";
import composeWithTracker from "/imports/helpers/composetracker";
import { Images } from "/imports/api/images";

@composeWithTracker((props, onData) => {
  const handle = Meteor.subscribe("files.images.all");

  if (handle.ready()) {
    const images = Images.find().each();

    onData(null, {
      images,
      ready: true
    })

    return;
  }

  onData(null, {});
})
class ImageGallery extends Component {
  static propTypes = {
    images: PropTypes.array
  }

  static defaultProps = {
    cellWidth: 200,
    gridGap: 5
  }

  getImages() {
    const {
      cellWidth, cellHeight, cellClassName, cellProps, cellComponent,
      images
    } = this.props;

    const CellC = cellComponent || "div";

    return _.map(images, (img, i) => {
      return this.props.createCell && this.props.createCell(img, i, this.props) || (
        <div className="inline-block" key={img._id}>
          <CellC
            className={
              cx("mx-auto flex justify-center items-center", cellClassName)
            }
            style={{ width: cellWidth, height: cellHeight }}
            onClick={e => this.props.onCellClick(img, i, e)}
            {...cellProps}
          >
            <LazyLoad height={cellHeight}>
              <img className="block max-w-full max-h-full" src={img.link()} />
            </LazyLoad>
          </CellC>
        </div>
      );
    });
  }
  
  render() {
    const { cellWidth, gridGap, ready, images } = this.props;

    if (!ready)
      return (
        <Loader delay={1000} />
      );

    if (images.length == 0) {
      return (
        <h2 className="text-grey-light italic text-center py-2">No images in gallery</h2>
      );
    }

    return (
      <div
        className="gallery-list w-full"
        style={{
          "gridTemplateColumns": `repeat(auto-fit, ${cellWidth}px)`,
          "gridGap": `${gridGap}px`
        }}
      >
        {this.getImages()}
      </div>
    );
  }
}

export default ImageGallery;