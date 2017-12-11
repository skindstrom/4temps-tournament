// @flow

export default (html: string) => {
    return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>4 Temps</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
};