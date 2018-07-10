import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

class FilePreview extends Component {
  static propTypes = {
    className   : PropTypes.string,
    placeholder : PropTypes.string,
    alt         : PropTypes.string,
    file        : PropTypes.object
  }

  getFile() {
    const { file, alt, placeholder, className } = this.props;

    if (!file && placeholder) {
      return (
        <img
          className={className}
          alt={alt}
          src={placeholder}
        />
      );
    }

    const src = file.link();

    const mime = file.get("mime");

    if (mime) {
      switch (mime) {
        case "application/pdf":
          return (
            <div className={className}>
              <FontAwesomeIcon icon="file-pdf" size="5x" className="text-dtek" />
            </div>
          );
      }
    }

    return (
      <img
        className={className}
        alt={alt}
        src={src}
      />
    );
  }

  render() {
    return this.getFile();
  }
}

export default FilePreview;