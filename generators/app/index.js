'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var DjGenerator = yeoman.generators.Base.extend({
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
        name: 'author',
        message: 'Who is the creator?',
        default: 'author'
      }, {
        name: 'projectRepo',
        message: 'Whats the repo GIT clone URL?',
        default: ''
    }];

    this.prompt(prompts, function (props) {
      this.siteName = props.siteName;
      this.author = props.author;
      this.projectRepo = props.projectRepo;

      done();
    }.bind(this));

  },

  app: function () {
    var baseApp= this.siteName + '/app/apps/' + this.siteName;

    this.directory('root', this.siteName);
    this.directory('base_app', baseApp);
    this.template('templatetags.py', baseApp + '/templatetags/' + this.siteName + '.py');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = DjGenerator;
