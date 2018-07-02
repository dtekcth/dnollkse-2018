import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux"

import MainLayout from "/imports/ui/layouts/main";
import Loader from "/imports/ui/components/loader";
import Markdown from "/imports/ui/components/markdown";

const mapStateToProps = (state) => {
  return {
    settings: state.settings
  };
};

@connect(mapStateToProps)
class LinksPage extends Component {
  getLinks() {
    const { settings } = this.props;

    if (!settings.ready) {
      return <Loader delay={1000} />
    }

    if (settings.data.links.length === 0) {
      return (
        <div className="bg-white rounded text-grey p-4">
          No links
        </div>
      );
    }

    return _.map(settings.data.links, (i, index) => {
      return (
        <div key={index} className="bg-white rounded p-4 mt-3">
          <h3><a className="link-dtek" href={i.link}>{i.title}</a></h3>

          {
            !_.isEmpty(i.text) && 
            <Markdown className="mt-2">
              {i.text}
            </Markdown>
          }
        </div>
      )
    });
  }

  render() {
    return (
      <MainLayout title="Links" className="bg-grey-lighter">
        <div className="container mx-auto mt-4">
          <h2 className="text-center">Links</h2>

          <div className="mb-4">
            {this.getLinks()}
          </div>
        </div>
      </MainLayout>
    );
  }
}

export default LinksPage;

