import _ from "lodash";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import cx from "classnames";
import PropTypes from "prop-types";

import LetterAvatar from "/imports/ui/components/letteravatar";
import Loader from "/imports/ui/components/loader";
import ImageFileContainer from "/imports/ui/containers/imagefile";
import AuthorizedLayout from "/imports/ui/layouts/authorized";
import BaseLayout from "/imports/ui/layouts/base";
import MainLayout from "/imports/ui/layouts/main";
import ForbiddenPage from "/imports/ui/pages/forbidden";

const mapStateToProps = (state) => {
  return {
    user: state.user,
    committee: state.committee,
  };
};

@withRouter
@connect(mapStateToProps)
class AdminLayout extends Component {
  static propTypes = {
    className : PropTypes.string,
    content   : PropTypes.object,
    children  : PropTypes.node,
    title     : PropTypes.string
  }

  render() {
    const props = this.props;

    const linksArr = [
      [ "/admin"            , "Dashboard" ],
      [ "/admin/users"      , "Users & Permissions" ],
      [ "/admin/committees" , "Committees" ],
      [ "/admin/pages"      , "Pages" ],
      [ "/admin/uploads"    , "Uploads" ],
      [ "/admin/settings"   , "Settings" ],
    ];

    const links = _.map(linksArr, (item, index) => {
      const active = props.location.pathname == item[0];

      if (active) {
        return (
          <span key={index} className="navitem tracking-wide active">
            {item[1]}
          </span>
        );
      }

      return (
        <Link key={index} to={item[0]} className="navitem tracking-wide">
          {item[1]}
        </Link>
      );
    });

    const username = props.user.data && (
      <div className="navitem px-2">
        <LetterAvatar
          seed={props.user.data.username}
          letter={_.first(props.user.data.username)}
        />
      </div>
    );

    return (
      <BaseLayout title={props.title ? `Admin - ${props.title}` : "Admin"}>
        <AuthorizedLayout
          roles={["ADMIN_VIEW"]}
          loginRoute="/login"
          failureContent={
            <MainLayout>
              <ForbiddenPage />
            </MainLayout>
          }
          loadingContent={
            <Loader size="xl" centered delay={1000} />
          }
        >
          <div className={
            cx("layout-admin min-h-screen bg-grey-lighter",
               props.className)
          }>
            <div className="topbar">
              <div className="topbar-main w-full">
                <div className="flex items-center text-white text-2xs sm:text-sm lg:text-base mx-2 lg:mx-4">
                  <div className="navitem">
                    {
                      props.committee.ready &&
                      <ImageFileContainer
                        className="w-10 h-10 block"
                        imageId={props.committee.data.logo}
                      />
                    }
                  </div>

                  <div className="navitem tracking-wide font-geomancy ml-2">
                    ADMINIsTRATION
                  </div>

                  <div className="navitem flex-grow"></div>

                  <Link to="/" className="navitem block px-2">
                    Back to site
                  </Link>

                  {username}
                </div>
              </div>

              <div className="topbar-nav w-full">
                <div className="flex items-center text-white text-2xs sm:text-sm lg:text-base mx-2 lg:mx-4">
                  {links}
                </div>
              </div>
            </div>

            <div className="relative wrapper" ref={node => this.content = node}>
              {props.content || props.children}
            </div>
          </div>
        </AuthorizedLayout>
      </BaseLayout>
    );
  }

}

export default AdminLayout;