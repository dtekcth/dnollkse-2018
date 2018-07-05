import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import cx from "classnames";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import ImageFileContainer from "/imports/ui/containers/imagefile";

class CommitteeComponent extends Component {
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

  render() {
    const { committee } = this.props;

    return (
      <F>
        <h1 className="font-geomancy tracking-wide text-center">
          {committee.name}
        </h1>

        <div
          className="px-2 mt-3 text-justify-word leading-loose"
        >
          <FroalaEditorView
            model={committee.description}
          />
        </div>

        <div className="mt-4">
          {this.getMembers()}
        </div>
      </F>
    );
  }
}

export default CommitteeComponent;