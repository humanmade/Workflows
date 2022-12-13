"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withRenderProps;
function withRenderProps(hoc) {
  var RenderPropsComponent = function RenderPropsComponent(props) {
    return props.children(props);
  };
  return hoc(RenderPropsComponent);
}