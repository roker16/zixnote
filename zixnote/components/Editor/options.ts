import { SunEditorOptions } from "suneditor/src/options";
import katex from "katex";
import "katex/dist/katex.min.css"; // import here not in suneditor file
import { BASE_URL, isDevEnvironment } from "@/utils/helper";



export const options: SunEditorOptions = {
  rtl: false,
  // hideToolbar: true, //not working set directly this options in suneditor
  mode: "classic",
  katex: katex,
  height: "auto",
  resizingBar: false, // for hiding bottom bar
  //   className:"card shadow-xl",
  // callBackSave: (contents) => {
  //   alert(contents);
  // },
  imageUploadUrl: `${BASE_URL}/api/uploadImage`, 
  imageGalleryUrl:
    "https://etyswjpn79.execute-api.ap-northeast-1.amazonaws.com/suneditor-demo",
  videoFileInput: false,
  tabDisable: false,
  buttonList: [
    [
      // "undo",
      // "redo",
      "font",
      "fontSize",
      "formatBlock",
      // "paragraphStyle",
      "blockquote",
      "bold",
      "underline",
      "italic",
      "strike",
      "subscript",
      "superscript",
      "fontColor",
      "hiliteColor",
      // "textStyle",
      "removeFormat",
      "outdent",
      "indent",
      "align",
      // "horizontalRule",
      "list",
      // "lineHeight",
      "table",
      "link",

      // "video",
      // "audio",
      "math",
      // "imageGallery",
      "fullScreen",
      // "showBlocks",
      // "codeView",
      // "preview",
      "print",
      "save",
      // "template",
      "image",
    ],
  ],
};
