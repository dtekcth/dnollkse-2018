import _ from "lodash";
import React, { Component } from "react";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import Loader from "/imports/ui/components/loader";
import FilePreview from "/imports/ui/components/filepreview";

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
    images   : PropTypes.array,
    reversed : PropTypes.bool,
    lazyload : PropTypes.bool,
  }

  static defaultProps = {
    cellWidth  : 200,
    cellHeight : 200,
    gridGap    : 5
  }

  @autobind
  renderInnerCell(img) {
    const { cellHeight } = this.props;

    if (_.startsWith(img.get("mime"), "image")) {
      if (this.props.lazyload)
        return (
          <LazyLoad height={cellHeight}>
            <FilePreview className="block max-w-full max-h-full" file={img} />
          </LazyLoad>
        );

      return (
        <FilePreview className="block max-w-full max-h-full" file={img} />
      );
    }

    return (
      <FilePreview className="block max-w-full max-h-full" file={img} />
    );
  }

  getImages() {
    const {
      cellWidth, cellHeight, cellClassName, cellProps, cellComponent,
      filter, images
    } = this.props;

    const CellC = cellComponent || "div";

    let res = _
      .chain(images)
      .filter(filter);

    if (this.props.reversed)
      res = res.reverse();

    return res
      .map((img, i) => {
        if (this.props.createCell) {
          return this.props.createCell(img, this.renderInnerCell.bind(this, img),
                                       i, this.props);
        }

        return (
          <div className="inline-block" key={img._id}>
            <CellC
              className={
                cx("mx-auto flex justify-center items-center", cellClassName)
              }
              style={{ width: cellWidth, height: cellHeight }}
              onClick={e => this.props.onCellClick(img, i, e)}
              {...cellProps}
            >
              {this.renderInnerCell(img)}
            </CellC>
          </div>
        );
      })
      .value();
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