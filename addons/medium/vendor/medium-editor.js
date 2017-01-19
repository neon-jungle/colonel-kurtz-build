/*global module, console, define*/

'use strict';

function MediumEditor(elements, options) {
    'use strict';
    return this.init(elements, options);
}

if (typeof module === 'object') {
    module.exports = MediumEditor;
}
// AMD support
else if (typeof define === 'function' && define.amd) {
        define(function () {
            'use strict';
            return MediumEditor;
        });
    }

(function (window, document) {
    'use strict';

    function extend(b, a) {
        var prop;
        if (b === undefined) {
            return a;
        }
        for (prop in a) {
            if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop) === false) {
                b[prop] = a[prop];
            }
        }
        return b;
    }

    function isDescendant(parent, child) {
        var node = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    // http://stackoverflow.com/questions/5605401/insert-link-in-contenteditable-element
    // by Tim Down
    function _saveSelection() {
        var i,
            len,
            ranges,
            sel = this.options.contentWindow.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            ranges = [];
            for (i = 0, len = sel.rangeCount; i < len; i += 1) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        }
        return null;
    }

    function _restoreSelection(savedSel) {
        var i,
            len,
            sel = this.options.contentWindow.getSelection();
        if (savedSel) {
            sel.removeAllRanges();
            for (i = 0, len = savedSel.length; i < len; i += 1) {
                sel.addRange(savedSel[i]);
            }
        }
    }

    // http://stackoverflow.com/questions/1197401/how-can-i-get-the-element-the-caret-is-in-with-javascript-when-using-contentedi
    // by You
    function getSelectionStart() {
        var node = this.options.ownerDocument.getSelection().anchorNode,
            startNode = node && node.nodeType === 3 ? node.parentNode : node;
        return startNode;
    }

    // http://stackoverflow.com/questions/4176923/html-of-selected-text
    // by Tim Down
    function getSelectionHtml() {
        var i,
            html = '',
            sel,
            len,
            container;
        if (this.options.contentWindow.getSelection !== undefined) {
            sel = this.options.contentWindow.getSelection();
            if (sel.rangeCount) {
                container = this.options.ownerDocument.createElement('div');
                for (i = 0, len = sel.rangeCount; i < len; i += 1) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (this.options.ownerDocument.selection !== undefined) {
            if (this.options.ownerDocument.selection.type === 'Text') {
                html = this.options.ownerDocument.selection.createRange().htmlText;
            }
        }
        return html;
    }

    // https://github.com/jashkenas/underscore
    function isElement(obj) {
        return !!(obj && obj.nodeType === 1);
    }

    MediumEditor.prototype = {
        defaults: {
            allowMultiParagraphSelection: true,
            anchorInputPlaceholder: 'Paste or type a link',
            anchorPreviewHideDelay: 500,
            buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote'],
            buttonLabels: false,
            checkLinkFormat: false,
            cleanPastedHTML: false,
            delay: 0,
            diffLeft: 0,
            diffTop: -10,
            disableReturn: false,
            disableDoubleReturn: false,
            disableToolbar: false,
            disableEditing: false,
            elementsContainer: false,
            contentWindow: window,
            ownerDocument: document,
            firstHeader: 'h3',
            forcePlainText: true,
            placeholder: 'Type your text',
            secondHeader: 'h4',
            targetBlank: false,
            anchorTarget: false,
            anchorButton: false,
            anchorButtonClass: 'btn',
            extensions: {},
            activeButtonClass: 'medium-editor-button-active',
            firstButtonClass: 'medium-editor-button-first',
            lastButtonClass: 'medium-editor-button-last'
        },

        // http://stackoverflow.com/questions/17907445/how-to-detect-ie11#comment30165888_17907562
        // by rg89
        isIE: navigator.appName === 'Microsoft Internet Explorer' || navigator.appName === 'Netscape' && new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) !== null,

        init: function init(elements, options) {
            this.options = extend(options, this.defaults);
            this.setElementSelection(elements);
            if (this.elements.length === 0) {
                return;
            }
            this.parentElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'];
            if (!this.options.elementsContainer) {
                this.options.elementsContainer = document.body;
            }
            this.id = this.options.elementsContainer.querySelectorAll('.medium-editor-toolbar').length + 1;
            return this.setup();
        },

        setup: function setup() {
            this.events = [];
            this.isActive = true;
            this.initElements().bindSelect().bindPaste().setPlaceholders().bindWindowActions().passInstance();
        },

        on: function on(target, event, listener, useCapture) {
            target.addEventListener(event, listener, useCapture);
            this.events.push([target, event, listener, useCapture]);
        },

        off: function off(target, event, listener, useCapture) {
            var index = this.events.indexOf([target, event, listener, useCapture]),
                e;
            if (index !== -1) {
                e = this.events.splice(index, 1);
                e[0].removeEventListener(e[1], e[2], e[3]);
            }
        },

        removeAllEvents: function removeAllEvents() {
            var e = this.events.pop();
            while (e) {
                e[0].removeEventListener(e[1], e[2], e[3]);
                e = this.events.pop();
            }
        },

        initElements: function initElements() {
            this.updateElementList();
            var i,
                addToolbar = false;
            for (i = 0; i < this.elements.length; i += 1) {
                if (!this.options.disableEditing && !this.elements[i].getAttribute('data-disable-editing')) {
                    this.elements[i].setAttribute('contentEditable', true);
                }
                if (!this.elements[i].getAttribute('data-placeholder')) {
                    this.elements[i].setAttribute('data-placeholder', this.options.placeholder);
                }
                this.elements[i].setAttribute('data-medium-element', true);
                this.bindParagraphCreation(i).bindReturn(i).bindTab(i);
                if (!this.options.disableToolbar && !this.elements[i].getAttribute('data-disable-toolbar')) {
                    addToolbar = true;
                }
            }
            // Init toolbar
            if (addToolbar) {
                this.initToolbar().bindButtons().bindAnchorForm().bindAnchorPreview();
            }
            return this;
        },

        setElementSelection: function setElementSelection(selector) {
            this.elementSelection = selector;
            this.updateElementList();
        },

        updateElementList: function updateElementList() {
            this.elements = typeof this.elementSelection === 'string' ? this.options.ownerDocument.querySelectorAll(this.elementSelection) : this.elementSelection;
            if (this.elements.nodeType === 1) {
                this.elements = [this.elements];
            }
        },

        serialize: function serialize() {
            var i,
                elementid,
                content = {};
            for (i = 0; i < this.elements.length; i += 1) {
                elementid = this.elements[i].id !== '' ? this.elements[i].id : 'element-' + i;
                content[elementid] = {
                    value: this.elements[i].innerHTML.trim()
                };
            }
            return content;
        },

        /**
         * Helper function to call a method with a number of parameters on all registered extensions.
         * The function assures that the function exists before calling.
         *
         * @param {string} funcName name of the function to call
         * @param [args] arguments passed into funcName
         */
        callExtensions: function callExtensions(funcName) {
            if (arguments.length < 1) {
                return;
            }

            var args = Array.prototype.slice.call(arguments, 1),
                ext,
                name;

            for (name in this.options.extensions) {
                if (this.options.extensions.hasOwnProperty(name)) {
                    ext = this.options.extensions[name];
                    if (ext[funcName] !== undefined) {
                        ext[funcName].apply(ext, args);
                    }
                }
            }
        },

        /**
         * Pass current Medium Editor instance to all extensions
         * if extension constructor has 'parent' attribute set to 'true'
         *
         */
        passInstance: function passInstance() {
            var self = this,
                ext,
                name;

            for (name in self.options.extensions) {
                if (self.options.extensions.hasOwnProperty(name)) {
                    ext = self.options.extensions[name];

                    if (ext.parent) {
                        ext.base = self;
                    }
                }
            }

            return self;
        },

        bindParagraphCreation: function bindParagraphCreation(index) {
            var self = this;
            this.on(this.elements[index], 'keypress', function (e) {
                var node = getSelectionStart.call(self),
                    tagName;
                if (e.which === 32) {
                    tagName = node.tagName.toLowerCase();
                    if (tagName === 'a') {
                        document.execCommand('unlink', false, null);
                    }
                }
            });

            this.on(this.elements[index], 'keyup', function (e) {
                var node = getSelectionStart.call(self),
                    tagName,
                    editorElement;

                if (node && node.getAttribute('data-medium-element') && node.children.length === 0 && !(self.options.disableReturn || node.getAttribute('data-disable-return'))) {
                    document.execCommand('formatBlock', false, 'p');
                }
                if (e.which === 13) {
                    node = getSelectionStart.call(self);
                    tagName = node.tagName.toLowerCase();
                    editorElement = self.getSelectionElement();

                    if (!(self.options.disableReturn || editorElement.getAttribute('data-disable-return')) && tagName !== 'li' && !self.isListItemChild(node)) {
                        if (!e.shiftKey) {
                            document.execCommand('formatBlock', false, 'p');
                        }
                        if (tagName === 'a') {
                            document.execCommand('unlink', false, null);
                        }
                    }
                }
            });
            return this;
        },

        isListItemChild: function isListItemChild(node) {
            var parentNode = node.parentNode,
                tagName = parentNode.tagName.toLowerCase();
            while (this.parentElements.indexOf(tagName) === -1 && tagName !== 'div') {
                if (tagName === 'li') {
                    return true;
                }
                parentNode = parentNode.parentNode;
                if (parentNode && parentNode.tagName) {
                    tagName = parentNode.tagName.toLowerCase();
                } else {
                    return false;
                }
            }
            return false;
        },

        bindReturn: function bindReturn(index) {
            var self = this;
            this.on(this.elements[index], 'keypress', function (e) {
                if (e.which === 13) {
                    if (self.options.disableReturn || this.getAttribute('data-disable-return')) {
                        e.preventDefault();
                    } else if (self.options.disableDoubleReturn || this.getAttribute('data-disable-double-return')) {
                        var node = getSelectionStart.call(self);
                        if (node && node.innerText === '\n') {
                            e.preventDefault();
                        }
                    }
                }
            });
            return this;
        },

        bindTab: function bindTab(index) {
            var self = this;
            this.on(this.elements[index], 'keydown', function (e) {
                if (e.which === 9) {
                    // Override tab only for pre nodes
                    var tag = getSelectionStart.call(self).tagName.toLowerCase();
                    if (tag === 'pre') {
                        e.preventDefault();
                        document.execCommand('insertHtml', null, '    ');
                    }

                    // Tab to indent list structures!
                    if (tag === 'li') {
                        e.preventDefault();

                        // If Shift is down, outdent, otherwise indent
                        if (e.shiftKey) {
                            document.execCommand('outdent', e);
                        } else {
                            document.execCommand('indent', e);
                        }
                    }
                }
            });
            return this;
        },

        buttonTemplate: function buttonTemplate(btnType) {
            var buttonLabels = this.getButtonLabels(this.options.buttonLabels),
                buttonTemplates = {
                'bold': '<button class="medium-editor-action medium-editor-action-bold" data-action="bold" data-element="b">' + buttonLabels.bold + '</button>',
                'italic': '<button class="medium-editor-action medium-editor-action-italic" data-action="italic" data-element="i">' + buttonLabels.italic + '</button>',
                'underline': '<button class="medium-editor-action medium-editor-action-underline" data-action="underline" data-element="u">' + buttonLabels.underline + '</button>',
                'strikethrough': '<button class="medium-editor-action medium-editor-action-strikethrough" data-action="strikethrough" data-element="strike">' + buttonLabels.strikethrough + '</button>',
                'superscript': '<button class="medium-editor-action medium-editor-action-superscript" data-action="superscript" data-element="sup">' + buttonLabels.superscript + '</button>',
                'subscript': '<button class="medium-editor-action medium-editor-action-subscript" data-action="subscript" data-element="sub">' + buttonLabels.subscript + '</button>',
                'anchor': '<button class="medium-editor-action medium-editor-action-anchor" data-action="anchor" data-element="a">' + buttonLabels.anchor + '</button>',
                'image': '<button class="medium-editor-action medium-editor-action-image" data-action="image" data-element="img">' + buttonLabels.image + '</button>',
                'header1': '<button class="medium-editor-action medium-editor-action-header1" data-action="append-' + this.options.firstHeader + '" data-element="' + this.options.firstHeader + '">' + buttonLabels.header1 + '</button>',
                'header2': '<button class="medium-editor-action medium-editor-action-header2" data-action="append-' + this.options.secondHeader + '" data-element="' + this.options.secondHeader + '">' + buttonLabels.header2 + '</button>',
                'quote': '<button class="medium-editor-action medium-editor-action-quote" data-action="append-blockquote" data-element="blockquote">' + buttonLabels.quote + '</button>',
                'orderedlist': '<button class="medium-editor-action medium-editor-action-orderedlist" data-action="insertorderedlist" data-element="ol">' + buttonLabels.orderedlist + '</button>',
                'unorderedlist': '<button class="medium-editor-action medium-editor-action-unorderedlist" data-action="insertunorderedlist" data-element="ul">' + buttonLabels.unorderedlist + '</button>',
                'pre': '<button class="medium-editor-action medium-editor-action-pre" data-action="append-pre" data-element="pre">' + buttonLabels.pre + '</button>',
                'indent': '<button class="medium-editor-action medium-editor-action-indent" data-action="indent" data-element="ul">' + buttonLabels.indent + '</button>',
                'outdent': '<button class="medium-editor-action medium-editor-action-outdent" data-action="outdent" data-element="ul">' + buttonLabels.outdent + '</button>',
                'justifyCenter': '<button class="medium-editor-action medium-editor-action-justifyCenter" data-action="justifyCenter" data-element="">' + buttonLabels.justifyCenter + '</button>',
                'justifyFull': '<button class="medium-editor-action medium-editor-action-justifyFull" data-action="justifyFull" data-element="">' + buttonLabels.justifyFull + '</button>',
                'justifyLeft': '<button class="medium-editor-action medium-editor-action-justifyLeft" data-action="justifyLeft" data-element="">' + buttonLabels.justifyLeft + '</button>',
                'justifyRight': '<button class="medium-editor-action medium-editor-action-justifyRight" data-action="justifyRight" data-element="">' + buttonLabels.justifyRight + '</button>'
            };
            return buttonTemplates[btnType] || false;
        },

        // TODO: break method
        getButtonLabels: function getButtonLabels(buttonLabelType) {
            var customButtonLabels,
                attrname,
                buttonLabels = {
                'bold': '<b>B</b>',
                'italic': '<b><i>I</i></b>',
                'underline': '<b><u>U</u></b>',
                'strikethrough': '<s>A</s>',
                'superscript': '<b>x<sup>1</sup></b>',
                'subscript': '<b>x<sub>1</sub></b>',
                'anchor': '<b>#</b>',
                'image': '<b>image</b>',
                'header1': '<b>H1</b>',
                'header2': '<b>H2</b>',
                'quote': '<b>&ldquo;</b>',
                'orderedlist': '<b>1.</b>',
                'unorderedlist': '<b>&bull;</b>',
                'pre': '<b>0101</b>',
                'indent': '<b>&rarr;</b>',
                'outdent': '<b>&larr;</b>',
                'justifyCenter': '<b>C</b>',
                'justifyFull': '<b>J</b>',
                'justifyLeft': '<b>L</b>',
                'justifyRight': '<b>R</b>'
            };
            if (buttonLabelType === 'fontawesome') {
                customButtonLabels = {
                    'bold': '<i class="fa fa-bold"></i>',
                    'italic': '<i class="fa fa-italic"></i>',
                    'underline': '<i class="fa fa-underline"></i>',
                    'strikethrough': '<i class="fa fa-strikethrough"></i>',
                    'superscript': '<i class="fa fa-superscript"></i>',
                    'subscript': '<i class="fa fa-subscript"></i>',
                    'anchor': '<i class="fa fa-link"></i>',
                    'image': '<i class="fa fa-picture-o"></i>',
                    'quote': '<i class="fa fa-quote-right"></i>',
                    'orderedlist': '<i class="fa fa-list-ol"></i>',
                    'unorderedlist': '<i class="fa fa-list-ul"></i>',
                    'pre': '<i class="fa fa-code fa-lg"></i>',
                    'indent': '<i class="fa fa-indent"></i>',
                    'outdent': '<i class="fa fa-outdent"></i>',
                    'justifyCenter': '<i class="fa fa-align-center"></i>',
                    'justifyFull': '<i class="fa fa-align-justify"></i>',
                    'justifyLeft': '<i class="fa fa-align-left"></i>',
                    'justifyRight': '<i class="fa fa-align-right"></i>'
                };
            } else if (typeof buttonLabelType === 'object') {
                customButtonLabels = buttonLabelType;
            }
            if (typeof customButtonLabels === 'object') {
                for (attrname in customButtonLabels) {
                    if (customButtonLabels.hasOwnProperty(attrname)) {
                        buttonLabels[attrname] = customButtonLabels[attrname];
                    }
                }
            }
            return buttonLabels;
        },

        initToolbar: function initToolbar() {
            if (this.toolbar) {
                return this;
            }
            this.toolbar = this.createToolbar();
            this.keepToolbarAlive = false;
            this.anchorForm = this.toolbar.querySelector('.medium-editor-toolbar-form-anchor');
            this.anchorInput = this.anchorForm.querySelector('input.medium-editor-toolbar-anchor-input');
            this.anchorTarget = this.anchorForm.querySelector('input.medium-editor-toolbar-anchor-target');
            this.anchorButton = this.anchorForm.querySelector('input.medium-editor-toolbar-anchor-button');
            this.toolbarActions = this.toolbar.querySelector('.medium-editor-toolbar-actions');
            this.anchorPreview = this.createAnchorPreview();

            return this;
        },

        createToolbar: function createToolbar() {
            var toolbar = document.createElement('div');
            toolbar.id = 'medium-editor-toolbar-' + this.id;
            toolbar.className = 'medium-editor-toolbar';
            toolbar.appendChild(this.toolbarButtons());
            toolbar.appendChild(this.toolbarFormAnchor());
            this.options.elementsContainer.appendChild(toolbar);
            return toolbar;
        },

        //TODO: actionTemplate
        toolbarButtons: function toolbarButtons() {
            var btns = this.options.buttons,
                ul = document.createElement('ul'),
                li,
                i,
                btn,
                ext;

            ul.id = 'medium-editor-toolbar-actions';
            ul.className = 'medium-editor-toolbar-actions clearfix';

            for (i = 0; i < btns.length; i += 1) {
                if (this.options.extensions.hasOwnProperty(btns[i])) {
                    ext = this.options.extensions[btns[i]];
                    btn = ext.getButton !== undefined ? ext.getButton() : null;
                } else {
                    btn = this.buttonTemplate(btns[i]);
                }

                if (btn) {
                    li = document.createElement('li');
                    if (isElement(btn)) {
                        li.appendChild(btn);
                    } else {
                        li.innerHTML = btn;
                    }
                    ul.appendChild(li);
                }
            }

            return ul;
        },

        toolbarFormAnchor: function toolbarFormAnchor() {
            var anchor = document.createElement('div'),
                input = document.createElement('input'),
                target_label = document.createElement('label'),
                target = document.createElement('input'),
                button_label = document.createElement('label'),
                button = document.createElement('input'),
                close = document.createElement('a'),
                save = document.createElement('a');

            close.setAttribute('href', '#');
            close.className = 'medium-editor-toobar-anchor-close';
            close.innerHTML = '&times;';

            save.setAttribute('href', '#');
            save.className = 'medium-editor-toobar-anchor-save';
            save.innerHTML = '&#10003;';

            input.setAttribute('type', 'text');
            input.className = 'medium-editor-toolbar-anchor-input';
            input.setAttribute('placeholder', this.options.anchorInputPlaceholder);

            target.setAttribute('type', 'checkbox');
            target.className = 'medium-editor-toolbar-anchor-target';
            target_label.innerHTML = "Open in New Window?";
            target_label.insertBefore(target, target_label.firstChild);

            button.setAttribute('type', 'checkbox');
            button.className = 'medium-editor-toolbar-anchor-button';
            button_label.innerHTML = "Button";
            button_label.insertBefore(button, button_label.firstChild);

            anchor.className = 'medium-editor-toolbar-form-anchor';
            anchor.id = 'medium-editor-toolbar-form-anchor';
            anchor.appendChild(input);

            anchor.appendChild(save);
            anchor.appendChild(close);

            if (this.options.anchorTarget) {
                anchor.appendChild(target_label);
            }

            if (this.options.anchorButton) {
                anchor.appendChild(button_label);
            }

            return anchor;
        },

        bindSelect: function bindSelect() {
            var self = this,
                timer = '',
                i;

            this.checkSelectionWrapper = function (e) {

                // Do not close the toolbar when bluring the editable area and clicking into the anchor form
                if (e && self.clickingIntoArchorForm(e)) {
                    return false;
                }

                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.checkSelection();
                }, self.options.delay);
            };

            this.on(document.documentElement, 'mouseup', this.checkSelectionWrapper);

            for (i = 0; i < this.elements.length; i += 1) {
                this.on(this.elements[i], 'keyup', this.checkSelectionWrapper);
                this.on(this.elements[i], 'blur', this.checkSelectionWrapper);
            }
            return this;
        },

        checkSelection: function checkSelection() {
            var newSelection, selectionElement;

            if (this.keepToolbarAlive !== true && !this.options.disableToolbar) {

                newSelection = this.options.contentWindow.getSelection();
                if (newSelection.toString().trim() === '' || this.options.allowMultiParagraphSelection === false && this.hasMultiParagraphs() || this.selectionInContentEditableFalse()) {
                    this.hideToolbarActions();
                } else {
                    selectionElement = this.getSelectionElement();
                    if (!selectionElement || selectionElement.getAttribute('data-disable-toolbar')) {
                        this.hideToolbarActions();
                    } else {
                        this.checkSelectionElement(newSelection, selectionElement);
                    }
                }
            }
            return this;
        },

        clickingIntoArchorForm: function clickingIntoArchorForm(e) {
            var self = this;

            if (e.type && e.type.toLowerCase() === 'blur' && e.relatedTarget && e.relatedTarget === self.anchorInput) {
                return true;
            }

            return false;
        },

        hasMultiParagraphs: function hasMultiParagraphs() {
            var selectionHtml = getSelectionHtml.call(this).replace(/<[\S]+><\/[\S]+>/gim, ''),
                hasMultiParagraphs = selectionHtml.match(/<(p|h[0-6]|blockquote)>([\s\S]*?)<\/(p|h[0-6]|blockquote)>/g);

            return hasMultiParagraphs ? hasMultiParagraphs.length : 0;
        },

        checkSelectionElement: function checkSelectionElement(newSelection, selectionElement) {
            var i;
            this.selection = newSelection;
            this.selectionRange = this.selection.getRangeAt(0);
            for (i = 0; i < this.elements.length; i += 1) {
                if (this.elements[i] === selectionElement) {
                    this.setToolbarButtonStates().setToolbarPosition().showToolbarActions();
                    return;
                }
            }
            this.hideToolbarActions();
        },

        findMatchingSelectionParent: function findMatchingSelectionParent(testElementFunction) {
            var selection = this.options.contentWindow.getSelection(),
                range,
                current;

            if (selection.rangeCount === 0) {
                return false;
            }

            range = selection.getRangeAt(0);
            current = range.commonAncestorContainer;

            do {
                if (current.nodeType === 1) {
                    if (testElementFunction(current)) {
                        return current;
                    }
                    // do not traverse upwards past the nearest containing editor
                    if (current.getAttribute('data-medium-element')) {
                        return false;
                    }
                }

                current = current.parentNode;
            } while (current);

            return false;
        },

        getSelectionElement: function getSelectionElement() {
            return this.findMatchingSelectionParent(function (el) {
                return el.getAttribute('data-medium-element');
            });
        },

        selectionInContentEditableFalse: function selectionInContentEditableFalse() {
            return this.findMatchingSelectionParent(function (el) {
                return el && el.nodeName !== '#text' && el.getAttribute('contenteditable') === 'false';
            });
        },

        setToolbarPosition: function setToolbarPosition() {
            var buttonHeight = 50,
                selection = this.options.contentWindow.getSelection(),
                range = selection.getRangeAt(0),
                boundary = range.getBoundingClientRect(),
                defaultLeft = this.options.diffLeft - this.toolbar.offsetWidth / 2,
                middleBoundary = (boundary.left + boundary.right) / 2,
                halfOffsetWidth = this.toolbar.offsetWidth / 2;
            if (boundary.top < buttonHeight) {
                this.toolbar.classList.add('medium-toolbar-arrow-over');
                this.toolbar.classList.remove('medium-toolbar-arrow-under');
                this.toolbar.style.top = buttonHeight + boundary.bottom - this.options.diffTop + this.options.contentWindow.pageYOffset - this.toolbar.offsetHeight + 'px';
            } else {
                this.toolbar.classList.add('medium-toolbar-arrow-under');
                this.toolbar.classList.remove('medium-toolbar-arrow-over');
                this.toolbar.style.top = boundary.top + this.options.diffTop + this.options.contentWindow.pageYOffset - this.toolbar.offsetHeight + 'px';
            }
            if (middleBoundary < halfOffsetWidth) {
                this.toolbar.style.left = defaultLeft + halfOffsetWidth + 'px';
            } else if (this.options.contentWindow.innerWidth - middleBoundary < halfOffsetWidth) {
                this.toolbar.style.left = this.options.contentWindow.innerWidth + defaultLeft - halfOffsetWidth + 'px';
            } else {
                this.toolbar.style.left = defaultLeft + middleBoundary + 'px';
            }

            this.hideAnchorPreview();

            return this;
        },

        setToolbarButtonStates: function setToolbarButtonStates() {
            var buttons = this.toolbarActions.querySelectorAll('button'),
                i;
            for (i = 0; i < buttons.length; i += 1) {
                buttons[i].classList.remove(this.options.activeButtonClass);
            }
            this.checkActiveButtons();
            return this;
        },

        checkActiveButtons: function checkActiveButtons() {
            var elements = Array.prototype.slice.call(this.elements),
                parentNode = this.getSelectedParentElement();
            while (parentNode.tagName !== undefined && this.parentElements.indexOf(parentNode.tagName.toLowerCase) === -1) {
                this.activateButton(parentNode.tagName.toLowerCase());
                this.callExtensions('checkState', parentNode);

                // we can abort the search upwards if we leave the contentEditable element
                if (elements.indexOf(parentNode) !== -1) {
                    break;
                }
                parentNode = parentNode.parentNode;
            }
        },

        activateButton: function activateButton(tag) {
            var el = this.toolbar.querySelector('[data-element="' + tag + '"]');
            if (el !== null && el.className.indexOf(this.options.activeButtonClass) === -1) {
                el.className += ' ' + this.options.activeButtonClass;
            }
        },

        bindButtons: function bindButtons() {
            var buttons = this.toolbar.querySelectorAll('button'),
                i,
                self = this,
                triggerAction = function triggerAction(e) {
                e.preventDefault();
                e.stopPropagation();
                if (self.selection === undefined) {
                    self.checkSelection();
                }
                if (this.className.indexOf(self.options.activeButtonClass) > -1) {
                    this.classList.remove(self.options.activeButtonClass);
                } else {
                    this.className += ' ' + self.options.activeButtonClass;
                }
                if (this.hasAttribute('data-action')) {
                    self.execAction(this.getAttribute('data-action'), e);
                }
            };
            for (i = 0; i < buttons.length; i += 1) {
                this.on(buttons[i], 'click', triggerAction);
            }
            this.setFirstAndLastItems(buttons);
            return this;
        },

        setFirstAndLastItems: function setFirstAndLastItems(buttons) {
            if (buttons.length > 0) {
                buttons[0].className += ' ' + this.options.firstButtonClass;
                buttons[buttons.length - 1].className += ' ' + this.options.lastButtonClass;
            }
            return this;
        },

        execAction: function execAction(action, e) {
            if (action.indexOf('append-') > -1) {
                this.execFormatBlock(action.replace('append-', ''));
                this.setToolbarPosition();
                this.setToolbarButtonStates();
            } else if (action === 'anchor') {
                this.triggerAnchorAction(e);
            } else if (action === 'image') {
                this.options.ownerDocument.execCommand('insertImage', false, this.options.contentWindow.getSelection());
            } else {
                this.options.ownerDocument.execCommand(action, false, null);
                this.setToolbarPosition();
            }
        },

        // http://stackoverflow.com/questions/15867542/range-object-get-selection-parent-node-chrome-vs-firefox
        rangeSelectsSingleNode: function rangeSelectsSingleNode(range) {
            var startNode = range.startContainer;
            return startNode === range.endContainer && startNode.hasChildNodes() && range.endOffset === range.startOffset + 1;
        },

        getSelectedParentElement: function getSelectedParentElement() {
            var selectedParentElement = null,
                range = this.selectionRange;
            if (this.rangeSelectsSingleNode(range)) {
                selectedParentElement = range.startContainer.childNodes[range.startOffset];
            } else if (range.startContainer.nodeType === 3) {
                selectedParentElement = range.startContainer.parentNode;
            } else {
                selectedParentElement = range.startContainer;
            }
            return selectedParentElement;
        },

        triggerAnchorAction: function triggerAnchorAction() {
            var selectedParentElement = this.getSelectedParentElement();
            if (selectedParentElement.tagName && selectedParentElement.tagName.toLowerCase() === 'a') {
                this.options.ownerDocument.execCommand('unlink', false, null);
            } else {
                if (this.anchorForm.style.display === 'block') {
                    this.showToolbarActions();
                } else {
                    this.showAnchorForm();
                }
            }
            return this;
        },

        execFormatBlock: function execFormatBlock(el) {
            var selectionData = this.getSelectionData(this.selection.anchorNode);
            // FF handles blockquote differently on formatBlock
            // allowing nesting, we need to use outdent
            // https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
            if (el === 'blockquote' && selectionData.el && selectionData.el.parentNode.tagName.toLowerCase() === 'blockquote') {
                return this.options.ownerDocument.execCommand('outdent', false, null);
            }
            if (selectionData.tagName === el) {
                el = 'p';
            }
            // When IE we need to add <> to heading elements and
            //  blockquote needs to be called as indent
            // http://stackoverflow.com/questions/10741831/execcommand-formatblock-headings-in-ie
            // http://stackoverflow.com/questions/1816223/rich-text-editor-with-blockquote-function/1821777#1821777
            if (this.isIE) {
                if (el === 'blockquote') {
                    return this.options.ownerDocument.execCommand('indent', false, el);
                }
                el = '<' + el + '>';
            }
            return this.options.ownerDocument.execCommand('formatBlock', false, el);
        },

        getSelectionData: function getSelectionData(el) {
            var tagName;

            if (el && el.tagName) {
                tagName = el.tagName.toLowerCase();
            }

            while (el && this.parentElements.indexOf(tagName) === -1) {
                el = el.parentNode;
                if (el && el.tagName) {
                    tagName = el.tagName.toLowerCase();
                }
            }

            return {
                el: el,
                tagName: tagName
            };
        },

        getFirstChild: function getFirstChild(el) {
            var firstChild = el.firstChild;
            while (firstChild !== null && firstChild.nodeType !== 1) {
                firstChild = firstChild.nextSibling;
            }
            return firstChild;
        },

        hideToolbarActions: function hideToolbarActions() {
            this.keepToolbarAlive = false;
            if (this.toolbar !== undefined) {
                this.toolbar.classList.remove('medium-editor-toolbar-active');
            }
        },

        showToolbarActions: function showToolbarActions() {
            var self = this,
                timer;
            this.anchorForm.style.display = 'none';
            this.toolbarActions.style.display = 'block';
            this.keepToolbarAlive = false;
            clearTimeout(timer);
            timer = setTimeout(function () {
                if (self.toolbar && !self.toolbar.classList.contains('medium-editor-toolbar-active')) {
                    self.toolbar.classList.add('medium-editor-toolbar-active');
                }
            }, 100);
        },

        saveSelection: function saveSelection() {
            this.savedSelection = _saveSelection.call(this);
        },

        restoreSelection: function restoreSelection() {
            _restoreSelection.call(this, this.savedSelection);
        },

        showAnchorForm: function showAnchorForm(link_value) {
            this.toolbarActions.style.display = 'none';
            this.saveSelection();
            this.anchorForm.style.display = 'block';
            this.setToolbarPosition();
            this.keepToolbarAlive = true;
            this.anchorInput.focus();
            this.anchorInput.value = link_value || '';
        },

        bindAnchorForm: function bindAnchorForm() {
            var linkCancel = this.anchorForm.querySelector('a.medium-editor-toobar-anchor-close'),
                linkSave = this.anchorForm.querySelector('a.medium-editor-toobar-anchor-save'),
                self = this;

            this.on(this.anchorForm, 'click', function (e) {
                e.stopPropagation();
                self.keepToolbarAlive = true;
            });

            this.on(this.anchorInput, 'keyup', function (e) {
                var button = null,
                    target;

                if (e.keyCode === 13) {
                    e.preventDefault();
                    if (self.options.anchorTarget && self.anchorTarget.checked) {
                        target = "_blank";
                    } else {
                        target = "_self";
                    }

                    if (self.options.anchorButton && self.anchorButton.checked) {
                        button = self.options.anchorButtonClass;
                    }

                    self.createLink(this, target, button);
                }
            });

            this.on(linkSave, 'click', function (e) {
                var button = null,
                    target;
                e.preventDefault();
                if (self.options.anchorTarget && self.anchorTarget.checked) {
                    target = "_blank";
                } else {
                    target = "_self";
                }

                if (self.options.anchorButton && self.anchorButton.checked) {
                    button = self.options.anchorButtonClass;
                }

                self.createLink(self.anchorInput, target, button);
            }, true);

            this.on(this.anchorInput, 'click', function (e) {
                // make sure not to hide form when cliking into the input
                e.stopPropagation();
                self.keepToolbarAlive = true;
            });

            // Hide the anchor form when focusing outside of it.
            this.on(this.options.ownerDocument.body, 'click', function (e) {
                if (e.target !== self.anchorForm && !isDescendant(self.anchorForm, e.target) && !isDescendant(self.toolbarActions, e.target)) {
                    self.keepToolbarAlive = false;
                    self.checkSelection();
                }
            }, true);
            this.on(this.options.ownerDocument.body, 'focus', function (e) {
                if (e.target !== self.anchorForm && !isDescendant(self.anchorForm, e.target) && !isDescendant(self.toolbarActions, e.target)) {
                    self.keepToolbarAlive = false;
                    self.checkSelection();
                }
            }, true);

            this.on(linkCancel, 'click', function (e) {
                e.preventDefault();
                self.showToolbarActions();
                _restoreSelection.call(self, self.savedSelection);
            });
            return this;
        },

        hideAnchorPreview: function hideAnchorPreview() {
            this.anchorPreview.classList.remove('medium-editor-anchor-preview-active');
        },

        // TODO: break method
        showAnchorPreview: function showAnchorPreview(anchorEl) {
            if (this.anchorPreview.classList.contains('medium-editor-anchor-preview-active') || anchorEl.getAttribute('data-disable-preview')) {
                return true;
            }

            var self = this,
                buttonHeight = 40,
                boundary = anchorEl.getBoundingClientRect(),
                middleBoundary = (boundary.left + boundary.right) / 2,
                halfOffsetWidth,
                defaultLeft,
                timer;

            self.anchorPreview.querySelector('i').textContent = anchorEl.href;
            halfOffsetWidth = self.anchorPreview.offsetWidth / 2;
            defaultLeft = self.options.diffLeft - halfOffsetWidth;

            clearTimeout(timer);
            timer = setTimeout(function () {
                if (self.anchorPreview && !self.anchorPreview.classList.contains('medium-editor-anchor-preview-active')) {
                    self.anchorPreview.classList.add('medium-editor-anchor-preview-active');
                }
            }, 100);

            self.observeAnchorPreview(anchorEl);

            self.anchorPreview.classList.add('medium-toolbar-arrow-over');
            self.anchorPreview.classList.remove('medium-toolbar-arrow-under');
            self.anchorPreview.style.top = Math.round(buttonHeight + boundary.bottom - self.options.diffTop + this.options.contentWindow.pageYOffset - self.anchorPreview.offsetHeight) + 'px';
            if (middleBoundary < halfOffsetWidth) {
                self.anchorPreview.style.left = defaultLeft + halfOffsetWidth + 'px';
            } else if (this.options.contentWindow.innerWidth - middleBoundary < halfOffsetWidth) {
                self.anchorPreview.style.left = this.options.contentWindow.innerWidth + defaultLeft - halfOffsetWidth + 'px';
            } else {
                self.anchorPreview.style.left = defaultLeft + middleBoundary + 'px';
            }

            return this;
        },

        // TODO: break method
        observeAnchorPreview: function observeAnchorPreview(anchorEl) {
            var self = this,
                lastOver = new Date().getTime(),
                over = true,
                stamp = function stamp() {
                lastOver = new Date().getTime();
                over = true;
            },
                unstamp = function unstamp(e) {
                if (!e.relatedTarget || !/anchor-preview/.test(e.relatedTarget.className)) {
                    over = false;
                }
            },
                interval_timer = setInterval(function () {
                if (over) {
                    return true;
                }
                var durr = new Date().getTime() - lastOver;
                if (durr > self.options.anchorPreviewHideDelay) {
                    // hide the preview 1/2 second after mouse leaves the link
                    self.hideAnchorPreview();

                    // cleanup
                    clearInterval(interval_timer);
                    self.off(self.anchorPreview, 'mouseover', stamp);
                    self.off(self.anchorPreview, 'mouseout', unstamp);
                    self.off(anchorEl, 'mouseover', stamp);
                    self.off(anchorEl, 'mouseout', unstamp);
                }
            }, 200);

            this.on(self.anchorPreview, 'mouseover', stamp);
            this.on(self.anchorPreview, 'mouseout', unstamp);
            this.on(anchorEl, 'mouseover', stamp);
            this.on(anchorEl, 'mouseout', unstamp);
        },

        createAnchorPreview: function createAnchorPreview() {
            var self = this,
                anchorPreview = this.options.ownerDocument.createElement('div');

            anchorPreview.id = 'medium-editor-anchor-preview-' + this.id;
            anchorPreview.className = 'medium-editor-anchor-preview';
            anchorPreview.innerHTML = this.anchorPreviewTemplate();
            this.options.elementsContainer.appendChild(anchorPreview);

            this.on(anchorPreview, 'click', function () {
                self.anchorPreviewClickHandler();
            });

            return anchorPreview;
        },

        anchorPreviewTemplate: function anchorPreviewTemplate() {
            return '<div class="medium-editor-toolbar-anchor-preview" id="medium-editor-toolbar-anchor-preview">' + '    <i class="medium-editor-toolbar-anchor-preview-inner"></i>' + '</div>';
        },

        anchorPreviewClickHandler: function anchorPreviewClickHandler(e) {
            if (this.activeAnchor) {

                var self = this,
                    range = this.options.ownerDocument.createRange(),
                    sel = this.options.contentWindow.getSelection();

                range.selectNodeContents(self.activeAnchor);
                sel.removeAllRanges();
                sel.addRange(range);
                setTimeout(function () {
                    if (self.activeAnchor) {
                        self.showAnchorForm(self.activeAnchor.href);
                    }
                    self.keepToolbarAlive = false;
                }, 100 + self.options.delay);
            }

            this.hideAnchorPreview();
        },

        editorAnchorObserver: function editorAnchorObserver(e) {
            var self = this,
                overAnchor = true,
                leaveAnchor = function leaveAnchor() {
                // mark the anchor as no longer hovered, and stop listening
                overAnchor = false;
                self.off(self.activeAnchor, 'mouseout', leaveAnchor);
            };

            if (e.target && e.target.tagName.toLowerCase() === 'a') {

                // Detect empty href attributes
                // The browser will make href="" or href="#top"
                // into absolute urls when accessed as e.targed.href, so check the html
                if (!/href=["']\S+["']/.test(e.target.outerHTML) || /href=["']#\S+["']/.test(e.target.outerHTML)) {
                    return true;
                }

                // only show when hovering on anchors
                if (this.toolbar.classList.contains('medium-editor-toolbar-active')) {
                    // only show when toolbar is not present
                    return true;
                }
                this.activeAnchor = e.target;
                this.on(this.activeAnchor, 'mouseout', leaveAnchor);
                // show the anchor preview according to the configured delay
                // if the mouse has not left the anchor tag in that time
                setTimeout(function () {
                    if (overAnchor) {
                        self.showAnchorPreview(e.target);
                    }
                }, self.options.delay);
            }
        },

        bindAnchorPreview: function bindAnchorPreview(index) {
            var i,
                self = this;
            this.editorAnchorObserverWrapper = function (e) {
                self.editorAnchorObserver(e);
            };
            for (i = 0; i < this.elements.length; i += 1) {
                this.on(this.elements[i], 'mouseover', this.editorAnchorObserverWrapper);
            }
            return this;
        },

        checkLinkFormat: function checkLinkFormat(value) {
            var re = /^(https?|ftps?|rtmpt?):\/\/|mailto:/;
            return (re.test(value) ? '' : 'http://') + value;
        },

        setTargetBlank: function setTargetBlank(el) {
            var i;
            el = el || getSelectionStart.call(this);
            if (el.tagName.toLowerCase() === 'a') {
                el.target = '_blank';
            } else {
                el = el.getElementsByTagName('a');

                for (i = 0; i < el.length; i += 1) {
                    el[i].target = '_blank';
                }
            }
        },

        setButtonClass: function setButtonClass(buttonClass) {
            var el = getSelectionStart.call(this),
                classes = buttonClass.split(' '),
                i,
                j;
            if (el.tagName.toLowerCase() === 'a') {
                for (j = 0; j < classes.length; j += 1) {
                    el.classList.add(classes[j]);
                }
            } else {
                el = el.getElementsByTagName('a');
                for (i = 0; i < el.length; i += 1) {
                    for (j = 0; j < classes.length; j += 1) {
                        el[i].classList.add(classes[j]);
                    }
                }
            }
        },

        createLink: function createLink(input, target, buttonClass) {
            var i, event;

            if (input.value.trim().length === 0) {
                this.hideToolbarActions();
                return;
            }

            _restoreSelection.call(this, this.savedSelection);

            if (this.options.checkLinkFormat) {
                input.value = this.checkLinkFormat(input.value);
            }

            this.options.ownerDocument.execCommand('createLink', false, input.value);

            if (this.options.targetBlank || target === "_blank") {
                this.setTargetBlank();
            }

            if (buttonClass) {
                this.setButtonClass(buttonClass);
            }

            if (this.options.targetBlank || target === "_blank" || buttonClass) {
                event = this.options.ownerDocument.createEvent("HTMLEvents");
                event.initEvent("input", true, true, this.options.contentWindow);
                for (i = 0; i < this.elements.length; i += 1) {
                    this.elements[i].dispatchEvent(event);
                }
            }

            this.checkSelection();
            this.showToolbarActions();
            input.value = '';
        },

        bindWindowActions: function bindWindowActions() {
            var timerResize,
                self = this;
            this.windowResizeHandler = function () {
                clearTimeout(timerResize);
                timerResize = setTimeout(function () {
                    if (self.toolbar && self.toolbar.classList.contains('medium-editor-toolbar-active')) {
                        self.setToolbarPosition();
                    }
                }, 100);
            };
            this.on(this.options.contentWindow, 'resize', this.windowResizeHandler);
            return this;
        },

        activate: function activate() {
            if (this.isActive) {
                return;
            }

            this.setup();
        },

        // TODO: break method
        deactivate: function deactivate() {
            var i;
            if (!this.isActive) {
                return;
            }
            this.isActive = false;

            if (this.toolbar !== undefined) {
                this.options.elementsContainer.removeChild(this.anchorPreview);
                this.options.elementsContainer.removeChild(this.toolbar);
                delete this.toolbar;
                delete this.anchorPreview;
            }

            for (i = 0; i < this.elements.length; i += 1) {
                this.elements[i].removeAttribute('contentEditable');
                this.elements[i].removeAttribute('data-medium-element');
            }

            this.removeAllEvents();
        },

        htmlEntities: function htmlEntities(str) {
            // converts special characters (like <) into their escaped/encoded values (like &lt;).
            // This allows you to show to display the string without the browser reading it as HTML.
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },

        bindPaste: function bindPaste() {
            var i,
                self = this;
            this.pasteWrapper = function (e) {
                var paragraphs,
                    html = '',
                    p;

                this.classList.remove('medium-editor-placeholder');
                if (!self.options.forcePlainText && !self.options.cleanPastedHTML) {
                    return this;
                }

                if (e.clipboardData && e.clipboardData.getData && !e.defaultPrevented) {
                    e.preventDefault();

                    if (self.options.cleanPastedHTML && e.clipboardData.getData('text/html')) {
                        return self.cleanPaste(e.clipboardData.getData('text/html'));
                    }
                    if (!(self.options.disableReturn || this.getAttribute('data-disable-return'))) {
                        paragraphs = e.clipboardData.getData('text/plain').split(/[\r\n]/g);
                        for (p = 0; p < paragraphs.length; p += 1) {
                            if (paragraphs[p] !== '') {
                                if (navigator.userAgent.match(/firefox/i) && p === 0) {
                                    html += self.htmlEntities(paragraphs[p]);
                                } else {
                                    html += '<p>' + self.htmlEntities(paragraphs[p]) + '</p>';
                                }
                            }
                        }
                        self.options.ownerDocument.execCommand('insertHTML', false, html);
                    } else {
                        html = self.htmlEntities(e.clipboardData.getData('text/plain'));
                        self.options.ownerDocument.execCommand('insertHTML', false, html);
                    }
                }
            };
            for (i = 0; i < this.elements.length; i += 1) {
                this.on(this.elements[i], 'paste', this.pasteWrapper);
            }
            return this;
        },

        setPlaceholders: function setPlaceholders() {
            var i,
                activatePlaceholder = function activatePlaceholder(el) {
                if (!el.querySelector('img') && !el.querySelector('blockquote') && el.textContent.replace(/^\s+|\s+$/g, '') === '') {
                    el.classList.add('medium-editor-placeholder');
                }
            },
                placeholderWrapper = function placeholderWrapper(e) {
                this.classList.remove('medium-editor-placeholder');
                if (e.type !== 'keypress') {
                    activatePlaceholder(this);
                }
            };
            for (i = 0; i < this.elements.length; i += 1) {
                activatePlaceholder(this.elements[i]);
                this.on(this.elements[i], 'blur', placeholderWrapper);
                this.on(this.elements[i], 'keypress', placeholderWrapper);
            }
            return this;
        },

        cleanPaste: function cleanPaste(text) {

            /*jslint regexp: true*/
            /*
                jslint does not allow character negation, because the negation
                will not match any unicode characters. In the regexes in this
                block, negation is used specifically to match the end of an html
                tag, and in fact unicode characters *should* be allowed.
            */
            var i,
                elList,
                workEl,
                el = this.getSelectionElement(),
                multiline = /<p|<br|<div/.test(text),
                replacements = [

            // replace two bogus tags that begin pastes from google docs
            [new RegExp(/<[^>]*docs-internal-guid[^>]*>/gi), ""], [new RegExp(/<\/b>(<br[^>]*>)?$/gi), ""],

            // un-html spaces and newlines inserted by OS X
            [new RegExp(/<span class="Apple-converted-space">\s+<\/span>/g), ' '], [new RegExp(/<br class="Apple-interchange-newline">/g), '<br>'],

            // replace google docs italics+bold with a span to be replaced once the html is inserted
            [new RegExp(/<span[^>]*(font-style:italic;font-weight:bold|font-weight:bold;font-style:italic)[^>]*>/gi), '<span class="replace-with italic bold">'],

            // replace google docs italics with a span to be replaced once the html is inserted
            [new RegExp(/<span[^>]*font-style:italic[^>]*>/gi), '<span class="replace-with italic">'],

            //[replace google docs bolds with a span to be replaced once the html is inserted
            [new RegExp(/<span[^>]*font-weight:bold[^>]*>/gi), '<span class="replace-with bold">'],

            // replace manually entered b/i/a tags with real ones
            [new RegExp(/&lt;(\/?)(i|b|a)&gt;/gi), '<$1$2>'],

            // replace manually a tags with real ones, converting smart-quotes from google docs
            [new RegExp(/&lt;a\s+href=(&quot;|&rdquo;|&ldquo;|“|”)([^&]+)(&quot;|&rdquo;|&ldquo;|“|”)&gt;/gi), '<a href="$2">']];
            /*jslint regexp: false*/

            for (i = 0; i < replacements.length; i += 1) {
                text = text.replace(replacements[i][0], replacements[i][1]);
            }

            if (multiline) {

                // double br's aren't converted to p tags, but we want paragraphs.
                elList = text.split('<br><br>');

                this.pasteHTML('<p>' + elList.join('</p><p>') + '</p>');
                this.options.ownerDocument.execCommand('insertText', false, "\n");

                // block element cleanup
                elList = el.querySelectorAll('a,p,div,br');
                for (i = 0; i < elList.length; i += 1) {

                    workEl = elList[i];

                    switch (workEl.tagName.toLowerCase()) {
                        case 'a':
                            if (this.options.targetBlank) {
                                this.setTargetBlank(workEl);
                            }
                            break;
                        case 'p':
                        case 'div':
                            this.filterCommonBlocks(workEl);
                            break;
                        case 'br':
                            this.filterLineBreak(workEl);
                            break;
                    }
                }
            } else {

                this.pasteHTML(text);
            }
        },

        pasteHTML: function pasteHTML(html) {
            var elList,
                workEl,
                i,
                fragmentBody,
                pasteBlock = this.options.ownerDocument.createDocumentFragment();

            pasteBlock.appendChild(this.options.ownerDocument.createElement('body'));

            fragmentBody = pasteBlock.querySelector('body');
            fragmentBody.innerHTML = html;

            this.cleanupSpans(fragmentBody);

            elList = fragmentBody.querySelectorAll('*');
            for (i = 0; i < elList.length; i += 1) {

                workEl = elList[i];

                // delete ugly attributes
                workEl.removeAttribute('class');
                workEl.removeAttribute('style');
                workEl.removeAttribute('dir');

                if (workEl.tagName.toLowerCase() === 'meta') {
                    workEl.parentNode.removeChild(workEl);
                }
            }
            this.options.ownerDocument.execCommand('insertHTML', false, fragmentBody.innerHTML.replace(/&nbsp;/g, ' '));
        },
        isCommonBlock: function isCommonBlock(el) {
            return el && (el.tagName.toLowerCase() === 'p' || el.tagName.toLowerCase() === 'div');
        },
        filterCommonBlocks: function filterCommonBlocks(el) {
            if (/^\s*$/.test(el.innerText)) {
                el.parentNode.removeChild(el);
            }
        },
        filterLineBreak: function filterLineBreak(el) {
            if (this.isCommonBlock(el.previousElementSibling)) {

                // remove stray br's following common block elements
                el.parentNode.removeChild(el);
            } else if (this.isCommonBlock(el.parentNode) && (el.parentNode.firstChild === el || el.parentNode.lastChild === el)) {

                // remove br's just inside open or close tags of a div/p
                el.parentNode.removeChild(el);
            } else if (el.parentNode.childElementCount === 1) {

                // and br's that are the only child of a div/p
                this.removeWithParent(el);
            }
        },

        // remove an element, including its parent, if it is the only element within its parent
        removeWithParent: function removeWithParent(el) {
            if (el && el.parentNode) {
                if (el.parentNode.parentNode && el.parentNode.childElementCount === 1) {
                    el.parentNode.parentNode.removeChild(el.parentNode);
                } else {
                    el.parentNode.removeChild(el.parentNode);
                }
            }
        },

        cleanupSpans: function cleanupSpans(container_el) {

            var i,
                el,
                new_el,
                spans = container_el.querySelectorAll('.replace-with');

            for (i = 0; i < spans.length; i += 1) {

                el = spans[i];
                new_el = this.options.ownerDocument.createElement(el.classList.contains('bold') ? 'b' : 'i');

                if (el.classList.contains('bold') && el.classList.contains('italic')) {

                    // add an i tag as well if this has both italics and bold
                    new_el.innerHTML = '<i>' + el.innerHTML + '</i>';
                } else {

                    new_el.innerHTML = el.innerHTML;
                }
                el.parentNode.replaceChild(new_el, el);
            }

            spans = container_el.querySelectorAll('span');
            for (i = 0; i < spans.length; i += 1) {

                el = spans[i];

                // remove empty spans, replace others with their contents
                if (/^\s*$/.test()) {
                    el.parentNode.removeChild(el);
                } else {
                    el.parentNode.replaceChild(this.options.ownerDocument.createTextNode(el.innerText), el);
                }
            }
        }

    };
})(window, document);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FkZG9ucy9tZWRpdW0vdmVuZG9yL21lZGl1bS1lZGl0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLFNBQVMsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDckMsZ0JBQVksQ0FBQztBQUNiLFdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7Q0FDdkM7O0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7QUFDNUIsVUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7Q0FDakM7O0tBRUksSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRTtBQUNqRCxjQUFNLENBQUMsWUFBWTtBQUNmLHdCQUFZLENBQUM7QUFDYixtQkFBTyxZQUFZLENBQUM7U0FDdkIsQ0FBQyxDQUFDO0tBQ047O0FBRUQsQUFBQyxDQUFBLFVBQVUsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUN6QixnQkFBWSxDQUFDOztBQUViLGFBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbEIsWUFBSSxJQUFJLENBQUM7QUFDVCxZQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7QUFDakIsbUJBQU8sQ0FBQyxDQUFDO1NBQ1o7QUFDRCxhQUFLLElBQUksSUFBSSxDQUFDLEVBQUU7QUFDWixnQkFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFO0FBQzVELGlCQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JCO1NBQ0o7QUFDRCxlQUFPLENBQUMsQ0FBQztLQUNaOztBQUVELGFBQVMsWUFBWSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDaEMsWUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVB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QUFDaEIsc0JBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUNqQyxNQUFNO0FBQ0gsc0JBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7aUJBQzNGO2FBRUo7U0FFSjs7S0FFSixDQUFDO0NBRUwsQ0FBQSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBRSIsImZpbGUiOiJtZWRpdW0tZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypnbG9iYWwgbW9kdWxlLCBjb25zb2xlLCBkZWZpbmUqL1xuXG5mdW5jdGlvbiBNZWRpdW1FZGl0b3IoZWxlbWVudHMsIG9wdGlvbnMpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgcmV0dXJuIHRoaXMuaW5pdChlbGVtZW50cywgb3B0aW9ucyk7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gTWVkaXVtRWRpdG9yO1xufVxuLy8gQU1EIHN1cHBvcnRcbmVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgcmV0dXJuIE1lZGl1bUVkaXRvcjtcbiAgICB9KTtcbn1cblxuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGIsIGEpIHtcbiAgICAgICAgdmFyIHByb3A7XG4gICAgICAgIGlmIChiID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgICAgIGZvciAocHJvcCBpbiBhKSB7XG4gICAgICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiBiLmhhc093blByb3BlcnR5KHByb3ApID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGJbcHJvcF0gPSBhW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGVzY2VuZGFudChwYXJlbnQsIGNoaWxkKSB7XG4gICAgICAgICB2YXIgbm9kZSA9IGNoaWxkLnBhcmVudE5vZGU7XG4gICAgICAgICB3aGlsZSAobm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgIGlmIChub2RlID09PSBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NjA1NDAxL2luc2VydC1saW5rLWluLWNvbnRlbnRlZGl0YWJsZS1lbGVtZW50XG4gICAgLy8gYnkgVGltIERvd25cbiAgICBmdW5jdGlvbiBzYXZlU2VsZWN0aW9uKCkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGxlbixcbiAgICAgICAgICAgIHJhbmdlcyxcbiAgICAgICAgICAgIHNlbCA9IHRoaXMub3B0aW9ucy5jb250ZW50V2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICBpZiAoc2VsLmdldFJhbmdlQXQgJiYgc2VsLnJhbmdlQ291bnQpIHtcbiAgICAgICAgICAgIHJhbmdlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gc2VsLnJhbmdlQ291bnQ7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIHJhbmdlcy5wdXNoKHNlbC5nZXRSYW5nZUF0KGkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByYW5nZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzdG9yZVNlbGVjdGlvbihzYXZlZFNlbCkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGxlbixcbiAgICAgICAgICAgIHNlbCA9IHRoaXMub3B0aW9ucy5jb250ZW50V2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICBpZiAoc2F2ZWRTZWwpIHtcbiAgICAgICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHNhdmVkU2VsLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgc2VsLmFkZFJhbmdlKHNhdmVkU2VsW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTE5NzQwMS9ob3ctY2FuLWktZ2V0LXRoZS1lbGVtZW50LXRoZS1jYXJldC1pcy1pbi13aXRoLWphdmFzY3JpcHQtd2hlbi11c2luZy1jb250ZW50ZWRpXG4gICAgLy8gYnkgWW91XG4gICAgZnVuY3Rpb24gZ2V0U2VsZWN0aW9uU3RhcnQoKSB7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5vcHRpb25zLm93bmVyRG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCkuYW5jaG9yTm9kZSxcbiAgICAgICAgICAgIHN0YXJ0Tm9kZSA9IChub2RlICYmIG5vZGUubm9kZVR5cGUgPT09IDMgPyBub2RlLnBhcmVudE5vZGUgOiBub2RlKTtcbiAgICAgICAgcmV0dXJuIHN0YXJ0Tm9kZTtcbiAgICB9XG5cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQxNzY5MjMvaHRtbC1vZi1zZWxlY3RlZC10ZXh0XG4gICAgLy8gYnkgVGltIERvd25cbiAgICBmdW5jdGlvbiBnZXRTZWxlY3Rpb25IdG1sKCkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGh0bWwgPSAnJyxcbiAgICAgICAgICAgIHNlbCxcbiAgICAgICAgICAgIGxlbixcbiAgICAgICAgICAgIGNvbnRhaW5lcjtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb250ZW50V2luZG93LmdldFNlbGVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZWwgPSB0aGlzLm9wdGlvbnMuY29udGVudFdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIGlmIChzZWwucmFuZ2VDb3VudCkge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lciA9IHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHNlbC5yYW5nZUNvdW50OyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNlbC5nZXRSYW5nZUF0KGkpLmNsb25lQ29udGVudHMoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGh0bWwgPSBjb250YWluZXIuaW5uZXJIVE1MO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LnNlbGVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm93bmVyRG9jdW1lbnQuc2VsZWN0aW9uLnR5cGUgPT09ICdUZXh0Jykge1xuICAgICAgICAgICAgICAgIGh0bWwgPSB0aGlzLm9wdGlvbnMub3duZXJEb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKS5odG1sVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmVcbiAgICBmdW5jdGlvbiBpc0VsZW1lbnQob2JqKSB7XG4gICAgICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgICB9XG5cbiAgICBNZWRpdW1FZGl0b3IucHJvdG90eXBlID0ge1xuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgYWxsb3dNdWx0aVBhcmFncmFwaFNlbGVjdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGFuY2hvcklucHV0UGxhY2Vob2xkZXI6ICdQYXN0ZSBvciB0eXBlIGEgbGluaycsXG4gICAgICAgICAgICBhbmNob3JQcmV2aWV3SGlkZURlbGF5OiA1MDAsXG4gICAgICAgICAgICBidXR0b25zOiBbJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdhbmNob3InLCAnaGVhZGVyMScsICdoZWFkZXIyJywgJ3F1b3RlJ10sXG4gICAgICAgICAgICBidXR0b25MYWJlbHM6IGZhbHNlLFxuICAgICAgICAgICAgY2hlY2tMaW5rRm9ybWF0OiBmYWxzZSxcbiAgICAgICAgICAgIGNsZWFuUGFzdGVkSFRNTDogZmFsc2UsXG4gICAgICAgICAgICBkZWxheTogMCxcbiAgICAgICAgICAgIGRpZmZMZWZ0OiAwLFxuICAgICAgICAgICAgZGlmZlRvcDogLTEwLFxuICAgICAgICAgICAgZGlzYWJsZVJldHVybjogZmFsc2UsXG4gICAgICAgICAgICBkaXNhYmxlRG91YmxlUmV0dXJuOiBmYWxzZSxcbiAgICAgICAgICAgIGRpc2FibGVUb29sYmFyOiBmYWxzZSxcbiAgICAgICAgICAgIGRpc2FibGVFZGl0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGVsZW1lbnRzQ29udGFpbmVyOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbnRlbnRXaW5kb3c6IHdpbmRvdyxcbiAgICAgICAgICAgIG93bmVyRG9jdW1lbnQ6IGRvY3VtZW50LFxuICAgICAgICAgICAgZmlyc3RIZWFkZXI6ICdoMycsXG4gICAgICAgICAgICBmb3JjZVBsYWluVGV4dDogdHJ1ZSxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnVHlwZSB5b3VyIHRleHQnLFxuICAgICAgICAgICAgc2Vjb25kSGVhZGVyOiAnaDQnLFxuICAgICAgICAgICAgdGFyZ2V0Qmxhbms6IGZhbHNlLFxuICAgICAgICAgICAgYW5jaG9yVGFyZ2V0OiBmYWxzZSxcbiAgICAgICAgICAgIGFuY2hvckJ1dHRvbjogZmFsc2UsXG4gICAgICAgICAgICBhbmNob3JCdXR0b25DbGFzczogJ2J0bicsXG4gICAgICAgICAgICBleHRlbnNpb25zOiB7fSxcbiAgICAgICAgICAgIGFjdGl2ZUJ1dHRvbkNsYXNzOiAnbWVkaXVtLWVkaXRvci1idXR0b24tYWN0aXZlJyxcbiAgICAgICAgICAgIGZpcnN0QnV0dG9uQ2xhc3M6ICdtZWRpdW0tZWRpdG9yLWJ1dHRvbi1maXJzdCcsXG4gICAgICAgICAgICBsYXN0QnV0dG9uQ2xhc3M6ICdtZWRpdW0tZWRpdG9yLWJ1dHRvbi1sYXN0J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc5MDc0NDUvaG93LXRvLWRldGVjdC1pZTExI2NvbW1lbnQzMDE2NTg4OF8xNzkwNzU2MlxuICAgICAgICAvLyBieSByZzg5XG4gICAgICAgIGlzSUU6ICgobmF2aWdhdG9yLmFwcE5hbWUgPT09ICdNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXInKSB8fCAoKG5hdmlnYXRvci5hcHBOYW1lID09PSAnTmV0c2NhcGUnKSAmJiAobmV3IFJlZ0V4cCgnVHJpZGVudC8uKnJ2OihbMC05XXsxLH1bLjAtOV17MCx9KScpLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudCkgIT09IG51bGwpKSksXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywgdGhpcy5kZWZhdWx0cyk7XG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnRTZWxlY3Rpb24oZWxlbWVudHMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50cyA9IFsncCcsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdibG9ja3F1b3RlJywgJ3ByZSddO1xuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudHNDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudHNDb250YWluZXIgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMub3B0aW9ucy5lbGVtZW50c0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubWVkaXVtLWVkaXRvci10b29sYmFyJykubGVuZ3RoICsgMTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldHVwKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0dXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gW107XG4gICAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEVsZW1lbnRzKClcbiAgICAgICAgICAgICAgICAuYmluZFNlbGVjdCgpXG4gICAgICAgICAgICAgICAgLmJpbmRQYXN0ZSgpXG4gICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVycygpXG4gICAgICAgICAgICAgICAgLmJpbmRXaW5kb3dBY3Rpb25zKClcbiAgICAgICAgICAgICAgICAucGFzc0luc3RhbmNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb246IGZ1bmN0aW9uKHRhcmdldCwgZXZlbnQsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMucHVzaChbdGFyZ2V0LCBldmVudCwgbGlzdGVuZXIsIHVzZUNhcHR1cmVdKTtcbiAgICAgICAgfSxcblxuICAgICAgICBvZmY6IGZ1bmN0aW9uKHRhcmdldCwgZXZlbnQsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmV2ZW50cy5pbmRleE9mKFt0YXJnZXQsIGV2ZW50LCBsaXN0ZW5lciwgdXNlQ2FwdHVyZV0pLFxuICAgICAgICAgICAgICAgIGU7XG4gICAgICAgICAgICBpZihpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBlID0gdGhpcy5ldmVudHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICBlWzBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoZVsxXSwgZVsyXSwgZVszXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlQWxsRXZlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlID0gdGhpcy5ldmVudHMucG9wKCk7XG4gICAgICAgICAgICB3aGlsZShlKSB7XG4gICAgICAgICAgICAgICAgZVswXS5yZW1vdmVFdmVudExpc3RlbmVyKGVbMV0sIGVbMl0sIGVbM10pO1xuICAgICAgICAgICAgICAgIGUgPSB0aGlzLmV2ZW50cy5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpbml0RWxlbWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudExpc3QoKTtcbiAgICAgICAgICAgIHZhciBpLFxuICAgICAgICAgICAgICAgIGFkZFRvb2xiYXIgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZGlzYWJsZUVkaXRpbmcgJiYgIXRoaXMuZWxlbWVudHNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLWRpc2FibGUtZWRpdGluZycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHNbaV0uc2V0QXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnRzW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlcicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHNbaV0uc2V0QXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJywgdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50c1tpXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtbWVkaXVtLWVsZW1lbnQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRQYXJhZ3JhcGhDcmVhdGlvbihpKS5iaW5kUmV0dXJuKGkpLmJpbmRUYWIoaSk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZGlzYWJsZVRvb2xiYXIgJiYgIXRoaXMuZWxlbWVudHNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLWRpc2FibGUtdG9vbGJhcicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFRvb2xiYXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEluaXQgdG9vbGJhclxuICAgICAgICAgICAgaWYgKGFkZFRvb2xiYXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRUb29sYmFyKClcbiAgICAgICAgICAgICAgICAgICAgLmJpbmRCdXR0b25zKClcbiAgICAgICAgICAgICAgICAgICAgLmJpbmRBbmNob3JGb3JtKClcbiAgICAgICAgICAgICAgICAgICAgLmJpbmRBbmNob3JQcmV2aWV3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRFbGVtZW50U2VsZWN0aW9uOiBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudFNlbGVjdGlvbiA9IHNlbGVjdG9yO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50TGlzdCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZUVsZW1lbnRMaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzID0gdHlwZW9mIHRoaXMuZWxlbWVudFNlbGVjdGlvbiA9PT0gJ3N0cmluZycgPyB0aGlzLm9wdGlvbnMub3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuZWxlbWVudFNlbGVjdGlvbikgOiB0aGlzLmVsZW1lbnRTZWxlY3Rpb247XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50cy5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSBbdGhpcy5lbGVtZW50c107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgICAgICBlbGVtZW50aWQsXG4gICAgICAgICAgICAgICAgY29udGVudCA9IHt9O1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50aWQgPSAodGhpcy5lbGVtZW50c1tpXS5pZCAhPT0gJycpID8gdGhpcy5lbGVtZW50c1tpXS5pZCA6ICdlbGVtZW50LScgKyBpO1xuICAgICAgICAgICAgICAgIGNvbnRlbnRbZWxlbWVudGlkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuZWxlbWVudHNbaV0uaW5uZXJIVE1MLnRyaW0oKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGwgYSBtZXRob2Qgd2l0aCBhIG51bWJlciBvZiBwYXJhbWV0ZXJzIG9uIGFsbCByZWdpc3RlcmVkIGV4dGVuc2lvbnMuXG4gICAgICAgICAqIFRoZSBmdW5jdGlvbiBhc3N1cmVzIHRoYXQgdGhlIGZ1bmN0aW9uIGV4aXN0cyBiZWZvcmUgY2FsbGluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmNOYW1lIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAgICAgICAgICogQHBhcmFtIFthcmdzXSBhcmd1bWVudHMgcGFzc2VkIGludG8gZnVuY05hbWVcbiAgICAgICAgICovXG4gICAgICAgIGNhbGxFeHRlbnNpb25zOiBmdW5jdGlvbiAoZnVuY05hbWUpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxuICAgICAgICAgICAgICAgIGV4dCxcbiAgICAgICAgICAgICAgICBuYW1lO1xuXG4gICAgICAgICAgICBmb3IgKG5hbWUgaW4gdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmV4dGVuc2lvbnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0ID0gdGhpcy5vcHRpb25zLmV4dGVuc2lvbnNbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChleHRbZnVuY05hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dFtmdW5jTmFtZV0uYXBwbHkoZXh0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUGFzcyBjdXJyZW50IE1lZGl1bSBFZGl0b3IgaW5zdGFuY2UgdG8gYWxsIGV4dGVuc2lvbnNcbiAgICAgICAgICogaWYgZXh0ZW5zaW9uIGNvbnN0cnVjdG9yIGhhcyAncGFyZW50JyBhdHRyaWJ1dGUgc2V0IHRvICd0cnVlJ1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgcGFzc0luc3RhbmNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgZXh0LFxuICAgICAgICAgICAgICAgIG5hbWU7XG5cbiAgICAgICAgICAgIGZvciAobmFtZSBpbiBzZWxmLm9wdGlvbnMuZXh0ZW5zaW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuZXh0ZW5zaW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBleHQgPSBzZWxmLm9wdGlvbnMuZXh0ZW5zaW9uc1tuYW1lXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZXh0LnBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0LmJhc2UgPSBzZWxmO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgICAgfSxcblxuICAgICAgICBiaW5kUGFyYWdyYXBoQ3JlYXRpb246IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5vbih0aGlzLmVsZW1lbnRzW2luZGV4XSwgJ2tleXByZXNzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGdldFNlbGVjdGlvblN0YXJ0LmNhbGwoc2VsZiksXG4gICAgICAgICAgICAgICAgICAgIHRhZ05hbWU7XG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT09IDMyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhZ05hbWUgPSBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdhJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ3VubGluaycsIGZhbHNlLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm9uKHRoaXMuZWxlbWVudHNbaW5kZXhdLCAna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0gZ2V0U2VsZWN0aW9uU3RhcnQuY2FsbChzZWxmKSxcbiAgICAgICAgICAgICAgICAgICAgdGFnTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yRWxlbWVudDtcblxuICAgICAgICAgICAgICAgIGlmIChub2RlICYmIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW1lZGl1bS1lbGVtZW50JykgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDAgJiYgIShzZWxmLm9wdGlvbnMuZGlzYWJsZVJldHVybiB8fCBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1kaXNhYmxlLXJldHVybicpKSkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ3AnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBnZXRTZWxlY3Rpb25TdGFydC5jYWxsKHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICB0YWdOYW1lID0gbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRvckVsZW1lbnQgPSBzZWxmLmdldFNlbGVjdGlvbkVsZW1lbnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShzZWxmLm9wdGlvbnMuZGlzYWJsZVJldHVybiB8fCBlZGl0b3JFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1kaXNhYmxlLXJldHVybicpKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnTmFtZSAhPT0gJ2xpJyAmJiAhc2VsZi5pc0xpc3RJdGVtQ2hpbGQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JtYXRCbG9jaycsIGZhbHNlLCAncCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdhJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCd1bmxpbmsnLCBmYWxzZSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzTGlzdEl0ZW1DaGlsZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnROb2RlID0gbm9kZS5wYXJlbnROb2RlLFxuICAgICAgICAgICAgICAgIHRhZ05hbWUgPSBwYXJlbnROb2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLnBhcmVudEVsZW1lbnRzLmluZGV4T2YodGFnTmFtZSkgPT09IC0xICYmIHRhZ05hbWUgIT09ICdkaXYnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdsaScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudE5vZGUgJiYgcGFyZW50Tm9kZS50YWdOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhZ05hbWUgPSBwYXJlbnROb2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGJpbmRSZXR1cm46IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5vbih0aGlzLmVsZW1lbnRzW2luZGV4XSwgJ2tleXByZXNzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5kaXNhYmxlUmV0dXJuIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWRpc2FibGUtcmV0dXJuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLm9wdGlvbnMuZGlzYWJsZURvdWJsZVJldHVybiB8fCB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1kaXNhYmxlLWRvdWJsZS1yZXR1cm4nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBnZXRTZWxlY3Rpb25TdGFydC5jYWxsKHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5pbm5lclRleHQgPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBiaW5kVGFiOiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMub24odGhpcy5lbGVtZW50c1tpbmRleF0sICdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PT0gOSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBPdmVycmlkZSB0YWIgb25seSBmb3IgcHJlIG5vZGVzXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWcgPSBnZXRTZWxlY3Rpb25TdGFydC5jYWxsKHNlbGYpLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZyA9PT0gJ3ByZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRIdG1sJywgbnVsbCwgJyAgICAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRhYiB0byBpbmRlbnQgbGlzdCBzdHJ1Y3R1cmVzIVxuICAgICAgICAgICAgICAgICAgICBpZiAodGFnID09PSAnbGknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIFNoaWZ0IGlzIGRvd24sIG91dGRlbnQsIG90aGVyd2lzZSBpbmRlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ291dGRlbnQnLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luZGVudCcsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBidXR0b25UZW1wbGF0ZTogZnVuY3Rpb24gKGJ0blR5cGUpIHtcbiAgICAgICAgICAgIHZhciBidXR0b25MYWJlbHMgPSB0aGlzLmdldEJ1dHRvbkxhYmVscyh0aGlzLm9wdGlvbnMuYnV0dG9uTGFiZWxzKSxcbiAgICAgICAgICAgICAgICBidXR0b25UZW1wbGF0ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICdib2xkJzogJzxidXR0b24gY2xhc3M9XCJtZWRpdW0tZWRpdG9yLWFjdGlvbiBtZWRpdW0tZWRpdG9yLWFjdGlvbi1ib2xkXCIgZGF0YS1hY3Rpb249XCJib2xkXCIgZGF0YS1lbGVtZW50PVwiYlwiPicgKyBidXR0b25MYWJlbHMuYm9sZCArICc8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICAnaXRhbGljJzogJzxidXR0b24gY2xhc3M9XCJtZWRpdW0tZWRpdG9yLWFjdGlvbiBtZWRpdW0tZWRpdG9yLWFjdGlvbi1pdGFsaWNcIiBkYXRhLWFjdGlvbj1cIml0YWxpY1wiIGRhdGEtZWxlbWVudD1cImlcIj4nICsgYnV0dG9uTGFiZWxzLml0YWxpYyArICc8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICAndW5kZXJsaW5lJzogJzxidXR0b24gY2xhc3M9XCJtZWRpdW0tZWRpdG9yLWFjdGlvbiBtZWRpdW0tZWRpdG9yLWFjdGlvbi11bmRlcmxpbmVcIiBkYXRhLWFjdGlvbj1cInVuZGVybGluZVwiIGRhdGEtZWxlbWVudD1cInVcIj4nICsgYnV0dG9uTGFiZWxzLnVuZGVybGluZSArICc8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICAnc3RyaWtldGhyb3VnaCc6ICc8YnV0dG9uIGNsYXNzPVwibWVkaXVtLWVkaXRvci1hY3Rpb24gbWVkaXVtLWVkaXRvci1hY3Rpb24tc3RyaWtldGhyb3VnaFwiIGRhdGEtYWN0aW9uPVwic3RyaWtldGhyb3VnaFwiIGRhdGEtZWxlbWVudD1cInN0cmlrZVwiPicgKyBidXR0b25MYWJlbHMuc3RyaWtldGhyb3VnaCArJzwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgICAgICdzdXBlcnNjcmlwdCc6ICc8YnV0dG9uIGNsYXNzPVwibWVkaXVtLWVkaXRvci1hY3Rpb24gbWVkaXVtLWVkaXRvci1hY3Rpb24tc3VwZXJzY3JpcHRcIiBkYXRhLWFjdGlvbj1cInN1cGVyc2NyaXB0XCIgZGF0YS1lbGVtZW50PVwic3VwXCI+JyArIGJ1dHRvbkxhYmVscy5zdXBlcnNjcmlwdCArICc8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICAnc3Vic2NyaXB0JzogJzxidXR0b24gY2xhc3M9XCJtZWRpdW0tZWRpdG9yLWFjdGlvbiBtZWRpdW0tZWRpdG9yLWFjdGlvbi1zdWJzY3JpcHRcIiBkYXRhLWFjdGlvbj1cInN1YnNjcmlwdFwiIGRhdGEtZWxlbWVudD1cInN1YlwiPicgKyBidXR0b25MYWJlbHMuc3Vic2NyaXB0ICsgJzwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgICAgICdhbmNob3InOiAnPGJ1dHRvbiBjbGFzcz1cIm1lZGl1bS1lZGl0b3ItYWN0aW9uIG1lZGl1bS1lZGl0b3ItYWN0aW9uLWFuY2hvclwiIGRhdGEtYWN0aW9uPVwiYW5jaG9yXCIgZGF0YS1lbGVtZW50PVwiYVwiPicgKyBidXR0b25MYWJlbHMuYW5jaG9yICsgJzwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgICAgICdpbWFnZSc6ICc8YnV0dG9uIGNsYXNzPVwibWVkaXVtLWVkaXRvci1hY3Rpb24gbWVkaXVtLWVkaXRvci1hY3Rpb24taW1hZ2VcIiBkYXRhLWFjdGlvbj1cImltYWdlXCIgZGF0YS1lbGVtZW50PVwiaW1nXCI+JyArIGJ1dHRvbkxhYmVscy5pbWFnZSArICc8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICAnaGVhZGVyMSc6ICc8YnV0dG9uIGNsYXNzPVwibWVkaXVtLWVkaXRvci1hY3Rpb24gbWVkaXVtLWVkaXRvci1hY3Rpb24taGVhZGVyMVwiIGRhdGEtYWN0aW9uPVwiYXBwZW5kLScgKyB0aGlzLm9wdGlvbnMuZmlyc3RIZWFkZXIgKyAnXCIgZGF0YS1lbGVtZW50PVwiJyArIHRoaXMub3B0aW9ucy5maXJzdEhlYWRlciArICdcIj4nICsgYnV0dG9uTGFiZWxzLmhlYWRlcjEgKyAnPC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2hlYWRlcjInOiAnPGJ1dHRvbiBjbGFzcz1cIm1lZGl1bS1lZGl0b3ItYWN0aW9uIG1lZGl1bS1lZGl0b3ItYWN0aW9uLWhlYWRlcjJcIiBkYXRhLWFjdGlvbj1cImFwcGVuZC0nICsgdGhpcy5vcHRpb25zLnNlY29uZEhlYWRlciArICdcIiBkYXRhLWVsZW1lbnQ9XCInICsgdGhpcy5vcHRpb25zLnNlY29uZEhlYWRlciArICdcIj4nICsgYnV0dG9uTGFiZWxzLmhlYWRlcjIgKyAnPC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICAgICAgJ3F1b3RlJzogJzxidXR0b24gY2xhc3M9XCJtZWRpdW0tZWRpdG9yLWFjdGlvbiBtZWRpdW0tZWRpdG9yLWFjdGlvbi1xdW90ZVwiIGRhdGEtYWN0aW9uPVwiYXBwZW5kLWJsb2NrcXVvdGVcIiBkYXRhLWVsZW1lbnQ9XCJibG9ja3F1b3RlXCI+JyArIGJ1dHRvbkxhYmVscy5xdW90ZSArICc8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICAnb3JkZXJlZGxpc3QnOiAnPGJ1dHRvbiBjbGFzcz1cIm1lZGl1bS1lZGl0b3ItYWN0aW9uIG1lZGl1bS1lZGl0b3ItYWN0aW9uLW9yZGVyZWRsaXN0XCIgZGF0YS1hY3Rpb249XCJpbnNlcnRvcmRlcmVkbGlzdFwiIGRhdGEtZWxlbWVudD1cIm9sXCI+JyArIGJ1dHRvbkxhYmVscy5vcmRlcmVkbGlzdCArICc8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICAndW5vcmRlcmVkbGlzdCc6ICc8YnV0dG9uIGNsYXNzPVwibWVkaXVtLWVkaXRvci1hY3Rpb24gbWVkaXVtLWVkaXRvci1hY3Rpb24tdW5vcmRlcmVkbGlzdFwiIGRhdGEtYWN0aW9uPVwiaW5zZXJ0dW5vcmRlcmVkbGlzdFwiIGRhdGEtZWxlbWVudD1cInVsXCI+JyArIGJ1dHRvbkxhYmVscy51bm9yZGVyZWRsaXN0ICsgJzwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgICAgICdwcmUnOiAnPGJ1dHRvbiBjbGFzcz1cIm1lZGl1bS1lZGl0b3ItYWN0aW9uIG1lZGl1bS1lZGl0b3ItYWN0aW9uLXByZVwiIGRhdGEtYWN0aW9uPVwiYXBwZW5kLXByZVwiIGRhdGEtZWxlbWVudD1cInByZVwiPicgKyBidXR0b25MYWJlbHMucHJlICsgJzwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgICAgICdpbmRlbnQnOiAnPGJ1dHRvbiBjbGFzcz1cIm1lZGl1bS1lZGl0b3ItYWN0aW9uIG1lZGl1bS1lZGl0b3ItYWN0aW9uLWluZGVudFwiIGRhdGEtYWN0aW9uPVwiaW5kZW50XCIgZGF0YS1lbGVtZW50PVwidWxcIj4nICsgYnV0dG9uTGFiZWxzLmluZGVudCArICc8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICAnb3V0ZGVudCc6ICc8YnV0dG9uIGNsYXNzPVwibWVkaXVtLWVkaXRvci1hY3Rpb24gbWVkaXVtLWVkaXRvci1hY3Rpb24tb3V0ZGVudFwiIGRhdGEtYWN0aW9uPVwib3V0ZGVudFwiIGRhdGEtZWxlbWVudD1cInVsXCI+JyArIGJ1dHRvbkxhYmVscy5vdXRkZW50ICsgJzwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgICAgICdqdXN0aWZ5Q2VudGVyJzogJzxidXR0b24gY2xhc3M9XCJtZWRpdW0tZWRpdG9yLWFjdGlvbiBtZWRpdW0tZWRpdG9yLWFjdGlvbi1qdXN0aWZ5Q2VudGVyXCIgZGF0YS1hY3Rpb249XCJqdXN0aWZ5Q2VudGVyXCIgZGF0YS1lbGVtZW50PVwiXCI+JyArIGJ1dHRvbkxhYmVscy5qdXN0aWZ5Q2VudGVyICsgJzwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgICAgICdqdXN0aWZ5RnVsbCc6ICc8YnV0dG9uIGNsYXNzPVwibWVkaXVtLWVkaXRvci1hY3Rpb24gbWVkaXVtLWVkaXRvci1hY3Rpb24tanVzdGlmeUZ1bGxcIiBkYXRhLWFjdGlvbj1cImp1c3RpZnlGdWxsXCIgZGF0YS1lbGVtZW50PVwiXCI+JyArIGJ1dHRvbkxhYmVscy5qdXN0aWZ5RnVsbCArICc8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICAnanVzdGlmeUxlZnQnOiAnPGJ1dHRvbiBjbGFzcz1cIm1lZGl1bS1lZGl0b3ItYWN0aW9uIG1lZGl1bS1lZGl0b3ItYWN0aW9uLWp1c3RpZnlMZWZ0XCIgZGF0YS1hY3Rpb249XCJqdXN0aWZ5TGVmdFwiIGRhdGEtZWxlbWVudD1cIlwiPicgKyBidXR0b25MYWJlbHMuanVzdGlmeUxlZnQgKyAnPC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2p1c3RpZnlSaWdodCc6ICc8YnV0dG9uIGNsYXNzPVwibWVkaXVtLWVkaXRvci1hY3Rpb24gbWVkaXVtLWVkaXRvci1hY3Rpb24tanVzdGlmeVJpZ2h0XCIgZGF0YS1hY3Rpb249XCJqdXN0aWZ5UmlnaHRcIiBkYXRhLWVsZW1lbnQ9XCJcIj4nICsgYnV0dG9uTGFiZWxzLmp1c3RpZnlSaWdodCArICc8L2J1dHRvbj4nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBidXR0b25UZW1wbGF0ZXNbYnRuVHlwZV0gfHwgZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVE9ETzogYnJlYWsgbWV0aG9kXG4gICAgICAgIGdldEJ1dHRvbkxhYmVsczogZnVuY3Rpb24gKGJ1dHRvbkxhYmVsVHlwZSkge1xuICAgICAgICAgICAgdmFyIGN1c3RvbUJ1dHRvbkxhYmVscyxcbiAgICAgICAgICAgICAgICBhdHRybmFtZSxcbiAgICAgICAgICAgICAgICBidXR0b25MYWJlbHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICdib2xkJzogJzxiPkI8L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2l0YWxpYyc6ICc8Yj48aT5JPC9pPjwvYj4nLFxuICAgICAgICAgICAgICAgICAgICAndW5kZXJsaW5lJzogJzxiPjx1PlU8L3U+PC9iPicsXG4gICAgICAgICAgICAgICAgICAgICdzdHJpa2V0aHJvdWdoJzogJzxzPkE8L3M+JyxcbiAgICAgICAgICAgICAgICAgICAgJ3N1cGVyc2NyaXB0JzogJzxiPng8c3VwPjE8L3N1cD48L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ3N1YnNjcmlwdCc6ICc8Yj54PHN1Yj4xPC9zdWI+PC9iPicsXG4gICAgICAgICAgICAgICAgICAgICdhbmNob3InOiAnPGI+IzwvYj4nLFxuICAgICAgICAgICAgICAgICAgICAnaW1hZ2UnOiAnPGI+aW1hZ2U8L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2hlYWRlcjEnOiAnPGI+SDE8L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2hlYWRlcjInOiAnPGI+SDI8L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ3F1b3RlJzogJzxiPiZsZHF1bzs8L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ29yZGVyZWRsaXN0JzogJzxiPjEuPC9iPicsXG4gICAgICAgICAgICAgICAgICAgICd1bm9yZGVyZWRsaXN0JzogJzxiPiZidWxsOzwvYj4nLFxuICAgICAgICAgICAgICAgICAgICAncHJlJzogJzxiPjAxMDE8L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2luZGVudCc6ICc8Yj4mcmFycjs8L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ291dGRlbnQnOiAnPGI+JmxhcnI7PC9iPicsXG4gICAgICAgICAgICAgICAgICAgICdqdXN0aWZ5Q2VudGVyJzogJzxiPkM8L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2p1c3RpZnlGdWxsJzogJzxiPko8L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2p1c3RpZnlMZWZ0JzogJzxiPkw8L2I+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2p1c3RpZnlSaWdodCc6ICc8Yj5SPC9iPidcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGJ1dHRvbkxhYmVsVHlwZSA9PT0gJ2ZvbnRhd2Vzb21lJykge1xuICAgICAgICAgICAgICAgIGN1c3RvbUJ1dHRvbkxhYmVscyA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ2JvbGQnOiAnPGkgY2xhc3M9XCJmYSBmYS1ib2xkXCI+PC9pPicsXG4gICAgICAgICAgICAgICAgICAgICdpdGFsaWMnOiAnPGkgY2xhc3M9XCJmYSBmYS1pdGFsaWNcIj48L2k+JyxcbiAgICAgICAgICAgICAgICAgICAgJ3VuZGVybGluZSc6ICc8aSBjbGFzcz1cImZhIGZhLXVuZGVybGluZVwiPjwvaT4nLFxuICAgICAgICAgICAgICAgICAgICAnc3RyaWtldGhyb3VnaCc6ICc8aSBjbGFzcz1cImZhIGZhLXN0cmlrZXRocm91Z2hcIj48L2k+JyxcbiAgICAgICAgICAgICAgICAgICAgJ3N1cGVyc2NyaXB0JzogJzxpIGNsYXNzPVwiZmEgZmEtc3VwZXJzY3JpcHRcIj48L2k+JyxcbiAgICAgICAgICAgICAgICAgICAgJ3N1YnNjcmlwdCc6ICc8aSBjbGFzcz1cImZhIGZhLXN1YnNjcmlwdFwiPjwvaT4nLFxuICAgICAgICAgICAgICAgICAgICAnYW5jaG9yJzogJzxpIGNsYXNzPVwiZmEgZmEtbGlua1wiPjwvaT4nLFxuICAgICAgICAgICAgICAgICAgICAnaW1hZ2UnOiAnPGkgY2xhc3M9XCJmYSBmYS1waWN0dXJlLW9cIj48L2k+JyxcbiAgICAgICAgICAgICAgICAgICAgJ3F1b3RlJzogJzxpIGNsYXNzPVwiZmEgZmEtcXVvdGUtcmlnaHRcIj48L2k+JyxcbiAgICAgICAgICAgICAgICAgICAgJ29yZGVyZWRsaXN0JzogJzxpIGNsYXNzPVwiZmEgZmEtbGlzdC1vbFwiPjwvaT4nLFxuICAgICAgICAgICAgICAgICAgICAndW5vcmRlcmVkbGlzdCc6ICc8aSBjbGFzcz1cImZhIGZhLWxpc3QtdWxcIj48L2k+JyxcbiAgICAgICAgICAgICAgICAgICAgJ3ByZSc6ICc8aSBjbGFzcz1cImZhIGZhLWNvZGUgZmEtbGdcIj48L2k+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2luZGVudCc6ICc8aSBjbGFzcz1cImZhIGZhLWluZGVudFwiPjwvaT4nLFxuICAgICAgICAgICAgICAgICAgICAnb3V0ZGVudCc6ICc8aSBjbGFzcz1cImZhIGZhLW91dGRlbnRcIj48L2k+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2p1c3RpZnlDZW50ZXInOiAnPGkgY2xhc3M9XCJmYSBmYS1hbGlnbi1jZW50ZXJcIj48L2k+JyxcbiAgICAgICAgICAgICAgICAgICAgJ2p1c3RpZnlGdWxsJzogJzxpIGNsYXNzPVwiZmEgZmEtYWxpZ24tanVzdGlmeVwiPjwvaT4nLFxuICAgICAgICAgICAgICAgICAgICAnanVzdGlmeUxlZnQnOiAnPGkgY2xhc3M9XCJmYSBmYS1hbGlnbi1sZWZ0XCI+PC9pPicsXG4gICAgICAgICAgICAgICAgICAgICdqdXN0aWZ5UmlnaHQnOiAnPGkgY2xhc3M9XCJmYSBmYS1hbGlnbi1yaWdodFwiPjwvaT4nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJ1dHRvbkxhYmVsVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBjdXN0b21CdXR0b25MYWJlbHMgPSBidXR0b25MYWJlbFR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1c3RvbUJ1dHRvbkxhYmVscyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGF0dHJuYW1lIGluIGN1c3RvbUJ1dHRvbkxhYmVscykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VzdG9tQnV0dG9uTGFiZWxzLmhhc093blByb3BlcnR5KGF0dHJuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uTGFiZWxzW2F0dHJuYW1lXSA9IGN1c3RvbUJ1dHRvbkxhYmVsc1thdHRybmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uTGFiZWxzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRUb29sYmFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50b29sYmFyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRvb2xiYXIgPSB0aGlzLmNyZWF0ZVRvb2xiYXIoKTtcbiAgICAgICAgICAgIHRoaXMua2VlcFRvb2xiYXJBbGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5hbmNob3JGb3JtID0gdGhpcy50b29sYmFyLnF1ZXJ5U2VsZWN0b3IoJy5tZWRpdW0tZWRpdG9yLXRvb2xiYXItZm9ybS1hbmNob3InKTtcbiAgICAgICAgICAgIHRoaXMuYW5jaG9ySW5wdXQgPSB0aGlzLmFuY2hvckZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXQubWVkaXVtLWVkaXRvci10b29sYmFyLWFuY2hvci1pbnB1dCcpO1xuICAgICAgICAgICAgdGhpcy5hbmNob3JUYXJnZXQgPSB0aGlzLmFuY2hvckZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXQubWVkaXVtLWVkaXRvci10b29sYmFyLWFuY2hvci10YXJnZXQnKTtcbiAgICAgICAgICAgIHRoaXMuYW5jaG9yQnV0dG9uID0gdGhpcy5hbmNob3JGb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Lm1lZGl1bS1lZGl0b3ItdG9vbGJhci1hbmNob3ItYnV0dG9uJyk7XG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJBY3Rpb25zID0gdGhpcy50b29sYmFyLnF1ZXJ5U2VsZWN0b3IoJy5tZWRpdW0tZWRpdG9yLXRvb2xiYXItYWN0aW9ucycpO1xuICAgICAgICAgICAgdGhpcy5hbmNob3JQcmV2aWV3ID0gdGhpcy5jcmVhdGVBbmNob3JQcmV2aWV3KCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVRvb2xiYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0b29sYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0b29sYmFyLmlkID0gJ21lZGl1bS1lZGl0b3ItdG9vbGJhci0nICsgdGhpcy5pZDtcbiAgICAgICAgICAgIHRvb2xiYXIuY2xhc3NOYW1lID0gJ21lZGl1bS1lZGl0b3ItdG9vbGJhcic7XG4gICAgICAgICAgICB0b29sYmFyLmFwcGVuZENoaWxkKHRoaXMudG9vbGJhckJ1dHRvbnMoKSk7XG4gICAgICAgICAgICB0b29sYmFyLmFwcGVuZENoaWxkKHRoaXMudG9vbGJhckZvcm1BbmNob3IoKSk7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudHNDb250YWluZXIuYXBwZW5kQ2hpbGQodG9vbGJhcik7XG4gICAgICAgICAgICByZXR1cm4gdG9vbGJhcjtcbiAgICAgICAgfSxcblxuICAgICAgICAvL1RPRE86IGFjdGlvblRlbXBsYXRlXG4gICAgICAgIHRvb2xiYXJCdXR0b25zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYnRucyA9IHRoaXMub3B0aW9ucy5idXR0b25zLFxuICAgICAgICAgICAgICAgIHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKSxcbiAgICAgICAgICAgICAgICBsaSxcbiAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgIGJ0bixcbiAgICAgICAgICAgICAgICBleHQ7XG5cbiAgICAgICAgICAgIHVsLmlkID0gJ21lZGl1bS1lZGl0b3ItdG9vbGJhci1hY3Rpb25zJztcbiAgICAgICAgICAgIHVsLmNsYXNzTmFtZSA9ICdtZWRpdW0tZWRpdG9yLXRvb2xiYXItYWN0aW9ucyBjbGVhcmZpeCc7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBidG5zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5leHRlbnNpb25zLmhhc093blByb3BlcnR5KGJ0bnNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4dCA9IHRoaXMub3B0aW9ucy5leHRlbnNpb25zW2J0bnNbaV1dO1xuICAgICAgICAgICAgICAgICAgICBidG4gPSBleHQuZ2V0QnV0dG9uICE9PSB1bmRlZmluZWQgPyBleHQuZ2V0QnV0dG9uKCkgOiBudWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJ0biA9IHRoaXMuYnV0dG9uVGVtcGxhdGUoYnRuc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJ0bikge1xuICAgICAgICAgICAgICAgICAgICBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0VsZW1lbnQoYnRuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGkuYXBwZW5kQ2hpbGQoYnRuKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpLmlubmVySFRNTCA9IGJ0bjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB1bC5hcHBlbmRDaGlsZChsaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdWw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9vbGJhckZvcm1BbmNob3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JyksXG4gICAgICAgICAgICAgICAgdGFyZ2V0X2xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKSxcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbl9sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyksXG4gICAgICAgICAgICAgICAgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSxcbiAgICAgICAgICAgICAgICBjbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSxcbiAgICAgICAgICAgICAgICBzYXZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gICAgICAgICAgICBjbG9zZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgICAgICAgICAgY2xvc2UuY2xhc3NOYW1lID0gJ21lZGl1bS1lZGl0b3ItdG9vYmFyLWFuY2hvci1jbG9zZSc7XG4gICAgICAgICAgICBjbG9zZS5pbm5lckhUTUwgPSAnJnRpbWVzOyc7XG5cbiAgICAgICAgICAgIHNhdmUuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIHNhdmUuY2xhc3NOYW1lID0gJ21lZGl1bS1lZGl0b3ItdG9vYmFyLWFuY2hvci1zYXZlJztcbiAgICAgICAgICAgIHNhdmUuaW5uZXJIVE1MID0gJyYjMTAwMDM7JztcblxuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICAgICAgICAgIGlucHV0LmNsYXNzTmFtZSA9ICdtZWRpdW0tZWRpdG9yLXRvb2xiYXItYW5jaG9yLWlucHV0JztcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCB0aGlzLm9wdGlvbnMuYW5jaG9ySW5wdXRQbGFjZWhvbGRlcik7XG5cblxuICAgICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTmFtZSA9ICdtZWRpdW0tZWRpdG9yLXRvb2xiYXItYW5jaG9yLXRhcmdldCc7XG4gICAgICAgICAgICB0YXJnZXRfbGFiZWwuaW5uZXJIVE1MID0gXCJPcGVuIGluIE5ldyBXaW5kb3c/XCI7XG4gICAgICAgICAgICB0YXJnZXRfbGFiZWwuaW5zZXJ0QmVmb3JlKHRhcmdldCwgdGFyZ2V0X2xhYmVsLmZpcnN0Q2hpbGQpO1xuXG4gICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gJ21lZGl1bS1lZGl0b3ItdG9vbGJhci1hbmNob3ItYnV0dG9uJztcbiAgICAgICAgICAgIGJ1dHRvbl9sYWJlbC5pbm5lckhUTUwgPSBcIkJ1dHRvblwiO1xuICAgICAgICAgICAgYnV0dG9uX2xhYmVsLmluc2VydEJlZm9yZShidXR0b24sIGJ1dHRvbl9sYWJlbC5maXJzdENoaWxkKTtcblxuXG4gICAgICAgICAgICBhbmNob3IuY2xhc3NOYW1lID0gJ21lZGl1bS1lZGl0b3ItdG9vbGJhci1mb3JtLWFuY2hvcic7XG4gICAgICAgICAgICBhbmNob3IuaWQgPSAnbWVkaXVtLWVkaXRvci10b29sYmFyLWZvcm0tYW5jaG9yJztcbiAgICAgICAgICAgIGFuY2hvci5hcHBlbmRDaGlsZChpbnB1dCk7XG5cbiAgICAgICAgICAgIGFuY2hvci5hcHBlbmRDaGlsZChzYXZlKTtcbiAgICAgICAgICAgIGFuY2hvci5hcHBlbmRDaGlsZChjbG9zZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5jaG9yVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgYW5jaG9yLmFwcGVuZENoaWxkKHRhcmdldF9sYWJlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5jaG9yQnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgYW5jaG9yLmFwcGVuZENoaWxkKGJ1dHRvbl9sYWJlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhbmNob3I7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYmluZFNlbGVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHRpbWVyID0gJycsXG4gICAgICAgICAgICAgICAgaTtcblxuICAgICAgICAgICAgdGhpcy5jaGVja1NlbGVjdGlvbldyYXBwZXIgPSBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICAgICAgLy8gRG8gbm90IGNsb3NlIHRoZSB0b29sYmFyIHdoZW4gYmx1cmluZyB0aGUgZWRpdGFibGUgYXJlYSBhbmQgY2xpY2tpbmcgaW50byB0aGUgYW5jaG9yIGZvcm1cbiAgICAgICAgICAgICAgICBpZiAoZSAmJiBzZWxmLmNsaWNraW5nSW50b0FyY2hvckZvcm0oZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jaGVja1NlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLm9uKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJ21vdXNldXAnLCB0aGlzLmNoZWNrU2VsZWN0aW9uV3JhcHBlcik7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmVsZW1lbnRzW2ldLCAna2V5dXAnLCB0aGlzLmNoZWNrU2VsZWN0aW9uV3JhcHBlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmVsZW1lbnRzW2ldLCAnYmx1cicsIHRoaXMuY2hlY2tTZWxlY3Rpb25XcmFwcGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNoZWNrU2VsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbmV3U2VsZWN0aW9uLFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbkVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmtlZXBUb29sYmFyQWxpdmUgIT09IHRydWUgJiYgIXRoaXMub3B0aW9ucy5kaXNhYmxlVG9vbGJhcikge1xuXG4gICAgICAgICAgICAgICAgbmV3U2VsZWN0aW9uID0gdGhpcy5vcHRpb25zLmNvbnRlbnRXaW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKG5ld1NlbGVjdGlvbi50b1N0cmluZygpLnRyaW0oKSA9PT0gJycgfHxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMub3B0aW9ucy5hbGxvd011bHRpUGFyYWdyYXBoU2VsZWN0aW9uID09PSBmYWxzZSAmJiB0aGlzLmhhc011bHRpUGFyYWdyYXBocygpKSB8fFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkluQ29udGVudEVkaXRhYmxlRmFsc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGVUb29sYmFyQWN0aW9ucygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkVsZW1lbnQgPSB0aGlzLmdldFNlbGVjdGlvbkVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxlY3Rpb25FbGVtZW50IHx8IHNlbGVjdGlvbkVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWRpc2FibGUtdG9vbGJhcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGVUb29sYmFyQWN0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja1NlbGVjdGlvbkVsZW1lbnQobmV3U2VsZWN0aW9uLCBzZWxlY3Rpb25FbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsaWNraW5nSW50b0FyY2hvckZvcm06IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChlLnR5cGUgJiYgZS50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdibHVyJyAmJiBlLnJlbGF0ZWRUYXJnZXQgJiYgZS5yZWxhdGVkVGFyZ2V0ID09PSBzZWxmLmFuY2hvcklucHV0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICBoYXNNdWx0aVBhcmFncmFwaHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb25IdG1sID0gZ2V0U2VsZWN0aW9uSHRtbC5jYWxsKHRoaXMpLnJlcGxhY2UoLzxbXFxTXSs+PFxcL1tcXFNdKz4vZ2ltLCAnJyksXG4gICAgICAgICAgICAgICAgaGFzTXVsdGlQYXJhZ3JhcGhzID0gc2VsZWN0aW9uSHRtbC5tYXRjaCgvPChwfGhbMC02XXxibG9ja3F1b3RlKT4oW1xcc1xcU10qPyk8XFwvKHB8aFswLTZdfGJsb2NrcXVvdGUpPi9nKTtcblxuICAgICAgICAgICAgcmV0dXJuIChoYXNNdWx0aVBhcmFncmFwaHMgPyBoYXNNdWx0aVBhcmFncmFwaHMubGVuZ3RoIDogMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hlY2tTZWxlY3Rpb25FbGVtZW50OiBmdW5jdGlvbiAobmV3U2VsZWN0aW9uLCBzZWxlY3Rpb25FbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uID0gbmV3U2VsZWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZSA9IHRoaXMuc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnRzW2ldID09PSBzZWxlY3Rpb25FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9vbGJhckJ1dHRvblN0YXRlcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbGJhclBvc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zaG93VG9vbGJhckFjdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaGlkZVRvb2xiYXJBY3Rpb25zKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluZE1hdGNoaW5nU2VsZWN0aW9uUGFyZW50OiBmdW5jdGlvbih0ZXN0RWxlbWVudEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0aW9uID0gdGhpcy5vcHRpb25zLmNvbnRlbnRXaW5kb3cuZ2V0U2VsZWN0aW9uKCksIHJhbmdlLCBjdXJyZW50O1xuXG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uLnJhbmdlQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XG4gICAgICAgICAgICBjdXJyZW50ID0gcmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG5cbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnQubm9kZVR5cGUgPT09IDEpe1xuICAgICAgICAgICAgICAgIGlmICggdGVzdEVsZW1lbnRGdW5jdGlvbihjdXJyZW50KSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90IHRyYXZlcnNlIHVwd2FyZHMgcGFzdCB0aGUgbmVhcmVzdCBjb250YWluaW5nIGVkaXRvclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1tZWRpdW0tZWxlbWVudCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgfSB3aGlsZSAoY3VycmVudCk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTZWxlY3Rpb25FbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5kTWF0Y2hpbmdTZWxlY3Rpb25QYXJlbnQoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLW1lZGl1bS1lbGVtZW50Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZWxlY3Rpb25JbkNvbnRlbnRFZGl0YWJsZUZhbHNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5kTWF0Y2hpbmdTZWxlY3Rpb25QYXJlbnQoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGVsICYmIGVsLm5vZGVOYW1lICE9PSAnI3RleHQnICYmIGVsLmdldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykgPT09ICdmYWxzZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0VG9vbGJhclBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYnV0dG9uSGVpZ2h0ID0gNTAsXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uID0gdGhpcy5vcHRpb25zLmNvbnRlbnRXaW5kb3cuZ2V0U2VsZWN0aW9uKCksXG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0UmFuZ2VBdCgwKSxcbiAgICAgICAgICAgICAgICBib3VuZGFyeSA9IHJhbmdlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRMZWZ0ID0gKHRoaXMub3B0aW9ucy5kaWZmTGVmdCkgLSAodGhpcy50b29sYmFyLm9mZnNldFdpZHRoIC8gMiksXG4gICAgICAgICAgICAgICAgbWlkZGxlQm91bmRhcnkgPSAoYm91bmRhcnkubGVmdCArIGJvdW5kYXJ5LnJpZ2h0KSAvIDIsXG4gICAgICAgICAgICAgICAgaGFsZk9mZnNldFdpZHRoID0gdGhpcy50b29sYmFyLm9mZnNldFdpZHRoIC8gMjtcbiAgICAgICAgICAgIGlmIChib3VuZGFyeS50b3AgPCBidXR0b25IZWlnaHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXIuY2xhc3NMaXN0LmFkZCgnbWVkaXVtLXRvb2xiYXItYXJyb3ctb3ZlcicpO1xuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhci5jbGFzc0xpc3QucmVtb3ZlKCdtZWRpdW0tdG9vbGJhci1hcnJvdy11bmRlcicpO1xuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhci5zdHlsZS50b3AgPSBidXR0b25IZWlnaHQgKyBib3VuZGFyeS5ib3R0b20gLSB0aGlzLm9wdGlvbnMuZGlmZlRvcCArIHRoaXMub3B0aW9ucy5jb250ZW50V2luZG93LnBhZ2VZT2Zmc2V0IC0gdGhpcy50b29sYmFyLm9mZnNldEhlaWdodCArICdweCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhci5jbGFzc0xpc3QuYWRkKCdtZWRpdW0tdG9vbGJhci1hcnJvdy11bmRlcicpO1xuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhci5jbGFzc0xpc3QucmVtb3ZlKCdtZWRpdW0tdG9vbGJhci1hcnJvdy1vdmVyJyk7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyLnN0eWxlLnRvcCA9IGJvdW5kYXJ5LnRvcCArIHRoaXMub3B0aW9ucy5kaWZmVG9wICsgdGhpcy5vcHRpb25zLmNvbnRlbnRXaW5kb3cucGFnZVlPZmZzZXQgLSB0aGlzLnRvb2xiYXIub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtaWRkbGVCb3VuZGFyeSA8IGhhbGZPZmZzZXRXaWR0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhci5zdHlsZS5sZWZ0ID0gZGVmYXVsdExlZnQgKyBoYWxmT2Zmc2V0V2lkdGggKyAncHgnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgodGhpcy5vcHRpb25zLmNvbnRlbnRXaW5kb3cuaW5uZXJXaWR0aCAtIG1pZGRsZUJvdW5kYXJ5KSA8IGhhbGZPZmZzZXRXaWR0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhci5zdHlsZS5sZWZ0ID0gdGhpcy5vcHRpb25zLmNvbnRlbnRXaW5kb3cuaW5uZXJXaWR0aCArIGRlZmF1bHRMZWZ0IC0gaGFsZk9mZnNldFdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyLnN0eWxlLmxlZnQgPSBkZWZhdWx0TGVmdCArIG1pZGRsZUJvdW5kYXJ5ICsgJ3B4JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5oaWRlQW5jaG9yUHJldmlldygpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRUb29sYmFyQnV0dG9uU3RhdGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYnV0dG9ucyA9IHRoaXMudG9vbGJhckFjdGlvbnMucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJyksXG4gICAgICAgICAgICAgICAgaTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uc1tpXS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMub3B0aW9ucy5hY3RpdmVCdXR0b25DbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNoZWNrQWN0aXZlQnV0dG9ucygpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hlY2tBY3RpdmVCdXR0b25zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmVsZW1lbnRzKSxcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gdGhpcy5nZXRTZWxlY3RlZFBhcmVudEVsZW1lbnQoKTtcbiAgICAgICAgICAgIHdoaWxlIChwYXJlbnROb2RlLnRhZ05hbWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnBhcmVudEVsZW1lbnRzLmluZGV4T2YocGFyZW50Tm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2YXRlQnV0dG9uKHBhcmVudE5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxFeHRlbnNpb25zKCdjaGVja1N0YXRlJywgcGFyZW50Tm9kZSk7XG5cbiAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gYWJvcnQgdGhlIHNlYXJjaCB1cHdhcmRzIGlmIHdlIGxlYXZlIHRoZSBjb250ZW50RWRpdGFibGUgZWxlbWVudFxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50cy5pbmRleE9mKHBhcmVudE5vZGUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IHBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBhY3RpdmF0ZUJ1dHRvbjogZnVuY3Rpb24gKHRhZykge1xuICAgICAgICAgICAgdmFyIGVsID0gdGhpcy50b29sYmFyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWVsZW1lbnQ9XCInICsgdGFnICsgJ1wiXScpO1xuICAgICAgICAgICAgaWYgKGVsICE9PSBudWxsICYmIGVsLmNsYXNzTmFtZS5pbmRleE9mKHRoaXMub3B0aW9ucy5hY3RpdmVCdXR0b25DbGFzcykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NOYW1lICs9ICcgJyArIHRoaXMub3B0aW9ucy5hY3RpdmVCdXR0b25DbGFzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBiaW5kQnV0dG9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGJ1dHRvbnMgPSB0aGlzLnRvb2xiYXIucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJyksXG4gICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICB0cmlnZ2VyQWN0aW9uID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jaGVja1NlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsYXNzTmFtZS5pbmRleE9mKHNlbGYub3B0aW9ucy5hY3RpdmVCdXR0b25DbGFzcykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKHNlbGYub3B0aW9ucy5hY3RpdmVCdXR0b25DbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSArPSAnICcgKyBzZWxmLm9wdGlvbnMuYWN0aXZlQnV0dG9uQ2xhc3M7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzQXR0cmlidXRlKCdkYXRhLWFjdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmV4ZWNBY3Rpb24odGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0aW9uJyksIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbihidXR0b25zW2ldLCAnY2xpY2snLCB0cmlnZ2VyQWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RBbmRMYXN0SXRlbXMoYnV0dG9ucyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRGaXJzdEFuZExhc3RJdGVtczogZnVuY3Rpb24gKGJ1dHRvbnMpIHtcbiAgICAgICAgICAgIGlmIChidXR0b25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBidXR0b25zWzBdLmNsYXNzTmFtZSArPSAnICcgKyB0aGlzLm9wdGlvbnMuZmlyc3RCdXR0b25DbGFzcztcbiAgICAgICAgICAgICAgICBidXR0b25zW2J1dHRvbnMubGVuZ3RoIC0gMV0uY2xhc3NOYW1lICs9ICcgJyArIHRoaXMub3B0aW9ucy5sYXN0QnV0dG9uQ2xhc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBleGVjQWN0aW9uOiBmdW5jdGlvbiAoYWN0aW9uLCBlKSB7XG4gICAgICAgICAgICBpZiAoYWN0aW9uLmluZGV4T2YoJ2FwcGVuZC0nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGVjRm9ybWF0QmxvY2soYWN0aW9uLnJlcGxhY2UoJ2FwcGVuZC0nLCAnJykpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9vbGJhclBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUb29sYmFyQnV0dG9uU3RhdGVzKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ2FuY2hvcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJBbmNob3JBY3Rpb24oZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ2ltYWdlJykge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRJbWFnZScsIGZhbHNlLCB0aGlzLm9wdGlvbnMuY29udGVudFdpbmRvdy5nZXRTZWxlY3Rpb24oKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LmV4ZWNDb21tYW5kKGFjdGlvbiwgZmFsc2UsIG51bGwpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9vbGJhclBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTg2NzU0Mi9yYW5nZS1vYmplY3QtZ2V0LXNlbGVjdGlvbi1wYXJlbnQtbm9kZS1jaHJvbWUtdnMtZmlyZWZveFxuICAgICAgICByYW5nZVNlbGVjdHNTaW5nbGVOb2RlOiBmdW5jdGlvbiAocmFuZ2UpIHtcbiAgICAgICAgICAgIHZhciBzdGFydE5vZGUgPSByYW5nZS5zdGFydENvbnRhaW5lcjtcbiAgICAgICAgICAgIHJldHVybiBzdGFydE5vZGUgPT09IHJhbmdlLmVuZENvbnRhaW5lciAmJlxuICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZS5oYXNDaGlsZE5vZGVzKCkgJiZcbiAgICAgICAgICAgICAgICByYW5nZS5lbmRPZmZzZXQgPT09IHJhbmdlLnN0YXJ0T2Zmc2V0ICsgMTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTZWxlY3RlZFBhcmVudEVsZW1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZFBhcmVudEVsZW1lbnQgPSBudWxsLFxuICAgICAgICAgICAgICAgIHJhbmdlID0gdGhpcy5zZWxlY3Rpb25SYW5nZTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJhbmdlU2VsZWN0c1NpbmdsZU5vZGUocmFuZ2UpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRQYXJlbnRFbGVtZW50ID0gcmFuZ2Uuc3RhcnRDb250YWluZXIuY2hpbGROb2Rlc1tyYW5nZS5zdGFydE9mZnNldF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJhbmdlLnN0YXJ0Q29udGFpbmVyLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRQYXJlbnRFbGVtZW50ID0gcmFuZ2Uuc3RhcnRDb250YWluZXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRQYXJlbnRFbGVtZW50ID0gcmFuZ2Uuc3RhcnRDb250YWluZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWRQYXJlbnRFbGVtZW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyaWdnZXJBbmNob3JBY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZFBhcmVudEVsZW1lbnQgPSB0aGlzLmdldFNlbGVjdGVkUGFyZW50RWxlbWVudCgpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkUGFyZW50RWxlbWVudC50YWdOYW1lICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUGFyZW50RWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdhJykge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LmV4ZWNDb21tYW5kKCd1bmxpbmsnLCBmYWxzZSwgbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFuY2hvckZvcm0uc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dUb29sYmFyQWN0aW9ucygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0FuY2hvckZvcm0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBleGVjRm9ybWF0QmxvY2s6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbkRhdGEgPSB0aGlzLmdldFNlbGVjdGlvbkRhdGEodGhpcy5zZWxlY3Rpb24uYW5jaG9yTm9kZSk7XG4gICAgICAgICAgICAvLyBGRiBoYW5kbGVzIGJsb2NrcXVvdGUgZGlmZmVyZW50bHkgb24gZm9ybWF0QmxvY2tcbiAgICAgICAgICAgIC8vIGFsbG93aW5nIG5lc3RpbmcsIHdlIG5lZWQgdG8gdXNlIG91dGRlbnRcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvUmljaC1UZXh0X0VkaXRpbmdfaW5fTW96aWxsYVxuICAgICAgICAgICAgaWYgKGVsID09PSAnYmxvY2txdW90ZScgJiYgc2VsZWN0aW9uRGF0YS5lbCAmJlxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbkRhdGEuZWwucGFyZW50Tm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdibG9ja3F1b3RlJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub3duZXJEb2N1bWVudC5leGVjQ29tbWFuZCgnb3V0ZGVudCcsIGZhbHNlLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25EYXRhLnRhZ05hbWUgPT09IGVsKSB7XG4gICAgICAgICAgICAgICAgZWwgPSAncCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBXaGVuIElFIHdlIG5lZWQgdG8gYWRkIDw+IHRvIGhlYWRpbmcgZWxlbWVudHMgYW5kXG4gICAgICAgICAgICAvLyAgYmxvY2txdW90ZSBuZWVkcyB0byBiZSBjYWxsZWQgYXMgaW5kZW50XG4gICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNzQxODMxL2V4ZWNjb21tYW5kLWZvcm1hdGJsb2NrLWhlYWRpbmdzLWluLWllXG4gICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MTYyMjMvcmljaC10ZXh0LWVkaXRvci13aXRoLWJsb2NrcXVvdGUtZnVuY3Rpb24vMTgyMTc3NyMxODIxNzc3XG4gICAgICAgICAgICBpZiAodGhpcy5pc0lFKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsID09PSAnYmxvY2txdW90ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbmRlbnQnLCBmYWxzZSwgZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbCA9ICc8JyArIGVsICsgJz4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JtYXRCbG9jaycsIGZhbHNlLCBlbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U2VsZWN0aW9uRGF0YTogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICB2YXIgdGFnTmFtZTtcblxuICAgICAgICAgICAgaWYgKGVsICYmIGVsLnRhZ05hbWUpIHtcbiAgICAgICAgICAgICAgICB0YWdOYW1lID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAoZWwgJiYgdGhpcy5wYXJlbnRFbGVtZW50cy5pbmRleE9mKHRhZ05hbWUpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBpZiAoZWwgJiYgZWwudGFnTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0YWdOYW1lID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlbDogZWwsXG4gICAgICAgICAgICAgICAgdGFnTmFtZTogdGFnTmFtZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRGaXJzdENoaWxkOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHZhciBmaXJzdENoaWxkID0gZWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHdoaWxlIChmaXJzdENoaWxkICE9PSBudWxsICYmIGZpcnN0Q2hpbGQubm9kZVR5cGUgIT09IDEpIHtcbiAgICAgICAgICAgICAgICBmaXJzdENoaWxkID0gZmlyc3RDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmaXJzdENoaWxkO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhpZGVUb29sYmFyQWN0aW9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5rZWVwVG9vbGJhckFsaXZlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy50b29sYmFyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXIuY2xhc3NMaXN0LnJlbW92ZSgnbWVkaXVtLWVkaXRvci10b29sYmFyLWFjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNob3dUb29sYmFyQWN0aW9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHRpbWVyO1xuICAgICAgICAgICAgdGhpcy5hbmNob3JGb3JtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJBY3Rpb25zLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgdGhpcy5rZWVwVG9vbGJhckFsaXZlID0gZmFsc2U7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi50b29sYmFyICYmICFzZWxmLnRvb2xiYXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdtZWRpdW0tZWRpdG9yLXRvb2xiYXItYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50b29sYmFyLmNsYXNzTGlzdC5hZGQoJ21lZGl1bS1lZGl0b3ItdG9vbGJhci1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNhdmVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zYXZlZFNlbGVjdGlvbiA9IHNhdmVTZWxlY3Rpb24uY2FsbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXN0b3JlU2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJlc3RvcmVTZWxlY3Rpb24uY2FsbCh0aGlzLCB0aGlzLnNhdmVkU2VsZWN0aW9uKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93QW5jaG9yRm9ybTogZnVuY3Rpb24gKGxpbmtfdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudG9vbGJhckFjdGlvbnMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5hbmNob3JGb3JtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgdGhpcy5zZXRUb29sYmFyUG9zaXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMua2VlcFRvb2xiYXJBbGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmFuY2hvcklucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLmFuY2hvcklucHV0LnZhbHVlID0gbGlua192YWx1ZSB8fCAnJztcbiAgICAgICAgfSxcblxuICAgICAgICBiaW5kQW5jaG9yRm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGxpbmtDYW5jZWwgPSB0aGlzLmFuY2hvckZvcm0ucXVlcnlTZWxlY3RvcignYS5tZWRpdW0tZWRpdG9yLXRvb2Jhci1hbmNob3ItY2xvc2UnKSxcbiAgICAgICAgICAgICAgICBsaW5rU2F2ZSA9IHRoaXMuYW5jaG9yRm9ybS5xdWVyeVNlbGVjdG9yKCdhLm1lZGl1bS1lZGl0b3ItdG9vYmFyLWFuY2hvci1zYXZlJyksXG4gICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMub24odGhpcy5hbmNob3JGb3JtLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5rZWVwVG9vbGJhckFsaXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm9uKHRoaXMuYW5jaG9ySW5wdXQsICdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDtcblxuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5hbmNob3JUYXJnZXQgJiYgc2VsZi5hbmNob3JUYXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gXCJfYmxhbmtcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IFwiX3NlbGZcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuYW5jaG9yQnV0dG9uICYmIHNlbGYuYW5jaG9yQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbiA9IHNlbGYub3B0aW9ucy5hbmNob3JCdXR0b25DbGFzcztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3JlYXRlTGluayh0aGlzLCB0YXJnZXQsIGJ1dHRvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub24obGlua1NhdmUsICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0O1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIHNlbGYub3B0aW9ucy5hbmNob3JUYXJnZXQgJiYgc2VsZi5hbmNob3JUYXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBcIl9ibGFua1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gXCJfc2VsZlwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuYW5jaG9yQnV0dG9uICYmIHNlbGYuYW5jaG9yQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uID0gc2VsZi5vcHRpb25zLmFuY2hvckJ1dHRvbkNsYXNzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNlbGYuY3JlYXRlTGluayhzZWxmLmFuY2hvcklucHV0LCB0YXJnZXQsIGJ1dHRvbik7XG4gICAgICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5vbih0aGlzLmFuY2hvcklucHV0LCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBub3QgdG8gaGlkZSBmb3JtIHdoZW4gY2xpa2luZyBpbnRvIHRoZSBpbnB1dFxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5rZWVwVG9vbGJhckFsaXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBhbmNob3IgZm9ybSB3aGVuIGZvY3VzaW5nIG91dHNpZGUgb2YgaXQuXG4gICAgICAgICAgICB0aGlzLm9uKHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LmJvZHksICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSBzZWxmLmFuY2hvckZvcm0gJiYgIWlzRGVzY2VuZGFudChzZWxmLmFuY2hvckZvcm0sIGUudGFyZ2V0KSAmJiAhaXNEZXNjZW5kYW50KHNlbGYudG9vbGJhckFjdGlvbnMsIGUudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmtlZXBUb29sYmFyQWxpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jaGVja1NlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5vbih0aGlzLm9wdGlvbnMub3duZXJEb2N1bWVudC5ib2R5LCAnZm9jdXMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCAhPT0gc2VsZi5hbmNob3JGb3JtICYmICFpc0Rlc2NlbmRhbnQoc2VsZi5hbmNob3JGb3JtLCBlLnRhcmdldCkgJiYgIWlzRGVzY2VuZGFudChzZWxmLnRvb2xiYXJBY3Rpb25zLCBlLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5rZWVwVG9vbGJhckFsaXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5vbihsaW5rQ2FuY2VsLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUb29sYmFyQWN0aW9ucygpO1xuICAgICAgICAgICAgICAgIHJlc3RvcmVTZWxlY3Rpb24uY2FsbChzZWxmLCBzZWxmLnNhdmVkU2VsZWN0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cblxuICAgICAgICBoaWRlQW5jaG9yUHJldmlldzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5hbmNob3JQcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ21lZGl1bS1lZGl0b3ItYW5jaG9yLXByZXZpZXctYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVE9ETzogYnJlYWsgbWV0aG9kXG4gICAgICAgIHNob3dBbmNob3JQcmV2aWV3OiBmdW5jdGlvbiAoYW5jaG9yRWwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFuY2hvclByZXZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdtZWRpdW0tZWRpdG9yLWFuY2hvci1wcmV2aWV3LWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgfHwgYW5jaG9yRWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRpc2FibGUtcHJldmlldycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBidXR0b25IZWlnaHQgPSA0MCxcbiAgICAgICAgICAgICAgICBib3VuZGFyeSA9IGFuY2hvckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgIG1pZGRsZUJvdW5kYXJ5ID0gKGJvdW5kYXJ5LmxlZnQgKyBib3VuZGFyeS5yaWdodCkgLyAyLFxuICAgICAgICAgICAgICAgIGhhbGZPZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICBkZWZhdWx0TGVmdCxcbiAgICAgICAgICAgICAgICB0aW1lcjtcblxuICAgICAgICAgICAgc2VsZi5hbmNob3JQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJ2knKS50ZXh0Q29udGVudCA9IGFuY2hvckVsLmhyZWY7XG4gICAgICAgICAgICBoYWxmT2Zmc2V0V2lkdGggPSBzZWxmLmFuY2hvclByZXZpZXcub2Zmc2V0V2lkdGggLyAyO1xuICAgICAgICAgICAgZGVmYXVsdExlZnQgPSBzZWxmLm9wdGlvbnMuZGlmZkxlZnQgLSBoYWxmT2Zmc2V0V2lkdGg7XG5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmFuY2hvclByZXZpZXcgJiYgIXNlbGYuYW5jaG9yUHJldmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ21lZGl1bS1lZGl0b3ItYW5jaG9yLXByZXZpZXctYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbmNob3JQcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ21lZGl1bS1lZGl0b3ItYW5jaG9yLXByZXZpZXctYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICAgICAgc2VsZi5vYnNlcnZlQW5jaG9yUHJldmlldyhhbmNob3JFbCk7XG5cbiAgICAgICAgICAgIHNlbGYuYW5jaG9yUHJldmlldy5jbGFzc0xpc3QuYWRkKCdtZWRpdW0tdG9vbGJhci1hcnJvdy1vdmVyJyk7XG4gICAgICAgICAgICBzZWxmLmFuY2hvclByZXZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnbWVkaXVtLXRvb2xiYXItYXJyb3ctdW5kZXInKTtcbiAgICAgICAgICAgIHNlbGYuYW5jaG9yUHJldmlldy5zdHlsZS50b3AgPSBNYXRoLnJvdW5kKGJ1dHRvbkhlaWdodCArIGJvdW5kYXJ5LmJvdHRvbSAtIHNlbGYub3B0aW9ucy5kaWZmVG9wICsgdGhpcy5vcHRpb25zLmNvbnRlbnRXaW5kb3cucGFnZVlPZmZzZXQgLSBzZWxmLmFuY2hvclByZXZpZXcub2Zmc2V0SGVpZ2h0KSArICdweCc7XG4gICAgICAgICAgICBpZiAobWlkZGxlQm91bmRhcnkgPCBoYWxmT2Zmc2V0V2lkdGgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFuY2hvclByZXZpZXcuc3R5bGUubGVmdCA9IGRlZmF1bHRMZWZ0ICsgaGFsZk9mZnNldFdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKHRoaXMub3B0aW9ucy5jb250ZW50V2luZG93LmlubmVyV2lkdGggLSBtaWRkbGVCb3VuZGFyeSkgPCBoYWxmT2Zmc2V0V2lkdGgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFuY2hvclByZXZpZXcuc3R5bGUubGVmdCA9IHRoaXMub3B0aW9ucy5jb250ZW50V2luZG93LmlubmVyV2lkdGggKyBkZWZhdWx0TGVmdCAtIGhhbGZPZmZzZXRXaWR0aCArICdweCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuYW5jaG9yUHJldmlldy5zdHlsZS5sZWZ0ID0gZGVmYXVsdExlZnQgKyBtaWRkbGVCb3VuZGFyeSArICdweCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRPRE86IGJyZWFrIG1ldGhvZFxuICAgICAgICBvYnNlcnZlQW5jaG9yUHJldmlldzogZnVuY3Rpb24gKGFuY2hvckVsKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgbGFzdE92ZXIgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgIG92ZXIgPSB0cnVlLFxuICAgICAgICAgICAgICAgIHN0YW1wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0T3ZlciA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIG92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdW5zdGFtcCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZS5yZWxhdGVkVGFyZ2V0IHx8ICEvYW5jaG9yLXByZXZpZXcvLnRlc3QoZS5yZWxhdGVkVGFyZ2V0LmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWxfdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgZHVyciA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLSBsYXN0T3ZlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGR1cnIgPiBzZWxmLm9wdGlvbnMuYW5jaG9yUHJldmlld0hpZGVEZWxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGlkZSB0aGUgcHJldmlldyAxLzIgc2Vjb25kIGFmdGVyIG1vdXNlIGxlYXZlcyB0aGUgbGlua1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlQW5jaG9yUHJldmlldygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjbGVhbnVwXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsX3RpbWVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub2ZmKHNlbGYuYW5jaG9yUHJldmlldywgJ21vdXNlb3ZlcicsIHN0YW1wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub2ZmKHNlbGYuYW5jaG9yUHJldmlldywgJ21vdXNlb3V0JywgdW5zdGFtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9mZihhbmNob3JFbCwgJ21vdXNlb3ZlcicsIHN0YW1wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub2ZmKGFuY2hvckVsLCAnbW91c2VvdXQnLCB1bnN0YW1wKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcblxuICAgICAgICAgICAgdGhpcy5vbihzZWxmLmFuY2hvclByZXZpZXcsICdtb3VzZW92ZXInLCBzdGFtcCk7XG4gICAgICAgICAgICB0aGlzLm9uKHNlbGYuYW5jaG9yUHJldmlldywgJ21vdXNlb3V0JywgdW5zdGFtcCk7XG4gICAgICAgICAgICB0aGlzLm9uKGFuY2hvckVsLCAnbW91c2VvdmVyJywgc3RhbXApO1xuICAgICAgICAgICAgdGhpcy5vbihhbmNob3JFbCwgJ21vdXNlb3V0JywgdW5zdGFtcCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlQW5jaG9yUHJldmlldzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGFuY2hvclByZXZpZXcgPSB0aGlzLm9wdGlvbnMub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgICAgYW5jaG9yUHJldmlldy5pZCA9ICdtZWRpdW0tZWRpdG9yLWFuY2hvci1wcmV2aWV3LScgKyB0aGlzLmlkO1xuICAgICAgICAgICAgYW5jaG9yUHJldmlldy5jbGFzc05hbWUgPSAnbWVkaXVtLWVkaXRvci1hbmNob3ItcHJldmlldyc7XG4gICAgICAgICAgICBhbmNob3JQcmV2aWV3LmlubmVySFRNTCA9IHRoaXMuYW5jaG9yUHJldmlld1RlbXBsYXRlKCk7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudHNDb250YWluZXIuYXBwZW5kQ2hpbGQoYW5jaG9yUHJldmlldyk7XG5cbiAgICAgICAgICAgIHRoaXMub24oYW5jaG9yUHJldmlldywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYW5jaG9yUHJldmlld0NsaWNrSGFuZGxlcigpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBhbmNob3JQcmV2aWV3O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFuY2hvclByZXZpZXdUZW1wbGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwibWVkaXVtLWVkaXRvci10b29sYmFyLWFuY2hvci1wcmV2aWV3XCIgaWQ9XCJtZWRpdW0tZWRpdG9yLXRvb2xiYXItYW5jaG9yLXByZXZpZXdcIj4nICtcbiAgICAgICAgICAgICAgICAnICAgIDxpIGNsYXNzPVwibWVkaXVtLWVkaXRvci10b29sYmFyLWFuY2hvci1wcmV2aWV3LWlubmVyXCI+PC9pPicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFuY2hvclByZXZpZXdDbGlja0hhbmRsZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVBbmNob3IpIHtcblxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLm9wdGlvbnMub3duZXJEb2N1bWVudC5jcmVhdGVSYW5nZSgpLFxuICAgICAgICAgICAgICAgICAgICBzZWwgPSB0aGlzLm9wdGlvbnMuY29udGVudFdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcblxuICAgICAgICAgICAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhzZWxmLmFjdGl2ZUFuY2hvcik7XG4gICAgICAgICAgICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAgICAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmFjdGl2ZUFuY2hvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93QW5jaG9yRm9ybShzZWxmLmFjdGl2ZUFuY2hvci5ocmVmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmtlZXBUb29sYmFyQWxpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LCAxMDAgKyBzZWxmLm9wdGlvbnMuZGVsYXkpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZUFuY2hvclByZXZpZXcoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBlZGl0b3JBbmNob3JPYnNlcnZlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBvdmVyQW5jaG9yID0gdHJ1ZSxcbiAgICAgICAgICAgICAgICBsZWF2ZUFuY2hvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFyayB0aGUgYW5jaG9yIGFzIG5vIGxvbmdlciBob3ZlcmVkLCBhbmQgc3RvcCBsaXN0ZW5pbmdcbiAgICAgICAgICAgICAgICAgICAgb3ZlckFuY2hvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9mZihzZWxmLmFjdGl2ZUFuY2hvciwgJ21vdXNlb3V0JywgbGVhdmVBbmNob3IpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAmJiBlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdhJykge1xuXG4gICAgICAgICAgICAgICAgLy8gRGV0ZWN0IGVtcHR5IGhyZWYgYXR0cmlidXRlc1xuICAgICAgICAgICAgICAgIC8vIFRoZSBicm93c2VyIHdpbGwgbWFrZSBocmVmPVwiXCIgb3IgaHJlZj1cIiN0b3BcIlxuICAgICAgICAgICAgICAgIC8vIGludG8gYWJzb2x1dGUgdXJscyB3aGVuIGFjY2Vzc2VkIGFzIGUudGFyZ2VkLmhyZWYsIHNvIGNoZWNrIHRoZSBodG1sXG4gICAgICAgICAgICAgICAgaWYgKCEvaHJlZj1bXCInXVxcUytbXCInXS8udGVzdChlLnRhcmdldC5vdXRlckhUTUwpIHx8IC9ocmVmPVtcIiddI1xcUytbXCInXS8udGVzdChlLnRhcmdldC5vdXRlckhUTUwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIG9ubHkgc2hvdyB3aGVuIGhvdmVyaW5nIG9uIGFuY2hvcnNcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b29sYmFyLmNsYXNzTGlzdC5jb250YWlucygnbWVkaXVtLWVkaXRvci10b29sYmFyLWFjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgc2hvdyB3aGVuIHRvb2xiYXIgaXMgbm90IHByZXNlbnRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlQW5jaG9yID0gZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmFjdGl2ZUFuY2hvciwgJ21vdXNlb3V0JywgbGVhdmVBbmNob3IpO1xuICAgICAgICAgICAgICAgIC8vIHNob3cgdGhlIGFuY2hvciBwcmV2aWV3IGFjY29yZGluZyB0byB0aGUgY29uZmlndXJlZCBkZWxheVxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBtb3VzZSBoYXMgbm90IGxlZnQgdGhlIGFuY2hvciB0YWcgaW4gdGhhdCB0aW1lXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVyQW5jaG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNob3dBbmNob3JQcmV2aWV3KGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheSk7XG5cblxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGJpbmRBbmNob3JQcmV2aWV3OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBpLCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yQW5jaG9yT2JzZXJ2ZXJXcmFwcGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVkaXRvckFuY2hvck9ic2VydmVyKGUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmVsZW1lbnRzW2ldLCAnbW91c2VvdmVyJywgdGhpcy5lZGl0b3JBbmNob3JPYnNlcnZlcldyYXBwZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hlY2tMaW5rRm9ybWF0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciByZSA9IC9eKGh0dHBzP3xmdHBzP3xydG1wdD8pOlxcL1xcL3xtYWlsdG86LztcbiAgICAgICAgICAgIHJldHVybiAocmUudGVzdCh2YWx1ZSkgPyAnJyA6ICdodHRwOi8vJykgKyB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRUYXJnZXRCbGFuazogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIGVsID0gZWwgfHwgZ2V0U2VsZWN0aW9uU3RhcnQuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdhJykge1xuICAgICAgICAgICAgICAgIGVsLnRhcmdldCA9ICdfYmxhbmsnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbCA9IGVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJyk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZWwubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxbaV0udGFyZ2V0ID0gJ19ibGFuayc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldEJ1dHRvbkNsYXNzOiBmdW5jdGlvbiAoYnV0dG9uQ2xhc3MpIHtcbiAgICAgICAgICAgIHZhciBlbCA9IGdldFNlbGVjdGlvblN0YXJ0LmNhbGwodGhpcyksXG4gICAgICAgICAgICAgICAgY2xhc3NlcyA9IGJ1dHRvbkNsYXNzLnNwbGl0KCcgJyksXG4gICAgICAgICAgICAgICAgaSwgajtcbiAgICAgICAgICAgIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdhJykge1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjbGFzc2VzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3Nlc1tqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbCA9IGVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJyk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGVsLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjbGFzc2VzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbFtpXS5jbGFzc0xpc3QuYWRkKGNsYXNzZXNbal0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZUxpbms6IGZ1bmN0aW9uIChpbnB1dCwgdGFyZ2V0LCBidXR0b25DbGFzcykge1xuICAgICAgICAgICAgdmFyIGksIGV2ZW50O1xuXG4gICAgICAgICAgICBpZiAoaW5wdXQudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVRvb2xiYXJBY3Rpb25zKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN0b3JlU2VsZWN0aW9uLmNhbGwodGhpcywgdGhpcy5zYXZlZFNlbGVjdGlvbik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2hlY2tMaW5rRm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLmNoZWNrTGlua0Zvcm1hdChpbnB1dC52YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LmV4ZWNDb21tYW5kKCdjcmVhdGVMaW5rJywgZmFsc2UsIGlucHV0LnZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50YXJnZXRCbGFuayB8fCB0YXJnZXQgPT09IFwiX2JsYW5rXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRhcmdldEJsYW5rKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChidXR0b25DbGFzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QnV0dG9uQ2xhc3MoYnV0dG9uQ2xhc3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRhcmdldEJsYW5rIHx8IHRhcmdldCA9PT0gXCJfYmxhbmtcIiB8fCBidXR0b25DbGFzcykge1xuICAgICAgICAgICAgICAgIGV2ZW50ID0gdGhpcy5vcHRpb25zLm93bmVyRG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJIVE1MRXZlbnRzXCIpO1xuICAgICAgICAgICAgICAgIGV2ZW50LmluaXRFdmVudChcImlucHV0XCIsIHRydWUsIHRydWUsIHRoaXMub3B0aW9ucy5jb250ZW50V2luZG93KTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzW2ldLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jaGVja1NlbGVjdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5zaG93VG9vbGJhckFjdGlvbnMoKTtcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYmluZFdpbmRvd0FjdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0aW1lclJlc2l6ZSxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXJSZXNpemUpO1xuICAgICAgICAgICAgICAgIHRpbWVyUmVzaXplID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnRvb2xiYXIgJiYgc2VsZi50b29sYmFyLmNsYXNzTGlzdC5jb250YWlucygnbWVkaXVtLWVkaXRvci10b29sYmFyLWFjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNldFRvb2xiYXJQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm9uKHRoaXMub3B0aW9ucy5jb250ZW50V2luZG93LCAncmVzaXplJywgdGhpcy53aW5kb3dSZXNpemVIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFjdGl2YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXR1cCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRPRE86IGJyZWFrIG1ldGhvZFxuICAgICAgICBkZWFjdGl2YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudG9vbGJhciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnRzQ29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMuYW5jaG9yUHJldmlldyk7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnRzQ29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMudG9vbGJhcik7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudG9vbGJhcjtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5hbmNob3JQcmV2aWV3O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHNbaV0ucmVtb3ZlQXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzW2ldLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1tZWRpdW0tZWxlbWVudCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbEV2ZW50cygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGh0bWxFbnRpdGllczogZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgLy8gY29udmVydHMgc3BlY2lhbCBjaGFyYWN0ZXJzIChsaWtlIDwpIGludG8gdGhlaXIgZXNjYXBlZC9lbmNvZGVkIHZhbHVlcyAobGlrZSAmbHQ7KS5cbiAgICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIHlvdSB0byBzaG93IHRvIGRpc3BsYXkgdGhlIHN0cmluZyB3aXRob3V0IHRoZSBicm93c2VyIHJlYWRpbmcgaXQgYXMgSFRNTC5cbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKC8mL2csICcmYW1wOycpLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7JykucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGJpbmRQYXN0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGksIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wYXN0ZVdyYXBwZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJhZ3JhcGhzLFxuICAgICAgICAgICAgICAgICAgICBodG1sID0gJycsXG4gICAgICAgICAgICAgICAgICAgIHA7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ21lZGl1bS1lZGl0b3ItcGxhY2Vob2xkZXInKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYub3B0aW9ucy5mb3JjZVBsYWluVGV4dCAmJiAhc2VsZi5vcHRpb25zLmNsZWFuUGFzdGVkSFRNTCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZS5jbGlwYm9hcmREYXRhICYmIGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhICYmICFlLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuY2xlYW5QYXN0ZWRIVE1MICYmIGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L2h0bWwnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2xlYW5QYXN0ZShlLmNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dC9odG1sJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHNlbGYub3B0aW9ucy5kaXNhYmxlUmV0dXJuIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWRpc2FibGUtcmV0dXJuJykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhZ3JhcGhzID0gZS5jbGlwYm9hcmREYXRhLmdldERhdGEoJ3RleHQvcGxhaW4nKS5zcGxpdCgvW1xcclxcbl0vZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHAgPSAwOyBwIDwgcGFyYWdyYXBocy5sZW5ndGg7IHAgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhZ3JhcGhzW3BdICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvZmlyZWZveC9pKSAmJiBwID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IHNlbGYuaHRtbEVudGl0aWVzKHBhcmFncmFwaHNbcF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnPHA+JyArIHNlbGYuaHRtbEVudGl0aWVzKHBhcmFncmFwaHNbcF0pICsgJzwvcD4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLm93bmVyRG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEhUTUwnLCBmYWxzZSwgaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sID0gc2VsZi5odG1sRW50aXRpZXMoZS5jbGlwYm9hcmREYXRhLmdldERhdGEoJ3RleHQvcGxhaW4nKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMub3duZXJEb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0SFRNTCcsIGZhbHNlLCBodG1sKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5lbGVtZW50c1tpXSwgJ3Bhc3RlJywgdGhpcy5wYXN0ZVdyYXBwZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UGxhY2Vob2xkZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGVsLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICEoZWwucXVlcnlTZWxlY3RvcignYmxvY2txdW90ZScpKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLnRleHRDb250ZW50LnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ21lZGl1bS1lZGl0b3ItcGxhY2Vob2xkZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJXcmFwcGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdtZWRpdW0tZWRpdG9yLXBsYWNlaG9sZGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnR5cGUgIT09ICdrZXlwcmVzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2YXRlUGxhY2Vob2xkZXIodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZVBsYWNlaG9sZGVyKHRoaXMuZWxlbWVudHNbaV0pO1xuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5lbGVtZW50c1tpXSwgJ2JsdXInLCBwbGFjZWhvbGRlcldyYXBwZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5lbGVtZW50c1tpXSwgJ2tleXByZXNzJywgcGxhY2Vob2xkZXJXcmFwcGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFuUGFzdGU6IGZ1bmN0aW9uICh0ZXh0KSB7XG5cbiAgICAgICAgICAgIC8qanNsaW50IHJlZ2V4cDogdHJ1ZSovXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIGpzbGludCBkb2VzIG5vdCBhbGxvdyBjaGFyYWN0ZXIgbmVnYXRpb24sIGJlY2F1c2UgdGhlIG5lZ2F0aW9uXG4gICAgICAgICAgICAgICAgd2lsbCBub3QgbWF0Y2ggYW55IHVuaWNvZGUgY2hhcmFjdGVycy4gSW4gdGhlIHJlZ2V4ZXMgaW4gdGhpc1xuICAgICAgICAgICAgICAgIGJsb2NrLCBuZWdhdGlvbiBpcyB1c2VkIHNwZWNpZmljYWxseSB0byBtYXRjaCB0aGUgZW5kIG9mIGFuIGh0bWxcbiAgICAgICAgICAgICAgICB0YWcsIGFuZCBpbiBmYWN0IHVuaWNvZGUgY2hhcmFjdGVycyAqc2hvdWxkKiBiZSBhbGxvd2VkLlxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBpLCBlbExpc3QsIHdvcmtFbCxcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMuZ2V0U2VsZWN0aW9uRWxlbWVudCgpLFxuICAgICAgICAgICAgICAgIG11bHRpbGluZSA9IC88cHw8YnJ8PGRpdi8udGVzdCh0ZXh0KSxcbiAgICAgICAgICAgICAgICByZXBsYWNlbWVudHMgPSBbXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSB0d28gYm9ndXMgdGFncyB0aGF0IGJlZ2luIHBhc3RlcyBmcm9tIGdvb2dsZSBkb2NzXG4gICAgICAgICAgICAgICAgICAgIFtuZXcgUmVnRXhwKC88W14+XSpkb2NzLWludGVybmFsLWd1aWRbXj5dKj4vZ2kpLCBcIlwiXSxcbiAgICAgICAgICAgICAgICAgICAgW25ldyBSZWdFeHAoLzxcXC9iPig8YnJbXj5dKj4pPyQvZ2kpLCBcIlwiXSxcblxuICAgICAgICAgICAgICAgICAgICAgLy8gdW4taHRtbCBzcGFjZXMgYW5kIG5ld2xpbmVzIGluc2VydGVkIGJ5IE9TIFhcbiAgICAgICAgICAgICAgICAgICAgW25ldyBSZWdFeHAoLzxzcGFuIGNsYXNzPVwiQXBwbGUtY29udmVydGVkLXNwYWNlXCI+XFxzKzxcXC9zcGFuPi9nKSwgJyAnXSxcbiAgICAgICAgICAgICAgICAgICAgW25ldyBSZWdFeHAoLzxiciBjbGFzcz1cIkFwcGxlLWludGVyY2hhbmdlLW5ld2xpbmVcIj4vZyksICc8YnI+J10sXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBnb29nbGUgZG9jcyBpdGFsaWNzK2JvbGQgd2l0aCBhIHNwYW4gdG8gYmUgcmVwbGFjZWQgb25jZSB0aGUgaHRtbCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgICAgICAgICBbbmV3IFJlZ0V4cCgvPHNwYW5bXj5dKihmb250LXN0eWxlOml0YWxpYztmb250LXdlaWdodDpib2xkfGZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zdHlsZTppdGFsaWMpW14+XSo+L2dpKSwgJzxzcGFuIGNsYXNzPVwicmVwbGFjZS13aXRoIGl0YWxpYyBib2xkXCI+J10sXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBnb29nbGUgZG9jcyBpdGFsaWNzIHdpdGggYSBzcGFuIHRvIGJlIHJlcGxhY2VkIG9uY2UgdGhlIGh0bWwgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgICAgICAgICAgW25ldyBSZWdFeHAoLzxzcGFuW14+XSpmb250LXN0eWxlOml0YWxpY1tePl0qPi9naSksICc8c3BhbiBjbGFzcz1cInJlcGxhY2Utd2l0aCBpdGFsaWNcIj4nXSxcblxuICAgICAgICAgICAgICAgICAgICAvL1tyZXBsYWNlIGdvb2dsZSBkb2NzIGJvbGRzIHdpdGggYSBzcGFuIHRvIGJlIHJlcGxhY2VkIG9uY2UgdGhlIGh0bWwgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgICAgICAgICAgW25ldyBSZWdFeHAoLzxzcGFuW14+XSpmb250LXdlaWdodDpib2xkW14+XSo+L2dpKSwgJzxzcGFuIGNsYXNzPVwicmVwbGFjZS13aXRoIGJvbGRcIj4nXSxcblxuICAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBtYW51YWxseSBlbnRlcmVkIGIvaS9hIHRhZ3Mgd2l0aCByZWFsIG9uZXNcbiAgICAgICAgICAgICAgICAgICAgW25ldyBSZWdFeHAoLyZsdDsoXFwvPykoaXxifGEpJmd0Oy9naSksICc8JDEkMj4nXSxcblxuICAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBtYW51YWxseSBhIHRhZ3Mgd2l0aCByZWFsIG9uZXMsIGNvbnZlcnRpbmcgc21hcnQtcXVvdGVzIGZyb20gZ29vZ2xlIGRvY3NcbiAgICAgICAgICAgICAgICAgICAgW25ldyBSZWdFeHAoLyZsdDthXFxzK2hyZWY9KCZxdW90O3wmcmRxdW87fCZsZHF1bzt84oCcfOKAnSkoW14mXSspKCZxdW90O3wmcmRxdW87fCZsZHF1bzt84oCcfOKAnSkmZ3Q7L2dpKSwgJzxhIGhyZWY9XCIkMlwiPiddXG5cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgLypqc2xpbnQgcmVnZXhwOiBmYWxzZSovXG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCByZXBsYWNlbWVudHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKHJlcGxhY2VtZW50c1tpXVswXSwgcmVwbGFjZW1lbnRzW2ldWzFdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG11bHRpbGluZSkge1xuXG4gICAgICAgICAgICAgICAgLy8gZG91YmxlIGJyJ3MgYXJlbid0IGNvbnZlcnRlZCB0byBwIHRhZ3MsIGJ1dCB3ZSB3YW50IHBhcmFncmFwaHMuXG4gICAgICAgICAgICAgICAgZWxMaXN0ID0gdGV4dC5zcGxpdCgnPGJyPjxicj4nKTtcblxuICAgICAgICAgICAgICAgIHRoaXMucGFzdGVIVE1MKCc8cD4nICsgZWxMaXN0LmpvaW4oJzwvcD48cD4nKSArICc8L3A+Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm93bmVyRG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgXCJcXG5cIik7XG5cbiAgICAgICAgICAgICAgICAvLyBibG9jayBlbGVtZW50IGNsZWFudXBcbiAgICAgICAgICAgICAgICBlbExpc3QgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKCdhLHAsZGl2LGJyJyk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGVsTGlzdC5sZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHdvcmtFbCA9IGVsTGlzdFtpXTtcblxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHdvcmtFbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRhcmdldEJsYW5rKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUYXJnZXRCbGFuayh3b3JrRWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3AnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdkaXYnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJDb21tb25CbG9ja3Mod29ya0VsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdicic6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckxpbmVCcmVhayh3b3JrRWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wYXN0ZUhUTUwodGV4dCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIHBhc3RlSFRNTDogZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgICAgICAgIHZhciBlbExpc3QsIHdvcmtFbCwgaSwgZnJhZ21lbnRCb2R5LCBwYXN0ZUJsb2NrID0gdGhpcy5vcHRpb25zLm93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICAgICAgICBwYXN0ZUJsb2NrLmFwcGVuZENoaWxkKHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JvZHknKSk7XG5cbiAgICAgICAgICAgIGZyYWdtZW50Qm9keSA9IHBhc3RlQmxvY2sucXVlcnlTZWxlY3RvcignYm9keScpO1xuICAgICAgICAgICAgZnJhZ21lbnRCb2R5LmlubmVySFRNTCA9IGh0bWw7XG5cbiAgICAgICAgICAgIHRoaXMuY2xlYW51cFNwYW5zKGZyYWdtZW50Qm9keSk7XG5cbiAgICAgICAgICAgIGVsTGlzdCA9IGZyYWdtZW50Qm9keS5xdWVyeVNlbGVjdG9yQWxsKCcqJyk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZWxMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgICAgICAgICB3b3JrRWwgPSBlbExpc3RbaV07XG5cbiAgICAgICAgICAgICAgICAvLyBkZWxldGUgdWdseSBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgd29ya0VsLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgICAgICB3b3JrRWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgIHdvcmtFbC5yZW1vdmVBdHRyaWJ1dGUoJ2RpcicpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHdvcmtFbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdtZXRhJykge1xuICAgICAgICAgICAgICAgICAgICB3b3JrRWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh3b3JrRWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLm93bmVyRG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEhUTUwnLCBmYWxzZSwgZnJhZ21lbnRCb2R5LmlubmVySFRNTC5yZXBsYWNlKC8mbmJzcDsvZywgJyAnKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ29tbW9uQmxvY2s6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIChlbCAmJiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAncCcgfHwgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZGl2JykpO1xuICAgICAgICB9LFxuICAgICAgICBmaWx0ZXJDb21tb25CbG9ja3M6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgaWYgKC9eXFxzKiQvLnRlc3QoZWwuaW5uZXJUZXh0KSkge1xuICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmaWx0ZXJMaW5lQnJlYWs6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21tb25CbG9jayhlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSkge1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHN0cmF5IGJyJ3MgZm9sbG93aW5nIGNvbW1vbiBibG9jayBlbGVtZW50c1xuICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNDb21tb25CbG9jayhlbC5wYXJlbnROb2RlKSAmJiAoZWwucGFyZW50Tm9kZS5maXJzdENoaWxkID09PSBlbCB8fCBlbC5wYXJlbnROb2RlLmxhc3RDaGlsZCA9PT0gZWwpKSB7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgYnIncyBqdXN0IGluc2lkZSBvcGVuIG9yIGNsb3NlIHRhZ3Mgb2YgYSBkaXYvcFxuICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsLnBhcmVudE5vZGUuY2hpbGRFbGVtZW50Q291bnQgPT09IDEpIHtcblxuICAgICAgICAgICAgICAgIC8vIGFuZCBicidzIHRoYXQgYXJlIHRoZSBvbmx5IGNoaWxkIG9mIGEgZGl2L3BcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVdpdGhQYXJlbnQoZWwpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvLyByZW1vdmUgYW4gZWxlbWVudCwgaW5jbHVkaW5nIGl0cyBwYXJlbnQsIGlmIGl0IGlzIHRoZSBvbmx5IGVsZW1lbnQgd2l0aGluIGl0cyBwYXJlbnRcbiAgICAgICAgcmVtb3ZlV2l0aFBhcmVudDogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBpZiAoZWwgJiYgZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlLnBhcmVudE5vZGUgJiYgZWwucGFyZW50Tm9kZS5jaGlsZEVsZW1lbnRDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBlbC5wYXJlbnROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbC5wYXJlbnROb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlYW51cFNwYW5zOiBmdW5jdGlvbiAoY29udGFpbmVyX2VsKSB7XG5cbiAgICAgICAgICAgIHZhciBpLFxuICAgICAgICAgICAgICAgIGVsLFxuICAgICAgICAgICAgICAgIG5ld19lbCxcbiAgICAgICAgICAgICAgICBzcGFucyA9IGNvbnRhaW5lcl9lbC5xdWVyeVNlbGVjdG9yQWxsKCcucmVwbGFjZS13aXRoJyk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICAgICAgICAgICAgZWwgPSBzcGFuc1tpXTtcbiAgICAgICAgICAgICAgICBuZXdfZWwgPSB0aGlzLm9wdGlvbnMub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsLmNsYXNzTGlzdC5jb250YWlucygnYm9sZCcpID8gJ2InIDogJ2knKTtcblxuICAgICAgICAgICAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2JvbGQnKSAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2l0YWxpYycpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGFuIGkgdGFnIGFzIHdlbGwgaWYgdGhpcyBoYXMgYm90aCBpdGFsaWNzIGFuZCBib2xkXG4gICAgICAgICAgICAgICAgICAgIG5ld19lbC5pbm5lckhUTUwgPSAnPGk+JyArIGVsLmlubmVySFRNTCArICc8L2k+JztcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbmV3X2VsLmlubmVySFRNTCA9IGVsLmlubmVySFRNTDtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdfZWwsIGVsKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzcGFucyA9IGNvbnRhaW5lcl9lbC5xdWVyeVNlbGVjdG9yQWxsKCdzcGFuJyk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpICs9IDEpIHtcblxuICAgICAgICAgICAgICAgIGVsID0gc3BhbnNbaV07XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgZW1wdHkgc3BhbnMsIHJlcGxhY2Ugb3RoZXJzIHdpdGggdGhlaXIgY29udGVudHNcbiAgICAgICAgICAgICAgICBpZiAoL15cXHMqJC8udGVzdCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHRoaXMub3B0aW9ucy5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVsLmlubmVyVGV4dCksIGVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KHdpbmRvdywgZG9jdW1lbnQpKTtcbiJdfQ==