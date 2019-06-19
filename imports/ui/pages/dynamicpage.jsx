import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { compose } from "react-komposer"
import { connect } from "react-redux"
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import cx from "classnames";
import { withRouter } from "react-router-dom";

import MainLayout from "/imports/ui/layouts/main";
import DocumentTitle from "/imports/ui/components/documenttitle";
import Loader from "/imports/ui/components/loader";
import DynamicLink from "/imports/ui/components/dynamiclink";
import CommitteeContainer from "/imports/ui/containers/committee";
import CommitteeListContainer from "/imports/ui/containers/committeelist";

import NewsPage from "/imports/ui/pages/news";
import SchedulePage from "/imports/ui/pages/schedule";
import ContactsPage from "/imports/ui/pages/contacts";

const mapStateToProps = (state) => {
  return {
    pages: state.pages
  };
};

@withRouter
@connect(mapStateToProps)
@compose((props, onData) => {
  const page = _.find(props.pages.list, p => p._id == props.pageId);
  onData(null, {
    page
  });
})
class DynamicPage extends Component {
  state = {}

  checkRedirect() {
    const { page, pages, history } = this.props;
    if (!pages.ready) return;
    if (page.type !== "redirect") return;

    const reg = /^(?:[a-z]+:)?\/\//i
    if (reg.test(page.content.url)) {
      location.replace(page.content.url);
    }
    else {
      history.replace(page.content.url);
    }
  }

  componentDidMount() {
    this.checkRedirect();
  }

  componentDidUpdate() {
    this.checkRedirect();
  }

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

          <div className="mt-2">
            <FroalaEditorView
              model={i.text}
            />
          </div>
        </div>
      )
    });
  }

  getForm() {
    const { page } = this.props;

    return (
      <div className="bg-white rounded p-2 mb-4">
        <h2 className="text-center">
          <DynamicLink to={page.content.url} className="link-dtek">
            {page.title}
          </DynamicLink>
        </h2>

        <div>
          <div
            className="px-2 mt-3 text-justify-word leading-loose"
          >
            <FroalaEditorView
              model={page.content.text}
            />
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

      case "form":
        return this.getForm();

      case "document":
        return (
          <F>
            <h2 className="text-center">{page.title}</h2>

            <div className="bg-white rounded p-4 mt-3 mb-4">
              <FroalaEditorView
                model={page.content.text}
              />
            </div>
          </F>
        );

      case "committee":
        return (
          <div className="bg-white rounded p-4 mt-3 mb-4">
            <CommitteeContainer committeeId={page.content.committeeId} />
          </div>
        );

      case "studentDivision":
        const cls = "block p-2 rounded-full text-center transition-all";
        const clsActive = cx(cls, "bg-dtek text-white hover:box-shadow-dtek");
        const clsInactive = cx(cls, "bg-white text-black hover:box-shadow-grey");
        const tab = this.state.tab;

        const listPreds = _.map(page.content.predecessors, c => c.committeeId);
        const listOthers = _.map(page.content.others, c => c.committeeId);

        return (
          <F>
            <div className="flex font-bold -mx-2">
              <div className="flex-1 px-2">
                <a
                  href="#"
                  className={_.isEmpty(tab) || tab == "committee" ? clsActive : clsInactive}
                  onClick={
                    e => {
                      e.preventDefault();
                      this.setState({ tab: "committee" });
                    }
                  }
                >
                  Kommitté
                </a>
              </div>

              <div className="flex-1 px-2">
                <a
                  href="#"
                  className={tab == "predecessors" ? clsActive : clsInactive}
                  onClick={
                    e => {
                      e.preventDefault();
                      this.setState({ tab: "predecessors" });
                    }
                  }
                >
                  Pateter
                </a>
              </div>

              <div className="flex-1 px-2">
                <a
                  href="#"
                  className={tab == "division" ? clsActive : clsInactive}
                  onClick={
                    e => {
                      e.preventDefault();
                      this.setState({ tab: "division" });
                    }
                  }
                >
                  Sektionen
                </a>
              </div>
            </div>

            {
              (_.isEmpty(tab) || tab === "committee") &&
              <div className="bg-white rounded p-4 mt-3 mb-4">
                <CommitteeContainer committeeId={page.content.committeeId} />
              </div>
            }

            <div className="mb-4">
              {
                tab === "predecessors" &&
                <CommitteeListContainer
                  itemClassName="bg-white rounded p-4 mt-4"
                  list={listPreds}
                />
              }

              {
                tab === "division" &&
                <CommitteeListContainer
                  itemClassName="bg-white rounded p-4 mt-4"
                  list={listOthers}
                />
              }
            </div>
          </F>
        );

      case "news":
        return (
          <F>
            <h2 className="text-center">{page.title}</h2>

            <div className="mt-4 mb-4">
              <NewsPage />
            </div>
          </F>
        );

      case "schedule":
        return (
          <F>
            <h2 className="text-center">{page.title}</h2>

            <div className="mt-4 mb-4">
              <SchedulePage
                gcalId={page.content.gcalId}
                minDate={page.content.minDate}
                text={page.content.text}
                params={page.content.params}
              />
            </div>
          </F>
        );

      case "contacts":
        return (
          <F>
            <h2 className="text-center">{page.title}</h2>

            <div className="mt-4 mb-4">
              <ContactsPage />
            </div>
          </F>
        );

      case "committeelist":
        console.log(page);
        return (
          <div className="bg-white rounded p-4 mt-3 mb-4">
            {/* <CommitteeListContainer committeeId={page.content.committeeId} /> */}
          </div>
        );
    }
  }

  render() {
    const { page, pages } = this.props;

    return (
      <MainLayout>
        <div className="container mx-auto mt-4">
          <DocumentTitle
            title={
              pages.ready ? page.title : "Loading..."
            }
          />

          {this.getContent()}
        </div>
      </MainLayout>
    );
  }
}

export default DynamicPage;