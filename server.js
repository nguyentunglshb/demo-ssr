/* eslint no-console: "off" */

import React from "react";
import ReactDomServer from "react-dom/server";
import MobileDetect from "mobile-detect";
import express from "express";
import browserify from "browserify";
import babelify from "babelify";
import App from "./components/App.jsx";

const app = express();
const port = 3000;

app.get("/bundle.js", (req, res) => {
  browserify("./client.js", { debug: true })
    .transform(babelify)
    .bundle()
    .pipe(res);
});

app.get("/", (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"]);
  let fallbackScreenClass = "xxl";
  if (md.phone() !== null) fallbackScreenClass = "xs";
  if (md.tablet() !== null) fallbackScreenClass = "md";

  const component = <App fallbackScreenClass={fallbackScreenClass} />;
  const content = ReactDomServer.renderToString(component);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>React SSR Example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta property="og:url" content="https://fullstack.edu.vn/" data-react-helmet="true">
        <meta property="og:type" content="article" data-react-helmet="true">
        <meta property="og:title" content="F8 - học lập trình để đi làm! | Học lập trình online | Học lập trình Javascript" data-react-helmet="true">
        <meta property="og:description" content="Học Lập Trình Để Đi Làm với các khóa học xây dựng UI web với HTML, CSS, lập trình Java, lập trình Javascript, React, ReactJS, lập trình mobile React-Native, lập trình Backend với PHP, Laravel, Node, ExpressJS, MySQL, MongoDB, RESTfulAPI, ..." data-react-helmet="true">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta property="og:image" content="https://picsum.photos/200/300" data-react-helmet="true"/>
      </head>
      <body>
        <div id="app">${content}</div>
        <script src="bundle.js"></script>
      </body>
    </html>
  `);
  console.info("react-grid-system example rendered server-side.");
});

app.listen(port, () => {
  console.info(
    "==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.",
    port,
    port
  );
});
