import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import cx from "classnames";
import PropTypes from "prop-types";

import BaseLayout from "/imports/ui/layouts/base";
import ImageFileContainer from "/imports/ui/containers/imagefile";

const mapStateToProps = (state) => {
  return {
    committee: state.committee.data,
    ready: state.settings.ready
  };
};

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

  render() {
    const { props } = this;
    const coverStyle = {
      backgroundImage: "url(https://dnollk.se/uploads/2018/omslag2018.JPG)"
    }

    const linkCls = "";
    const linkHelper = (href, text) => (
      <li className="navitem inline-block text-white">
        <Link
          to={href}
          className={
            cx("navlink inline-block px-1 py-2 xl:px-2 lg:py-3")
          }>
          {text}
        </Link>
      </li>
    );

    return (
      <BaseLayout title={props.title}>
        <div className={cx("layout-main", props.className)}>
          <header>
            {/* <div className="header-cover" style={coverStyle}></div> */}
            <div className="relative">
              <ImageFileContainer className="block" imageId={props.committee.cover} />

              <nav className="navbar w-full absolute pin-b mb-3">
                <div className="container mx-auto">
                  <div className="flex mx-2 relative">
                    <div className="w-32 lg:w-48">
                      <ImageFileContainer
                        className="w-32 lg:w-48 block absolute pin-b logo"
                        imageId={props.committee.logo}
                      />
                    </div>
                    <ul className={
                      cx("flex-grow list-reset tracking-wide font-geomancy",
                         "whitespace-no-wrap",
                         "text-3xs sm:text-xs lg:text-base ml-2 lg:ml-4")
                    }>
                      {linkHelper("/", "startsida")}
                      {linkHelper("/committee/2018", "NOLLDEKLARATION")}
                      {linkHelper("/admin", "schema")}
                      {linkHelper("#", "arr")}
                      {linkHelper("#", "dokument")}
                      {linkHelper("#", "länkar")}
                      {linkHelper("#", "om...")}
                      {linkHelper("#", "faq")}
                      {linkHelper("#", "kontakt")}
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
              <div className="flex -mx-3">
                <div className="pl-3 pr-4">
                  <ImageFileContainer
                    className="w-24 block"
                    imageId={props.committee.logo}
                  />
                </div>
                <div className="flex-1 p-3">
                  <h2 className="text-white font-geomancy tracking-wide">DNollK 2018</h2>
                  <span className="inline-block text-grey-dark tracking-wide text-base mt-1">
                    Chalmers University of Technology
                  </span>
                </div>
                <div className="flex-1 p-3">
                  <ul className="list-reset tracking-wide text-grey text-base leading-loose">
                    <li><Link to="/"              >Startsida</Link></li>
                    <li><Link to="/committee/2018">DNollK 2018</Link></li>
                    <li><Link to="/schedule"      >Schema</Link></li>
                    <li><Link to="/events"        >Arr</Link></li>
                    <li><Link to="/docs"          >Dokument</Link></li>
                    <li><Link to="/links"         >Länkar</Link></li>
                    <li><Link to="/about"         >Om...</Link></li>
                    <li><Link to="/faq"           >Faq</Link></li>
                    <li><Link to="/contact"       >Kontakt</Link></li>
                    <li><Link to="/environment"   >Environment</Link></li>
                    <li><Link to="/login"         >Login</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </BaseLayout>
    );
  }

}

export default MainLayout;