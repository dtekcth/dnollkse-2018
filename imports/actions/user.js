export const userUpdate = (userId, data, isLoggingIn, ready) => {
  return {
    type: "USER_UPDATE",
    userId, data,
    isLoggingIn, ready
  };
};

export const usersUpdate = (users, ready) => {
  return {
    list: "USERS_UPDATE",
    ready
  };
};
