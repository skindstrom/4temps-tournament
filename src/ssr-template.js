// @flow

/* eslint-disable max-len */

export default (html: string, preloadedState: ReduxState, cspNonce: string) => {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>4 Temps</title>

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">

        <link rel="stylesheet" href="/app.css"></link>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
      </head>
      <body>
        <div id="root">${html}</div>
        <script nonce="${cspNonce}" type="application/javascript">
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script type="application/javascript" src="/bundle.js"></script>
      </body>
    </html>
    `;
};