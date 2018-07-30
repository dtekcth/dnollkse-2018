import React, { Fragment as F, Component } from "react";
import SimpleMDE from "react-simplemde-editor";
import autobind from "autobind-decorator";
import CodeMirror from "codemirror";
import marked from "marked";

import SelectableImage from "/imports/ui/components/selectableimage";

import "simplemde/dist/simplemde.min.css";

import FroalaEditor from "react-froala-wysiwyg";
import $ from "jquery";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
require("froala-editor/js/froala_editor.pkgd.min.js")($);
window.$ = $;

$.FroalaEditor.DefineIcon("insertMeteorImage", { NAME: "image" });
$.FroalaEditor.RegisterCommand("insertMeteorImage", {
  title: "Insert image",
  focus: false,
  undo: false,
  refreshAfterCallback: false,
  callback: function() {
    const r = this.$el.react;

    r.imageSelect.setState({ modal: true });
  }
});

class RichTextEditor extends Component {
  state = {}

  componentDidMount() {
    this.editor.$editor.react = this;
  }

  render() {
    const { props } = this;

    /* const options = {*/
    /* toolbar: [*/
    /* "bold", "italic", "strikethrough", "heading-bigger", "heading-smaller", "|",*/
    /* */
    /* "code", "quote", "unordered-list", "ordered-list", "|",*/
    /* */
    /* "link",*/
    /* {*/
    /* name: "test",*/
    /* action: editor => {*/
    /* this.imageSelect.setState({ modal: true });*/
    /* },*/
    /* className: "fa fa-image",*/
    /* title: "Add Image"*/
    /* },*/
    /* "table", "|",*/
    /* */
    /* "preview", "fullscreen", "|",*/
    /* */
    /* "guide", "|",*/
    /* */
    /* "undo", "redo"*/
    /* ],*/
    /* */
    /* previewRender: value => {*/
    /* return marked(value);*/
    /* },*/
    /* */
    /* spellChecker: false,*/
    /* indentWithTabs: false,*/
    /* */
    /* ...props.options*/
    /* };*/

    const toolbar = [
      "fullscreen", "bold", "italic", "underline", "strikeThrough", "subscript", "superscript", "|",
      "fontFamily", "fontSize", "color", "inlineStyle", "paragraphStyle", "|",
      "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent", "quote", "-",
      "insertLink", "insertMeteorImage", "insertTable", "|",
      "emoticons", "specialCharacters", "insertHR", "selectAll", "clearFormatting", "|",
      "print", "spellChecker", "help", "html", "|",
      "undo", "redo"
    ]

    return (
      <F>
        {/* <SimpleMDE
            className={props.className}
            ref={e => this.editor = e}
            value={props.value}
            onChange={props.onChange}
            options={options}
            /> */}

        {this.state.temp}

        <div className={props.className}>
          <FroalaEditor
            ref={e => this.editor = e }
            tag="textarea"
            config={{
              height: props.height || 400,
              toolbarButtons: toolbar,
              toolbarSticky: false,
              imageEditButtons: [
                "imageAlign", "imageCaption", "imageRemove", "|",
                "imageLink", "linkOpen", "linkEdit", "linkRemove", "-",
                "imageDisplay", "imageStyle", "imageAlt", "imageSize"
              ],
              imageInsertButtons: [ "imageBack" ],
              quickInsertButtons: [ "insertMeteorImage", "table", "ul", "ol", "hr" ],
            }}
            model={this.props.value}
            onModelChange={props.onChange}
          />
        </div>

        <SelectableImage
          ref={e => this.imageSelect = e}
          renderImage={false}
          onChange={
            v => {
              this.editor.$element.froalaEditor("image.insert", v.link(), true);
            }
          }
        />
      </F>
    );
  }
}

export default RichTextEditor;