import React, { Component } from "react";
import clickOutsideDecorator from "react-click-outside";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import IconButton from "/imports/ui/components/iconbutton"

@clickOutsideDecorator
class PopupTrigger extends Component {
  static propTypes = {
    position           : PropTypes.string,
    trigger            : PropTypes.node,
    children           : PropTypes.node,
    handleClickOutside : PropTypes.func
  }

  @autobind
  handleClickOutside(e) {
    this.props.handleClickOutside && this.props.handleClickOutside(e);
  }

  render() {
    return (
      <div className="popup-trigger">
        {this.props.trigger}

        <div data-position={this.props.position} className="popup-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default class Popup extends Component {
  static propTypes = {
    className          : PropTypes.string,
    open               : PropTypes.bool,
    position           : PropTypes.string,
    inverted           : PropTypes.bool,
    trigger            : PropTypes.node,
    children           : PropTypes.node,
    handleClickOutside : PropTypes.func
  }

  render() {
    const { open, inverted } = this.props;
    let cls = cx("popup", inverted && "inverted", open && "visible", this.props.className);

    return (
      <div className={cls}>
        <PopupTrigger {...this.props}>
          {this.props.children}
        </PopupTrigger>
      </div>
    );
  }
}

export class UncontrolledPopup extends Component {
  state = {
    open: false
  }

  @autobind
  handleClickOutside() {
    this.close();
  }

  open() {
    this.setState({
      open: true
    });
  }

  close() {
    this.setState({
      open: false
    });
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    return (
      <Popup
        {...this.props}
        handleClickOutside={this.handleClickOutside}
        open={this.state.open}
      />
    );
  }
}

export class ConfirmationPopup extends UncontrolledPopup {
  static propTypes = {
    onCancel  : PropTypes.func,
    onConfirm : PropTypes.func,
  }

  @autobind
  onCancelled(e) {
    e.preventDefault();

    this.props.onCancel && this.props.onCancel();

    this.close();
  }

  @autobind
  onConfirmed(e) {
    e.preventDefault();

    this.props.onConfirm && this.props.onConfirm();

    this.close();
  };

  render() {
    return (
      <Popup
        {...this.props}
        handleClickOutside={this.handleClickOutside}
        open={this.state.open}
      >
        <div className="text-md font-bold">Are you sure?</div>
        {
          this.props.text &&
          <div className="text-sm block whitespace-no-wrap mt-1">
            {this.props.text}
          </div>
        }

        <div className="flex justify-end mt-1">
          <IconButton
            icon="times"
            className="mr-1"
            onClick={this.onCancelled}
          />

          <IconButton
            icon="check"
            color="green"
            onClick={this.onConfirmed}
          />
        </div>
      </Popup>
    );
  }
}