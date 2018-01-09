// @flow

/* eslint-disable max-len */

export default (html: string, preloadedState: ReduxState) => {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>4 Temps</title>
        <link rel="stylesheet" href="/public/app.css"></link>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
      </head>
      <body>
        <div id="root">${html}</div>
        <script type="application/javascript">
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script type="application/javascript" src="/public/bundle.js"></script>
      </body>
    </html>
    `;
};