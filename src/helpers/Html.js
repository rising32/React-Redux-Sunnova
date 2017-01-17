import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object
  };

  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();

    return (
      <html lang="en-us">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <link rel="shortcut icon" href="/favicon.png" />
          <link rel="apple-touch-icon" href="/apple_icon.png"/>
          <link href="https://fonts.googleapis.com/css?family=Lato:900,700,400,300" rel="stylesheet" type="text/css"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, key) =>
            <link
              href={assets.styles[style]} key={key} media="screen, projection"
              rel="stylesheet" type="text/css" charSet="UTF-8" />
          )}

          <script src="/vendor/formatter.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js"></script>
          <script src="https://d3js.org/d3.v3.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js"></script>

          {/* (will be present only in development mode) */}
          {Object.keys(assets.styles).length === 0 ?
            <style dangerouslySetInnerHTML={{ __html: '#content{display:none}' }} /> : null}
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{ __html: content }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }}
            charSet="UTF-8"
          />
          {__DLLS__ && <script key="dlls__vendor" src="/dist/dlls/dll__vendor.js" charSet="UTF-8" />}
          <script src={assets.javascript.main} charSet="UTF-8" />

          {/* (will be present only in development mode) */}
          {Object.keys(assets.styles).length === 0 ? <script
            dangerouslySetInnerHTML={{ __html: 'document.getElementById("content").style.display="block";' }} /> : null}
        </body>
      </html>
    );
  }
}
