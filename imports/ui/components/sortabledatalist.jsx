import _ from "lodash";
import React, { Component } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove
} from "react-sortable-hoc";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import update from "immutability-helper";
import PropTypes from "prop-types";

import IconButton from "/imports/ui/components/iconbutton";

const DragHandle = SortableHandle(() =>
  <div className="text-grey p-2">
    <FontAwesomeIcon icon="bars" fixedWidth />
  </div>
);

const Item = SortableElement(props =>
  <li className={cx("list-reset p-2 bg-white rounded", props.className)}>
    <div className="flex items-center">
      <DragHandle />

      <div className="flex-grow overflow-hidden mx-2">
        {props.renderItem(props)}
      </div>

      <div>
        <IconButton
          type="button"
          icon="times"
          onClick={props.onRemove}
        />
      </div>
    </div>
  </li>
);

const ItemList = SortableContainer(
  ({ renderItem, items, model, onChange, onRemove }) => {
    return (
      <ul className="list-reset">
        {
          items.map((value, index) => (
            <Item
              className={index != items.length - 1 && "mb-2"}
              renderItem={renderItem}
              key={`item-${index}`}
              index={index}
              value={value}
              onChange={q => onChange && onChange(index, { ...model, ...value, ...q })}
              onRemove={() => onRemove && onRemove(index)}
            />
          ))
        }
      </ul>
    );
  }
);

class SortableDataList extends Component {
  static propTypes = {
    renderItem: PropTypes.func.isRequired,
  }

  static defaultProps = {
    
  }

  state = {
    items: []
  }

  componentDidMount() {
    this.setState({ items: this.props.items });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.items != this.props.items) {
      this.setState({ items: this.props.items });
    }
  }

  @autobind
  addItem(newItem = {}) {
    const items = update(this.state.items, { $push: [ {
      ...this.props.model, ...newItem
    } ] });

    this.setState({ items });

    this.props.onChange && this.props.onChange(items);
  }

  @autobind
  removeItem(index) {
    const items = update(this.state.items, { $splice: [[ index, 1 ]] });
    this.setState({ items });

    this.props.onChange && this.props.onChange(items);
  }

  @autobind
  handleItemChanged(index, i) {
    const items = update(this.state.items, { [index]: { $merge: i } });
    this.setState({ items });

    this.props.onChange && this.props.onChange(items);
  }

  @autobind
  onSortEnd({ oldIndex, newIndex }) {
    const items = arrayMove(this.state.items, oldIndex, newIndex);
    this.setState({ items });

    this.props.onChange && this.props.onChange(items);
  }

  render() {
    if (this.props.placeholder && this.state.items.length === 0) {
      return (
        <div className="text-grey p-3 bg-white rounded">
          {this.props.placeholder}
        </div>
      )
    }

    return (
      <ItemList
        useDragHandle
        useWindowAsScrollContainer
        lockToContainerEdges
        lockAxis="y"
        items={this.state.items}
        model={this.props.model}
        onSortEnd={this.onSortEnd}
        onChange={this.handleItemChanged}
        onRemove={this.removeItem}
        renderItem={this.props.renderItem}
        {...this.props.listProps}
      />
    );
  }
}

export default SortableDataList;