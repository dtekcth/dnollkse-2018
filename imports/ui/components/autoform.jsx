import React, { Component } from "react";
import PropTypes from "prop-types";
import getFormData, { getNamedFormElementData as getFieldData } from "get-form-data";

export default class AutoForm extends Component {
  static propTypes = {
    component   : PropTypes.any,
    onChange    : PropTypes.func,
    onSubmit    : PropTypes.func,
    trim        : PropTypes.bool,
    trimOnSubmit: PropTypes.bool,
    children    : PropTypes.node,
  }
  
  static defaultProps = {
    component: "form",
    trim: false,
    trimOnSubmit: false,
  }
  
  constructor(props) {
    super(props);
    
    this._onChange = this._onChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }
  
  _onChange(e) {
    let { form, name } = e.target;
    let data = getFieldData(form, name, { trim: this.props.trim });
    let change = {};
    change[name] = data;
    this.props.onChange(e, name, data, change);
  }
  
  _onSubmit(e) {
    let data = getFormData(e.target, { trim: this.props.trimOnSubmit || this.props.trim });
    this.props.onSubmit(e, data);
  }
  
  render() {
    let {
      children, component: Component, onChange, onSubmit,
      trim, trimOnSubmit, // eslint-disable-line no-unused-vars
      ...props
    } = this.props;
    
    return (
      <Component
        {...props}
        onChange={onChange && this._onChange}
        onSubmit={onSubmit && this._onSubmit}
      >
        {children}
      </Component>
    );
  }
}
