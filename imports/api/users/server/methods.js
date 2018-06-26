import { userAuthenticateMethod } from "./../methods";

import krb5 from "kerberos";

const Kerberos = new krb5.Kerberos();

userAuthenticateMethod.run = ({ cid, password }) => {
  return new Promise((resolve, reject) => {
    Kerberos.authUserKrb5Password(cid, password, '', async (err, ok) => {
      if (err) return reject(
        new Meteor.Error("users.authenticate.error",
                         "Something went wrong during authentication")
      );

      if (!ok) return reject(
        new Meteor.Error("users.authenticate.invalid",
                         "Invalid credentials")
      );

      let user = Accounts.findUserByUsername(cid);

      if (!user) {
        const userId = Accounts.createUser({
          username: cid
        });

        user = Meteor.users.findOne(userId);
      }

      const stampedLoginToken = Accounts._generateStampedLoginToken();
      Accounts._insertLoginToken(user._id, stampedLoginToken);

      resolve(stampedLoginToken);
    });
  });
};
