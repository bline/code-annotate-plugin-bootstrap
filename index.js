/*
 * Copyright (C) 2014 Scott Beck, all rights reserved
 *
 * Licensed under the MIT license
 *
 */
// # code-annotate-plugin-bootstrap
// Bootstrap Rendering Plugin for [code-annotate](https://github.com/bline/code-annotate)
(function () {
  'use strict;';
  var _ = require('_');
  var path = require('path');
  var util = require('util');
  var plugin = require('code-annotate/plugin');
  function bootstrap(annotate) {
    plugin.apply(this, arguments);
  }
  util.inherits(bootstrap, plugin);
  bootstrap.name = 'bootstrap';
  bootstrap.defaults = {
    template: path.join(__dirname, './resources/template.html'),
    renderViewport: true,
    renderJQuery: true,
    renderIE8Shim: true,

    viewport: 'width=device-width, initial-scale=1',
    jqueryUrl: "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js",
    jsUrl: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js",
    cssUrl: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css",
    themeUrl: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap-theme.min.css",
    shivUrl: "https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js",
    respondUrl: "https://oss.maxcdn.com/respond/1.4.2/respond.min.js"
  };

  bootstrap.prototype.init = function (opt) {
    var that = this;
    plugin.prototype.init.apply(this, arguments);

    if (opt.renderViewport)
      this.emit('meta', {name: "viewport", content: opt.viewport});
    if (opt.renderJQuery)
      this.emit('script', opt.jqueryUrl);
    if (opt.renderIE8Shim)
      this.emit('headRaw',
        '<!--[if lt IE 9]>\n' +
        '  <script src="' + opt.shivUrl +'"></script>\n' +
        '  <script src="' + opt.respondUrl + '"></script>\n' +
        '<![endif]-->'
      );
    this.emit('stylesheet', opt.cssUrl);
    this.emit('stylesheet', opt.themeUrl);
    this.emit('script', opt.jsUrl);

    this.anno.on('files-end', function (files) {
      this.filesAnnotated = that.template(files);
    });
  };

  bootstrap.prototype.template = function (files) {
    var data = {
      files: files,
      opt: this.anno.templateOpt,
      plugins: this.anno.plugins
    };
    var template = this.anno.loadSrc(this.opt.template).contents;

    return _.template(template, data);
  };

  module.exports = bootstrap;
})();
