import React from "react";
import cx from "classnames";

import Dropdown from "/imports/ui/components/dropdown";

const InputGroup = (props) => {
  let input;

  if (props.textarea) {
    input = (
      <textarea
        className="appearance-none bg-transparent w-full text-grey-darker mt-1"
        value={props.value}
        onChange={props.onChange}
        id={props.id}
        rows={props.rows}
      />
    );
  }
  else if (props.dropdown) {
    input = (
      <Dropdown
        value={props.value}
        className="appearance-none bg-transparent w-full text-grey-darker mt-1"
        placeholder={props.placeholder}
        noResultsText={props.noResultsText}
        onChange={props.onChange}
        options={props.options}
      />
    );
  }
  else
    input = (
      <input
        className="appearance-none bg-transparent w-full text-grey-darker mt-1"
        value={props.value}
        onChange={props.onChange}
        id={props.id}
      />
    );

  return (
    <div className={cx("bg-grey-lighter rounded-sm px-2 py-1", props.className)}>
      <small className="uppercase text-sm text-grey-darker">
        {props.text}
      </small>
      {input}
    </div>
  );
};

export default InputGroup;