export const committeeUpdate = (committee, ready) => {
  return {
    type: "COMMITTEE_UPDATE",
    data: committee,
    ready
  };
};
