import React from "react";
import cx from "classnames";

import Dropdown from "/imports/ui/components/dropdown";
import RichTextEditor from "/imports/ui/components/richtexteditor";
import DatePicker from "react-datepicker";

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
  else if (props.richtext) {
    input = (
      <RichTextEditor
        className="appearance-none bg-transparent w-full text-grey-darker mt-1"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        id={props.id}
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
  else if (props.datepicker) {
    input = (
      <div className="date-picker w-full">
        <DatePicker
          className="text-input-sm w-full mt-1"
          onChange={props.onChange}
          selected={props.value}
        />
      </div>
    );
  }
  else
    input = (
      <input
        className="text-input-sm w-full mt-1"
        placeholder={props.placeholder}
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