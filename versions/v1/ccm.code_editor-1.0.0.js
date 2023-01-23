'use strict';

/**
 * @overview <i>ccmjs</i>-based web component for a code editor that uses CodeMirrow 5.
 * @author André Kless <andre.kless@web.de> 2023
 * @license The MIT License (MIT)
 * @version 1.0.0
 */

( () => {
  const component = {
    name: 'code_editor',
    version: [ 1, 0, 0 ],
    ccm: 'https://ccmjs.github.io/ccm/versions/ccm-27.4.2.min.js',
    config: {
      "css": [ "ccm.load",
        [
          [
            "https://ccmjs.github.io/libs/codemirror-5/codemirror.min.css",
            "https://ccmjs.github.io/libs/codemirror-5/foldgutter.min.css"
          ],
          "https://ccmjs.github.io/code_editor/versions/v1/resources/styles.min.css"
        ]
      ],
      "data": {},
      // "directly": true,
      "helper": [ "ccm.load", "https://ccmjs.github.io/ccm/helper/helper-8.4.2.min.mjs" ],
      "html": [ "ccm.load", "https://ccmjs.github.io/code_editor/versions/v1/resources/templates.min.mjs" ],
      "libs": [ "ccm.load",
        [
          "https://ccmjs.github.io/libs/codemirror-5/codemirror.min.js",
          [
            "https://ccmjs.github.io/libs/codemirror-5/autorefresh.min.js",
            "https://ccmjs.github.io/libs/codemirror-5/brace-fold.min.js",
            "https://ccmjs.github.io/libs/codemirror-5/closebrackets.min.js",
            "https://ccmjs.github.io/libs/codemirror-5/foldcode.min.js",
            "https://ccmjs.github.io/libs/codemirror-5/foldgutter.min.js",
            "https://ccmjs.github.io/libs/codemirror-5/matchbrackets.min.js"
          ]
        ]
      ],
      "onfinish": { "log": true },
      // "oninput": event => console.log( event ),
      // "onready": event => console.log( event ),
      // "onstart": event => console.log( event ),
      "settings": {
        "autoRefresh": true,
        "autoCloseBrackets": true,
        "autofocus": false,
        "foldGutter": true,
        "gutters": [ "CodeMirror-linenumbers", "CodeMirror-foldgutter" ],
        "lineNumbers": true,
        "lineWrapping": true,
        "matchBrackets": true,
        "tabSize": 2
      },
      "shadow": "open",
      "submit": true,
      "text": [ "ccm.load", "https://ccmjs.github.io/code_editor/versions/v1/resources/resources.min.mjs#en" ]
    },
    Instance: function () {
      let $, data, editor;
      this.init = async () => {
        $ = Object.assign( {}, this.ccm.helper, this.helper ); $.use( this.ccm );
      };
      this.ready = async () => {
        this.onready && await this.onready( { instance: this } );
      };
      this.start = async () => {
        data = await $.dataset( this.data );
        if ( this.settings.mode?.json && !data.input )
          data = { input: JSON.stringify( data.input, null, this.settings.tabSize ) };
        this.html.render( this.html.main( this ), this.element );
        this.element.querySelector( 'textarea' ).innerHTML = data.input || '';
        $.remove( this.element.querySelector( '.CodeMirror' ) );
        editor = CodeMirror.fromTextArea( this.element.querySelector( 'textarea' ), this.settings );
        editor.setCursor( editor.lineCount(), 0 );
        editor.on( 'change', this.events.onInput );
        this.onstart && await this.onstart( { instance: this, editor } );
      };
      this.events = {
        onInput: () => {
          const value = editor.getValue();
          if ( this.settings.mode?.json ) {
            let valid;
            try {
              $.parse( value );
              valid = true;
              data.input = value;
            } catch ( e ) {}
            this.element.querySelector( 'button' ).disabled = !valid;
            this.element.querySelector( '.CodeMirror' ).classList[ valid ? 'remove' : 'add' ]( 'invalid' );
          }
          else
            data.input = value;
          this.oninput && this.oninput( { instance: this, editor } );
        },
        onSubmit: () => {
          $.onFinish( this );
        }
      };
      this.getValue = () => {
        let value = data.input || '';
        if ( this.directly ) {
          switch ( this.settings.mode ) {
            case 'htmlmixed':
              value = document.createRange().createContextualFragment( data.input );
              break;
            case 'css':
              value = $.html( { tag: 'style', inner: data.input } );
              break;
            case 'javascript':
              value = eval( data.input );
              break;
            default:
              if ( this.settings.mode?.json )
                value = $.parse( data.input );
          }
        }
        return value;
      }
    }
  };
  let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||[""])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){(c="latest"?window.ccm:window.ccm[c]).component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();