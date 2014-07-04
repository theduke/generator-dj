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
      }
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

  askForDeps: function() {
    var done = this.async();

    this.log(yosay('Select dependencies to install!'));

    var prompts = [{
        name: 'jquery',
        message: 'Install and include jQuery?',
        type: 'confirm'
      }, {
        name: 'modernizr',
        message: 'Install and include Modernizr?',
        type: 'confirm'
      }, {
        name: 'bootstrap_sass',
        message: 'Install and include Compass + bootstrap-sass? (REQUIRES compass AND bootstrap-sass GEMS!',
        type: 'confirm',
        default: false
      },
    ];

    this.prompt(prompts, function (props) {
      this.installDeps = props;
      done();
    }.bind(this));
  },

  askForDjangoModules: function() {
    var done = this.async();

    this.log(yosay('Select django modules to install!'));

    var prompts = [{
        name: 'debug_toolbar',
        message: 'Install django-debug-toolbar?',
        type: 'confirm',
        default: true
      }, 
    ];

    this.prompt(prompts, function (props) {
      this.installApps = props;
      done();
    }.bind(this));
  },

  askForSystem: function() {
    var done = this.async();

    this.log(yosay('System configuration!'));

    var prompts = [{
        name: 'venv',
        message: 'Create a new virtualenv?',
        type: 'confirm',
        default: false
      },
    ];

    this.prompt(prompts, function (props) {
      this.createVenv = props.venv;
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
    this.baseAppPath = baseApp;
    this.baseSettingsPath = this.baseAppPath + '/settings/base.py';
    this.requirementsFile = this.dest._base + '/app/requirements/prod.txt';

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

  _addAppConfig: function(name, conf) {
    // Build a pretty config header.
    var content = '# ' + name + ' #';
    var header = new Array(content.length + 1).join('#');

    content = '\n\n' + header + '\n' + content + '\n' + header + '\n\n';

    content = content + conf + '\n\n';

    this._fileAppend(this.baseSettingsPath, content);
  },

  _addPythonRequirement: function(name, version) {
    this._fileAppend(this.requirementsFile, '\n' + name );
  },

  _fileAppend: function(path, newContent) {
    var content = this.dest.read(path) + newContent;
    this.write(path, content);
  },

  runDepsInstall: function () {
    var bowerDeps = [];

    var js_top = "";
    var js = "";
    var css = "";


    if (this.installDeps.jquery) {
      bowerDeps.push('jquery');
      js += '<script type="text/javascript" src="{{ STATIC_URL }}jquery/dist/jquery.js"></script>\n';
    }
    if (this.installDeps.modernizr) {
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
    if (!this.installDeps.bootstrap_sass) {
      return;
    }

    var path = this.dest._base + '/app/public/compass';
    this.spawnCommand('compass', ['create', path, '-r', 'bootstrap-sass', '--using', 'bootstrap'])

    this.copy('deps/bootstrap/config.rb', 'app/public/compass/config.rb')
    this.copy('deps/bootstrap/menu.html', 'app/apps/core/templates/core/header.html');

    this._baseTplAddJsBottom('js/bootstrap.js');
    this._baseTplAddCss('css/styles.css');
  },

  runAppsInstalls: function() {
    var conf = this.installApps;
    if (conf.debug_toolbar) {
      var conf = "CONTRIB_APPS += ('debug_toolbar',)\n";
      conf += 'DEBUG_TOOLBAR_PATCH_SETTINGS = False\n';
      conf += "MIDDLEWARE_CLASSES = ('debug_toolbar.middleware.DebugToolbarMiddleware',) + MIDDLEWARE_CLASSES\n";

      this._addAppConfig('django-debug-toolbar', conf);
      // Add URL config.
      this._fileAppend(this.baseAppPath + '/urls.py', this.read('apps/debug_toolbar/urls.txt'));
    }
  },

  createVenv: function() {
    if (this.createVenv) {
      var path = this.dest._base + '/pyenv';
      var pip_path = path + '/bin/pip';

      this.spawnCommand('virtualenv', ['-p', 'python3', path]);
      //this.spawnCommand('bash', ["-c",  pip_path + ' install -r ' + this.requirementsFile]);
    }
  }
});

module.exports = DjGenerator;
