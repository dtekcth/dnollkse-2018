import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { NotificationManager } from "react-notifications";
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
import marked from "marked";
import PropTypes from "prop-types";

import AutoForm from "/imports/ui/components/autoform";
import IconButton from "/imports/ui/components/iconbutton";
import InputGroup from "/imports/ui/components/inputgroup";
import Loader from "/imports/ui/components/loader";
import RichTextEditor from "/imports/ui/components/richtexteditor";
import SelectableImage from "/imports/ui/components/selectableimage";
import AdminLayout from "/imports/ui/layouts/admin";

import composeWithTracker from "/imports/helpers/composetracker";

import {
  Committees,
  committeeCreateMethod,
  committeeUpdateMethod,
} from "/imports/api/committees";

const DragHandle = SortableHandle(() =>
  <div className="text-grey p-1">
    <FontAwesomeIcon icon="bars" fixedWidth />
  </div>
);

const MemberItem = SortableElement(({ className, value, onChange, onRemove }) => {
  return (
    <li className={cx("list-reset p-2 bg-white rounded", className)}>
      <div className="bg-white rounded flex items-center -mx-1">
        <DragHandle />

        <div className="flex items-center w-1/3 md:w-1/4 xl:w-1/5 px-1">
          <SelectableImage
            placeholder="/static/images/placeholder-member.png"
            imageId={value.image}
            onChange={
              img => onChange && onChange({ image: img._id })
            }
          />
        </div>

        <div className="w-2/3 md:w-3/4 xl:w-4/5 px-1">
          <InputGroup
            value={value.firstname || ""}
            placeholder="First name..."
            text="First name"
            onChange={
              e => onChange && onChange({ firstname: e.target.value })
            }
          />

          <InputGroup
            className="mt-1"
            value={value.lastname || ""}
            placeholder="Last name..."
            text="Last name"
            onChange={
              e => onChange && onChange({ lastname: e.target.value })
            }
          />

          <InputGroup
            className="mt-1"
            value={value.nickname || ""}
            placeholder="Nickname..."
            text="Nickname"
            onChange={
              e => onChange && onChange({ nickname: e.target.value })
            }
          />

          <InputGroup
            className="mt-1"
            value={value.position || ""}
            placeholder="Position..."
            text="Position"
            onChange={
              e => onChange && onChange({ position: e.target.value })
            }
          />

          <InputGroup
            className="mt-1"
            richtext
            value={value.description || ""}
            placeholder="Description..."
            text="Description"
            onChange={
              value => onChange && onChange({ description: value })
            }
          />
        </div>

        <div>
          <IconButton
            type="button"
            icon="times"
            onClick={onRemove}
          />
        </div>
      </div>
    </li>
  );
});

const MemberList = SortableContainer(({ items, onChange, onRemove }) => {
  return (
    <ul className="list-reset mt-2">
      {
        items.map((value, index) => (
          <MemberItem
            className={index != items.length - 1 && "mb-2"}
            key={`item-${index}`}
            index={index}
            value={value}
            onChange={m => onChange && onChange(index, { ...value, ...m })}
            onRemove={() => onRemove && onRemove(index)}
          />
        ))
      }
    </ul>
  );
});

@composeWithTracker((props, onData) => {
  if (props.new) {
    onData(null, { ready: true });
    return;
  }

  const { committeeId } = props.match.params;
  const handle = Meteor.subscribe("committees.id", committeeId)

  if (handle.ready()) {
    const committee = Committees.findOne(committeeId);

    onData(null, {
      committee,
      ready: true
    });

    return;
  }

  onData(null, { ready: false });
})
class AdminManageCommitteePage extends Component {
  static propTypes = {
    committee: PropTypes.object
  }

  state = {
    name: "",
    description: "",
    members: []
  }

  componentDidUpdate(prevProps) {
    if (this.props.ready != prevProps.ready) {
      const { committee } = this.props;

      if (!committee) return;

      this.setState({
        name        : committee.name,
        description : committee.description,
        logo        : committee.logo,
        cover       : committee.cover,
        members     : committee.members
      });
    }
  }

  @autobind
  handleSave(e, data) {
    e.preventDefault();

    const { name, description, logo, cover, members } = this.state;

    const cb = (e, id) => {
      if (e) {
        NotificationManager.error(e.reason);
        console.error(e);

        return;
      }
      
      NotificationManager.success("Saved changes!");

      if (this.props.new) {
        this.props.history.push("/admin/committees/" + id);
      }
    }

    if (this.props.new) {
      committeeCreateMethod.call({
        name, description, logo, cover, members
      }, cb);
    }
    else {
      committeeUpdateMethod.call({
        committeeId: this.props.committee._id,
        name, description, logo, cover, members
      }, cb);
    }
  }

  @autobind
  handleAddMember(e) {
    const newMember = {
      firstname   : "",
      lastname    : "",
      nickname    : "",
      description : "",
      position    : ""
    };

    this.setState({
      members: update(this.state.members, { $push: [ newMember ] })
    });
  }

  @autobind
  handleRemoveMember(index) {
    this.setState({
      members: update(this.state.members, { $splice: [[ index, 1 ]] })
    });
  }

  @autobind
  handleMemberChanged(index, m) {
    this.setState({
      members: update(this.state.members, {
        [index]: {
          $merge: m
        }
      })
    })
  }

  @autobind
  handleDataChanged(field, value) {
    this.setState({
      [field]: value
    });
  }

  @autobind
  onSortEnd({ oldIndex, newIndex }) {
    this.setState({
      members: arrayMove(this.state.members, oldIndex, newIndex),
    });
  }

  render() {
    const { props } = this;

    if (!props.new && !props.ready)
      return (
        <AdminLayout>
          <div className="p-4 flex justify-center">
            <Loader size="lg" delay={1000} />
          </div>
        </AdminLayout>
      );

    const saveBtn = (
      <button
        className={
          cx("py-1 px-2 rounded-full inline-block",
             "bg-green text-white hover:bg-green-dark transition-colors")
        }
      >
        <FontAwesomeIcon icon="check" fixedWidth />
        <span className="ml-1">Save</span>
      </button>
    );

    let memberList = (
      <div className="text-grey p-2">No questions</div>
    );

    if (this.state.members.length > 0) {
      memberList = (
        <MemberList
          helperClass="dragging"
          useDragHandle
          useWindowAsScrollContainer
          lockToContainerEdges
          lockAxis="y"
          items={this.state.members}
          onSortEnd={this.onSortEnd}
          onChange={this.handleMemberChanged}
          onRemove={this.handleRemoveMember}
        />
      );
    }

    return (
      <AdminLayout title="Manage Committee">
        <div className="p-4">
          <div className="px-1">
            <h2 className="ml-2">
              <a href="#" className="link-dtek" onClick={props.history.goBack}>
                <FontAwesomeIcon icon="chevron-left" fixedWidth size="sm" />
              </a>
              <span className="ml-2">Committee:</span>
              <span className="ml-1 text-dtek">
                {props.new ? "New" : props.committee.name}
              </span>
            </h2>

            <AutoForm
              onSubmit={this.handleSave}
              trimOnSubmit
            >
              <div className="mt-2 p-2 rounded bg-white">
                <div className="w-2/3 mx-auto">
                  <h3 className="ml-2 text-grey-dark">Cover</h3>

                  <SelectableImage
                    className="mt-1"
                    placeholder="/static/images/placeholder-cover.png"
                    imageId={this.state.cover}
                    onChange={
                      img =>
                        this.setState({ cover: img._id })
                    }
                  />
                </div>

                <div className="flex -mx-1 mt-2">
                  <div className="flex items-center w-1/2 md:w-1/3 xl:w-1/4 px-1">
                    <div>
                      <h3 className="ml-2 text-grey-dark">Logo</h3>

                      <SelectableImage
                        className="mt-1"
                        imageId={this.state.logo}
                        placeholder="/static/images/placeholder-logo.png"
                        onChange={
                          img =>
                            this.setState({ logo: img._id })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-1/2 md:w-2/3 xl:w-3/4 px-1">
                    <h3 className="ml-2 text-grey-dark">Info</h3>

                    <InputGroup
                      className="mt-1"
                      text="Name"
                      value={this.state.name}
                      onChange={e => this.handleDataChanged("name", e.target.value)}
                    />

                    <RichTextEditor
                      className="mt-1"
                      value={this.state.description}
                      onChange={
                        value =>
                          this.handleDataChanged("description", value)
                      }
                    />
                  </div>
                </div>
              </div>

              {
                this.state.members.length > 0 ?
                <F>
                  <div className="flex justify-end mt-2">
                    {saveBtn}
                  </div>
                  <div className={
                    cx("mt-4", this.state.members.length > 0 ?
                       "border-grey-light" : "border-transparent")
                  }>
                    <h3 className="ml-2 text-grey-dark">Members</h3>

                    <div className="mt-1">
                      {memberList}
                    </div>

                  </div>
                </F> :
                <div></div>
              }

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className={
                    cx("mr-1 py-1 px-2 rounded-full inline-block",
                       "bg-blue text-white hover:bg-blue-dark transition-colors")
                  }
                  onClick={this.handleAddMember}
                >
                  <FontAwesomeIcon icon="user-plus" fixedWidth />
                  <span className="ml-1">Add member</span>
                </button>

                {saveBtn}
              </div>
            </AutoForm>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminManageCommitteePage;