import _ from "lodash";

export const either = (condition, a, b) => {
  return condition ? a : b;
};


const textSub = {
  S : "s",
  W : "w"
};
export const textFix = (text) =>
  _.map(_.toUpper(text), c => {
    if (textSub[c]) return textSub[c];

    return c;
  });
