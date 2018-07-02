export const pagesUpdate = (pages, ready) => {
  return {
    type: "PAGES_UPDATE",
    list: pages,
    ready
  };
};
