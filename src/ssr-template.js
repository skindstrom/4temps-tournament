// @flow

export default (html: string) => {
    return `
    <!doctype html>
    <html>
      <head>
        <title>4 Temps</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
};