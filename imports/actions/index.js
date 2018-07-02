export const committeeUpdate = (committee, ready) => {
  return {
    type: "COMMITTEE_UPDATE",
    data: committee,
    ready
  };
};

export const pagesUpdate = (pages, ready) => {
  return {
    type: "PAGES_UPDATE",
    list: pages,
    ready
  };
};

export const newsUpdate = (news, ready) => {
  return {
    type: "NEWS_UPDATE",
    list: news,
    ready
  };
};

export const settingsUpdate = (settings, ready) => {
  return {
    type: "SETTINGS_UPDATE",
    data: settings,
    ready
  };
};

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

export const rolesUpdate = (roles, ready) => {
  return {
    type: "ROLES_UPDATE",
    roles,
    ready
  };
};
