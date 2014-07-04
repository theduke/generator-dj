'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var fs = require('fs');


var DjGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });

    this.conflicter.force = true;
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
      }, { name: 'languageCode',
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
        name: 'projectRepo',
        message: 'Whats the repo GIT clone URL?',
        default: ''
      }, {
        name: 'installjQuery',
        message: 'Install and include jQuery?',
        type: 'confirm'
      }, {
        name: 'installModernizr',
        message: 'Install and include Modernizr?',
        type: 'confirm'
      }, {
        name: 'installCompassBootstrap',
        message: 'Install and include Compass + bootstrap-sass? (REQUIRES compass AND bootstrap-sass GEMS!',
        type: 'confirm',
        default: false
      },
    ];

    this.prompt(prompts, function (props) {
      this.siteName = props.siteName;
      this.author = props.author;
      this.authorEmail = props.authorEmail;
      this.projectRepo = props.projectRepo;
      this.siteHost = props.siteHost;
      this.timezone = props.timezone; 
      this.languageCode = props.languageCode;

      this.installjQuery = props.installjQuery;
      this.installModernizr = props.installModernizr;

      this.installCompassBootstrap = props.installCompassBootstrap;

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

  _tplReplaceBlock: function(path, block, newContent) {
    var tpl = this.dest.read(path);

    var block_tag = '{% endblock ' + block + ' %}';

    if (tpl.search(block_tag) === -1) {
      throw Error("Could not find " + block_tag + " tag in base.html");
    }
    tpl = tpl.replace(block_tag, newContent + '\n' + block_tag);
    //this.dest.write(path, tpl);
    fs.writeFileSync(this.dest._base + '/' + path, tpl);
  },

  _baseTplAddJsBottom: function(js_path) {
    // Path to base tpl.
    var path = 'app/apps/core/templates/base.html';

    var tag = '<script type="text/javascript" src="{{ STATIC_URL }}' + js_path + '"></script>\n';
    this._tplReplaceBlock(path, 'js_bottom', tag);
  },

  _baseTplAddJsTop: function(js_path) {
    // Path to base tpl.
    var path = 'app/apps/core/templates/base.html';

    var tag = '<script type="text/javascript" src="{{ STATIC_URL }}' + js_pathy + '"></script>\n';
    this._tplReplaceBlock(path, 'js_top', tag);
  },

  _baseTplAddCss: function(css_path) {
    // Path to base tpl.
    var path = 'app/apps/core/templates/base.html';

    var tag = '<link href="{{ STATIC_URL }}' + css_path +'" media="all" rel="stylesheet" type="text/css" />\n';
    this._tplReplaceBlock(path, 'css', tag);
  },

  installDeps: function () {
    var bowerDeps = [];

    var js_top = "";
    var js = "";
    var css = "";


    if (this.installjQuery) {
      bowerDeps.push('jquery');
      js += '<script type="text/javascript" src="{{ STATIC_URL }}jquery/dist/jquery.js"></script>\n';
    }
    if (this.installModernizr) {
      bowerDeps.push('modernizr');
      js_top += '<script type="text/javascript" src="{{ STATIC_URL }}modernizr/modernizr.js"></script>\n';
    }

    if (bowerDeps.length) {
      this.bowerInstall(bowerDeps, {save: true});
    }

    // Update JS and CSS.
    var path = 'app/apps/core/templates/base.html';

    this._tplReplaceBlock(path, 'js_top', js_top);
    this._tplReplaceBlock(path, 'js_bottom', js);
    this._tplReplaceBlock(path, 'css', css);
  },

  installBootstrap: function() {
    if (!this.installCompassBootstrap) {
      return;
    }

    var path = this.dest._base + '/app/public/compass';
    this.spawnCommand('compass', ['create', path, '-r', 'bootstrap-sass', '--using', 'bootstrap'])
    
    this.copy('deps/bootstrap/config.rb', 'app/public/compass/config.rb')
    this.copy('deps/bootstrap/menu.html', 'app/apps/core/templates/core/header.html');

    this._baseTplAddJsBottom('js/bootstrap.js');
    this._baseTplAddCss('css/styles.css');
  }
});

module.exports = DjGenerator;
