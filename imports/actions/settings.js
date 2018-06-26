export const settingsUpdate = (settings, ready) => {
  return {
    type: "SETTINGS_UPDATE",
    data: settings,
    ready
  };
};
