import React, { Fragment as F, Component } from "react";
import SimpleMDE from "react-simplemde-editor";
import marked from "marked";

import SelectableImage from "/imports/ui/components/selectableimage";

import "simplemde/dist/simplemde.min.css";

class RichTextEditor extends Component {
  render() {
    const { props } = this;

    const options = {
      toolbar: [
        "bold", "italic", "strikethrough", "heading-bigger", "heading-smaller", "|",

        "code", "quote", "unordered-list", "ordered-list", "|",

        "link",
        {
          name: "test",
          action: editor => {
            this.imageSelect.setState({ modal: true });
          },
          className: "fa fa-image",
          title: "Add Image"
        },
        "table", "|",

        "preview", "fullscreen", "|",

        "guide", "|",

        "undo", "redo"
      ],

      previewRender: value => {
        return marked(value);
      },

      spellChecker: false,
      indentWithTabs: false,

      ...props.options
    };

    return (
      <F>
        <SimpleMDE
          className={props.className}
          ref={e => this.editor = e}
          value={props.value}
          onChange={props.onChange}
          options={options}
        />

        <SelectableImage
          ref={e => this.imageSelect = e}
          renderImage={false}
          onChange={
            v => {
              const editor = this.editor.simplemde;
              const sel = editor.codemirror.getSelection();
              editor.codemirror.replaceSelection(`![${sel}](${v.link()})`);
            }
          }
        />
      </F>
    );
  }
}

export default RichTextEditor;