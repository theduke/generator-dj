'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var fs = require('fs');


var Bootstrap = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    this.log(yosay('Wecome to the Django project generator!'));

    var prompts = [{
        name: 'siteName',
        message: 'Whats the name of the website?',
        default: path.basename(process.cwd())
      }, {
        name: 'siteHost',
        message: 'Hostname for the site?',
        default: 'example.com'
      }, { name: 'timezone',
        message: 'Set timezone (check http://en.wikipedia.org/wiki/List_of_tz_zones_by_name)',
        default: 'UTC'
      }, { name: 'timezone',
        message: 'Language code (check http://www.i18nguy.com/unicode/language-identifiers.html)',
        default: 'en-US'
      },{ name: 'author',
        message: 'Who is the creator?',
        default: 'author'
      }, {
       name: 'authorEmail',
        message: 'Email of the author',
        default: 'author@site.com'
      }, {
       name: 'installJquery',
        message: 'Install and include jQuery?',
        type: 'confirm',
        default: true
      }, {
       name: 'installModernizr',
        message: 'Install and include Modernizr?',
        type: 'confirm',
        default: true
      }, {
        name: 'projectRepo',
        message: 'Whats the repo GIT clone URL?',
        default: ''
    }];

    this.prompt(prompts, function (props) {
      this.siteName = props.siteName;
      this.author = props.author;
      this.authorEmail = props.authorEmail;
      this.projectRepo = props.projectRepo;
      this.siteHost = props.siteHost;
      this.timezone = props.timezone; 
      this.languageCode = props.languageCode;

      // Javascript deps.
      this.installModernizr = props.installModernizr;
      this.installJquery = props.installJquery;

      done();
    }.bind(this));

  },

  app: function () {

    // Copy everything from root directory.
    var root = this.src._base + '/root';
    var files = fs.readdirSync(root);
    for (var key in files) {
      var path = root + '/' + files[key];
      if (fs.statSync(path).isDirectory(path)) {
        this.directory(path, files[key]);
      }
      else {
        this.template(path, files[key]);
      }
    }

    // Copy base app.
    var baseApp= 'app/apps/' + this.siteName;
    this.directory('base_app', baseApp);

    // Copy template tags.
    this.template('templatetags.py', baseApp + '/templatetags/' + this.siteName + '.py');
  },

  jsDependencies: function() {
    var topJs = '';
    var bottomJs = '';

    if (this.installJquery) {
      this.bowerInstall('jquery', { save: true });
    }
    if (this.installModernizr) {
      this.bowerInstall('modernizr', {save: true});
    }
  },

  projectfiles: function () {
  }
});

module.exports = Bootstrap;
