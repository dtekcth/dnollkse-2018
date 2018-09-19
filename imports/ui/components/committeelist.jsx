import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import cx from "classnames";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import ImageFileContainer from "/imports/ui/containers/imagefile";

class CommitteeListComponent extends Component {
  static defaultProps = {
    committee: {}
  }

  getMembers() {
    const { committee } = this.props;

    return _.map(committee.members, (m, index) => {
      const img = (
        <div className="w-full lg:w-1/2 px-2 flex items-center">
          <ImageFileContainer
            className="block rounded-lg shadow-lg"
            imageId={m.image}
          />
        </div>
      );
      const text = (
        <div className="w-full lg:w-1/2 px-2 mt-1 flex flex-col justify-center">
          <h3 className="text-dtek">
            {committee.fullMemberName(m)}
          </h3>
          <h3 className="mt-2 italic">
            {m.position}
          </h3>
          <div className="mt-2 text-justify-word leading-loose">
            <FroalaEditorView
              model={m.description}
            />
          </div>
        </div>
      );

      let content = (
        <F>
          {img}
          {text}
        </F>
      );

      if (index % 2 == 0)
        content = (
          <F>
            {text}
            {img}
          </F>
        );
      
      return (
        <F key={index}>
          <div className="lg:hidden mb-6 -mx-2">
            {img}

            <div className="mt-4">
              {text}
            </div>
          </div>

          <div className="hidden lg:flex w-full mb-7 -mx-2">
            {content}
          </div>
        </F>
      );
    });
  }

  getMembers(committee) {
    const count = committee.members.length;

    return _.map(committee.members, (m, index) => {
      return (
        <div
          key={index}
          className={
            cx("flex justify-between p-2",
               index !== count - 1 && "border-b border-dashed border-grey-light")
          }
        >
          <div className="flex items-center">
            {committee.fullMemberName(m)}
          </div>
          <div className="italic text-right">
            {m.position}
          </div>
        </div>
      );
    });
  }

  render() {
    const { committees, itemClassName } = this.props;

    return _.map(committees, c => {
      return (
        <div
          key={c._id}
          className={cx("mt-2 relative", itemClassName)}
        >
          <h1 className="font-geomancy tracking-wide text-center">
            {c.name}
          </h1>

          {
            !_.isEmpty(c.cover) && 
            <ImageFileContainer
              className="block w-full mt-1 rounded-lg"
              imageId={c.cover}
            />
          }

          <div
            className="px-2 mt-3 text-justify-word leading-loose"
          >
            <FroalaEditorView
              model={c.description}
            />
          </div>

          <div className="flex flex-wrap items-center -mx-2 mt-4">
            {
              !_.isEmpty(c.logo) &&
              <div className="w-full sm:w-auto">
                <ImageFileContainer
                  imgClassName="mx-auto sm:mx-2 block w-48"
                  imageId={c.logo}
                />
              </div>
            }

            <div className="flex-grow px-2 mt-3 sm:mt-0">
              {this.getMembers(c)}
            </div>
          </div>
        </div>
      );
    });
  }
}

export default CommitteeListComponent;