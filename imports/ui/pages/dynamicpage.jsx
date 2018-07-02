import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { compose } from "react-komposer"
import { connect } from "react-redux"
import { Link } from "react-router-dom";

import MainLayout from "/imports/ui/layouts/main";
import Loader from "/imports/ui/components/loader";
import Markdown from "/imports/ui/components/markdown";

const mapStateToProps = (state) => {
  return {
    pages: state.pages
  };
};

@connect(mapStateToProps)
@compose((props, onData) => {
  const page = _.find(props.pages.list, p => p._id == props.pageId);
  onData(null, {
    page
  });
})
class DynamicPage extends Component {
  getListItems() {
    const { page } = this.props;

    if (page.content.items.length === 0) {
      return (
        <div className="bg-white rounded text-grey p-4">
          No items
        </div>
      );
    }

    return _.map(page.content.items, (i, index) => {
      return (
        <div key={index} className="bg-white rounded p-4 mt-3">
          <h3>{i.title}</h3>

          <Markdown className="mt-2">
            {i.text}
          </Markdown>
        </div>
      )
    });
  }

  getForm() {
    const { page } = this.props;

    return (
      <div className="bg-white rounded p-2 mb-4">
        <h2 className="text-center">
          <Link to={page.content.url} className="link-dtek">
            {page.title}
          </Link>
        </h2>

        <div>
          <div
            className="px-2 mt-3 text-justify-word leading-loose"
          >
            <Markdown>
              {page.content.text}
            </Markdown>
          </div>

          <iframe
            style={{
              width: "100%",
              height: "800px"
            }}
            className="mt-4"
            src={page.content.embed}
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            width="100%"
          />
        </div>
      </div>
    );
  }

  getContent() {
    const { pages, page } = this.props;

    if (!pages.ready) {
      return <Loader delay={1000} />
    }

    switch (page.type) {
      case "list":
        return (
          <F>
            <h2 className="text-center">{page.title}</h2>

            <div className="mb-4">
              {this.getListItems()}
            </div>
          </F>
        );

        break;

      case "form":
        return this.getForm();
        break;
    }
  }

  render() {
    const { page } = this.props;

    return (
      <MainLayout title="Documents" className="bg-grey-lighter">
        <div className="container mx-auto mt-4">
          {this.getContent()}
        </div>
      </MainLayout>
    );
  }
}

export default DynamicPage;