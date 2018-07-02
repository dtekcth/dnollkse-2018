import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import cx from "classnames";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import Loader from "/imports/ui/components/loader";
import ImageFileContainer from "/imports/ui/containers/imagefile";
import MainLayout from "/imports/ui/layouts/main";

import composeWithTracker from "/imports/helpers/composetracker";
import { Committees } from "/imports/api/committees";

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    committee: state.committee.data,
    ready: state.settings.ready && state.committee.ready
  };
};

@connect(mapStateToProps)
class CommitteePage extends Component {
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
    const { committee, ready } = this.props;

    if (!ready) {
      return (
        <MainLayout>
          <div className="p-4 flex justify-center">
            <Loader size="lg" delay={1000} />
          </div>
        </MainLayout>
      )
    }

    return (
      <MainLayout title="Committee">
        <div className="container mx-auto mt-4 p-4 bg-white rounded">
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
        </div>
      </MainLayout>
    );
  }
}

export default CommitteePage;