import { Roles } from "meteor/alanning:roles";

import _ from "lodash";
import React, { Component } from "react";
import Drawer from "react-motion-drawer";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import cx from "classnames";
import PropTypes from "prop-types";

import Loader from "/imports/ui/components/loader";
import ImageFileContainer from "/imports/ui/containers/imagefile";
import BaseLayout from "/imports/ui/layouts/base";

const mapStateToProps = (state) => {
  return {
    settings  : state.settings.data,
    committee : state.committee.data,
    user      : state.user,
    ready     : state.committee.ready && state.settings.ready
  };
};

const textSub = {
  S : "s",
  W : "w"
}
const textFix = (text) =>
  _.map(_.toUpper(text), c => {
    if (textSub[c]) return textSub[c];

    return c;
  });

@connect(mapStateToProps)
class MainLayout extends Component {
  static propTypes = {
    className : PropTypes.string,
    title     : PropTypes.string,
    content   : PropTypes.object,
    children  : PropTypes.node
  }

  static defaultProps = {
    committee: {}
  }

  state = {
    drawer: false
  }

  render() {
    const { props } = this;

    if (!props.ready) {
      return (
        <Loader delay={1000} centered size="lg" />
      );
    }

    const links = _.map(props.settings.navigation, (s, i) => {
      return (
        <li key={i} className="navitem inline-block text-white">
          <Link
            to={s.link}
            className={
              cx("navlink inline-block px-2 py-2 xl:px-2 lg:py-3")
            }
          >
            {textFix(s.text)}
          </Link>
        </li>
      );
    });

    const listNavs = [ ...props.settings.navigation ];
    if (Roles.userIsInRole(props.user.userId, ["ENVIRONMENT_VIEW"]))
      listNavs.push({ link: "/environment", text: "Environment" })

    if (Roles.userIsInRole(props.user.userId, ["ADMIN_VIEW"]))
      listNavs.push({ link: "/admin", text: "Admin" })

    if (!props.user.userId)
      listNavs.push({ link: "/login", text: "Login" })
    else 
      listNavs.push({ link: "/logout", text: "Logout" })

    const footerLinks = _.map(listNavs, (s, i) => {
      return (
        <li key={i}>
          <Link to={s.link}>{s.text}</Link>
        </li>
      );
    });

    const drawerLinks = _.map(listNavs, (s, i) => {
      return (
        <li key={i} className="drawer-item">
          <Link
            to={s.link}
            className={
              cx("drawerlink block px-4 py-2")
            }
            onClick={() => this.setState({ drawer: false })}
          >
            {textFix(s.text)}
          </Link>
        </li>
      );
    });

    return (
      <BaseLayout title={props.title}>
        <div className={cx("layout-main min-h-full", props.className)}>
          <header>
            <div className="relative">
              <ImageFileContainer
                className="block w-full"
                imageId={props.committee.cover}
                defaultSrc="/static/images/placeholder-cover.png"
              />

              <nav className="navbar w-full absolute pin-b mb-1 sm:mb-3">
                {/* Mobile navbar */}
                <div className="md:hidden container mx-auto relative">
                  <div className="mx-2">
                    <ul className="list-reset">
                      <li className="navitem inline-block text-white">
                        <a
                          href="#"
                          className="block p-1 sm:p-2"
                          onClick={
                            e => {
                              e.preventDefault();
                              this.setState({ drawer: true });
                            }
                          }
                        >
                          <FontAwesomeIcon icon="bars" />
                        </a>
                      </li>
                    </ul>
                  </div>

                  <Link to="/" className="absolutex-center block w-16 sm:w-24">
                    <ImageFileContainer
                      className="block absolute pin-b -mb-2 sm:-mb-4"
                      imageId={props.committee.logo}
                    />
                  </Link>
                </div>

                {/* Main navbar */}
                <div className="hidden md:block container mx-auto">
                  <div className="flex mx-2">
                    <Link to="/" className="flex-no-shrink block w-24 lg:w-32 xl:w-48 relative">
                      <ImageFileContainer
                        className="block absolute pin-b -mb-4 lg:-mb-4 xl:-mb-8"
                        imageId={props.committee.logo}
                      />
                    </Link>

                    <ul className={
                      cx("flex-grow list-reset tracking-wide font-geomancy",
                         "whitespace-no-wrap",
                         "text-3xs sm:text-2xs lg:text-sm ml-2")
                    }>
                      {links}
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </header>

          <div className="wrapper" ref={node => this.content = node}>
            {props.content || props.children}
          </div>

          <footer className="bg-black-ash p-5">
            <div className="container mx-auto">
              <div className="flex flex-wrap -mx-3">
                <div className="w-full md:w-1/3 pl-3 pr-4">
                  <ImageFileContainer
                    className="w-24 mx-auto block"
                    imageId={props.committee.logo}
                  />
                </div>
                <div className="w-full md:w-1/3 p-3 text-center">
                  <h2 className="text-white font-geomancy tracking-wide">DNollK 2018</h2>
                  <span className="inline-block text-grey-dark tracking-wide text-base mt-1">
                    Chalmers University of Technology
                  </span>
                </div>
                <div className="w-full md:w-1/3 p-3">
                  <ul className="list-reset tracking-wide text-grey text-base leading-loose">
                    {footerLinks}
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>

        <Drawer
          open={this.state.drawer}
          onChange={
            open =>
              this.setState({ drawer: open })
          }
          noTouchOpen
          width={300}
          className="bg-black-shark tracking-wide font-geomancy text-white"
        >
          <ul className="list-reset" style={{ width: 300 }}>
            <li className="px-3 py-2 text-xl text-center">
              <Link
                to="/"
                className="mx-auto block w-24"
                onClick={() => this.setState({ drawer: false })}
              >
                <ImageFileContainer className="block" imageId={props.committee.logo} />
              </Link>

              <div className="mt-2">
                {textFix(props.committee.name)}
              </div>
            </li>

            {drawerLinks}
          </ul>
        </Drawer>
      </BaseLayout>
    );
  }

}

export default MainLayout;