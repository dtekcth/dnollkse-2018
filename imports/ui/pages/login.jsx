import React, { Fragment as F, Component } from "react";
import { withRouter } from "react-router-dom";
import cx from "classnames";
import qs from "query-string";

import { textFix } from "/imports/helpers/utils";

import AuthorizedLayout from "/imports/ui/layouts/authorized";
import BaseLayout from "/imports/ui/layouts/base";
import LoginForm from "/imports/ui/components/loginform";

import { userAuthenticateMethod } from "/imports/api/users";

@withRouter
class LoginPage extends Component {
  render() {
    const params = qs.parse(this.props.location.search);

    return (
      <BaseLayout className="bg-grey-lighter h-screen" title="Login">
        <AuthorizedLayout noLoad fail successRoute={params.redirect || "/"}>
          <div className="flex justify-center">
            <div className="w-full max-w-xs mt-2">
              <div className="absolute-center">
                <h1 className="uppercase block tracking-wide text-center text-dtek font-geomancy mb-2">
                  {textFix("Admin")}
                </h1>

                <LoginForm
                  className={
                    cx("bg-white shadow rounded-sm p-4 relative loginbox")
                  }
                >
                </LoginForm>
              </div>
            </div>
          </div>
        </AuthorizedLayout>
      </BaseLayout>
    );
  }
}

export default LoginPage;