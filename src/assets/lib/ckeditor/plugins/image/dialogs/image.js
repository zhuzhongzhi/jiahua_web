/**
 * Created by huangww on 2016/6/2.
 */

(function(){
  function imageDialog(editor){
      var proportionalScale, isSizePreload, validationMessage;
      isSizePreload = false;
      validationMessage = "图片的URL不能为空";

      return {
          allowedContent: "img[src,alt,width,height]",
          title: "插入图片",
          minWidth: 550,
          minHeight: 100,
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          contents:[{
              id: "SimpleImage",
              label: "图片信息",
              elements:[{
                  type: 'button',
                  id: 'uploadBtn',
                  label: '选择图片',
                  onClick: function () {
                      var dialog = this.getDialog();
                      showUploadImageModal(function (data) {
                        debugger;
                          var target = editor.config.filebrowserImageUrl + data.objectStorageId;
                          dialog.setValueOf("SimpleImage", "edp-src", target);
                      });
                  }
              },{
                  type: "text",
                  label: "图片URL",
                  id: "edp-src",
                  validate: CKEDITOR.dialog.validate.notEmpty( validationMessage ),
                  setup: function (element) {
                      if(element.getAttribute("src")) {
                          if(element.getAttribute("width") && element.getAttribute("height")) {
                              isSizePreload = true;
                          }
                          this.setValue( element.getAttribute("src") );
                      }
                  },
                  commit: function (element) {
                      var srcValue=this.getValue();
                      element.setAttribute("src", srcValue);
                      element.setAttribute("data-cke-saved-src", srcValue);
                  },
                  onChange: function () {
                      if(!isSizePreload) {
                          var img = new Image();
                          var dialog = this.getDialog();
                          img.onload = function(f) {
                              if(f) {
                                  proportionalScale = this.width/this.height;
                                  dialog.setValueOf("Dimensions","edp-width", this.width);
                                  dialog.setValueOf("Dimensions","edp-height", this.height);
                              }
                          };
                          img.src = this.getValue();
                      } else {
                          isSizePreload = false;
                      }
                  }
              }, {
                  type: "text",
                  label: "图片替换文本",
                  id: "edp-text-description",
                  setup: function (element) {
                      if(element.getAttribute("alt")) {
                          this.setValue( element.getAttribute("alt") );
                      }
                  },
                  commit: function (element) {
                      if(this.getValue()) {
                          element.setAttribute("alt", this.getValue());
                      }
                  }
              }]
          },
              {
                  id:"Dimensions",
                  label: "大小",
                  elements:[{
                      type: "text",
                      label: "宽度(像素)",
                      id: "edp-width",
                      setup: function (element) {
                          if(element.getAttribute("width")) {
                              this.setValue( parseInt(element.getAttribute("width")) );
                          }
                      },
                      commit: function (element) {
                          if(this.getValue()) {
                              element.setAttribute("width", parseInt(this.getValue()));
                          }
                      },
                      onKeyUp: function() {
                          var dialog = this.getDialog();
                          var width  = dialog.getValueOf("Dimensions","edp-width");
                          var height = dialog.getValueOf("Dimensions","edp-height");
                          var currentWidth = parseInt(this.getValue());
                          var newHeight = parseInt(1/proportionalScale * currentWidth);
                          this.setValue(currentWidth);
                          if (!isNaN(newHeight)) {
                              newHeight = newHeight.toFixed(0);
                              if(width && height && (newHeight != height)) {
                                  dialog.setValueOf("Dimensions","edp-height",newHeight);
                              }
                          }
                      }
                  }, {
                      type:"text",
                      label: "高度(像素)",
                      id: "edp-height",
                      setup: function (element) {
                          if(element.getAttribute("height")) {
                              this.setValue( element.getAttribute("height") );
                          }
                      },
                      commit: function (element) {
                          if(this.getValue()) {
                              element.setAttribute("height", this.getValue());
                          }
                      },
                      onKeyUp: function() {
                          var dialog = this.getDialog();
                          var width  = dialog.getValueOf("Dimensions","edp-width");
                          var height = dialog.getValueOf("Dimensions","edp-height");
                          var currentHeight = parseInt(this.getValue());
                          var newWidth = parseInt(proportionalScale * currentHeight);
                          this.setValue(currentHeight);
                          if (!isNaN(newWidth)) {
                              newWidth = newWidth.toFixed(0);
                              if(width && height && (newWidth != width)) {
                                  dialog.setValueOf("Dimensions","edp-width",newWidth);
                              }
                          }
                      }
                  }]
              }
          ],
          onShow: function () {
              var selection = editor.getSelection();
              var selector = selection.getStartElement();
              var element;

              if(selector) {
                  element = selector.getAscendant( 'img', true );
              }

              if ( !element || element.getName() != 'img' ) {
                  element = editor.document.createElement( 'img' );
                  this.insertMode = true;
              }
              else {
                  this.insertMode = false;
              }

              this.element = element;

              this.setupContent(this.element);
          },
          onOk: function() {
              var dialog = this;
              var anchorElement = this.element;

              this.commitContent(this.element);

              if(this.insertMode) {
                  editor.insertElement(this.element);
              }
          }
      };
  }
  CKEDITOR.dialog.add("image", function (editor) {
      return imageDialog(editor)
  });
})();
