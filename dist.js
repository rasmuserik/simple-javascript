(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, __dirname) {let create = (() => {
  var _ref = _asyncToGenerator(function* () {
    let fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    let name = process.argv[3] || throwError('missing project name');
    fs.mkdirSync(name);
    process.chdir(name);

    write('.travis.yml', 'language: node_js\nnode_js:\n- node\n');
    fs.writeFileSync(dstName('package.json'), JSON.stringify({ name }));

    fs.writeFileSync(name + '.js', '/' + '/ # ' + name + '\n//\nconsole.log(\'hello\');\n');

    console.log('installing dependencies, please wait..');
    yield exec('yarn');

    release();
    yield exec('git init');
    yield exec('git add .');
    yield exec('git commit -am \'initial commit\'');
    yield exec('git remote add origin https://github.com/' + githubUser + '/' + name + '.git');
    //exec('git push -u origin master');
  });

  return function create() {
    return _ref.apply(this, arguments);
  };
})();

let release = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    let fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    console.log('building release.');
    let pkg = JSON.parse(fs.readFileSync(dstName('package.json'), 'utf-8'));
    let homepage = pkg.homepage ? '\n\n***See <' + pkg.homepage + '> for details.***\n' : '\n';
    let readme = autogen + '\n# ' + pkg.name + '\n' + pkg.description + homepage;
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.release = pkg.scripts.release || 'simple-javascript release';
    pkg.scripts.dev = pkg.scripts.dev || 'simple-javascript dev';
    pkg.scripts.test = pkg.scripts.test || 'simple-javascript test';
    pkg.license = pkg.license || "MIT";
    pkg.main = pkg.main || 'lib.js';
    pkg.browser = pkg.browser || 'dist.js';
    pkg.devDependencies = pkg.devDependencies || { 'simple-javascript': '*' };
    pkg.repository = pkg.repository || 'github:${githubUser}/${name}';
    pkg.version = pkg.version || '0.0.0';
    pkg.homepage = pkg.homepage || `http://${githubUser}.github.io/${name}`;
    pkg.description = pkg.description || '';

    write('README.md', readme);
    write('index.html', html(pkg));
    copyReplace('index.js');
    copyReplace('.gitignore');
    copyReplace('.babelrc');
    copyReplace('webpack.config.js');

    function copyReplace(fname) {
      fs.readFile(srcName(fname), 'utf-8', (err, str) => {
        if (err) throw err;
        write(fname, str.replace(/simple-javascript/g, pkg.name));
      });
    }

    yield exec('node_modules/babel-cli/bin/babel.js ' + ' --presets react,es2016,es2017 ' + pkg.name + '.js -o lib.js');
    yield exec('node_modules/webpack/bin/webpack.js --color');
    // Increase patch version

    pkg.version = pkg.version.replace(/\.[0-9]*$/, function (s) {
      return '.' + (1 + +s.slice(1));
    });
    write('package.json', JSON.stringify(pkg, '', 2));
  });

  return function release() {
    return _ref2.apply(this, arguments);
  };
})();

let dev = (() => {
  var _ref3 = _asyncToGenerator(function* () {
    exec('node_modules/webpack-dev-server/bin/webpack-dev-server.js --hot --inline --color');
  });

  return function dev() {
    return _ref3.apply(this, arguments);
  };
})();

let test = (() => {
  var _ref4 = _asyncToGenerator(function* () {
    console.log('`test` not implemented yet');
  });

  return function test() {
    return _ref4.apply(this, arguments);
  };
})();

let help = (() => {
  var _ref5 = _asyncToGenerator(function* () {
    console.log(`usage:
  simple-javascript create app-name   # Creates new directory with app.
  simple-javascript release      # Builds the app in current directory.
  simple-javascript dev       # starts dev-server in current directory.`);
  });

  return function help() {
    return _ref5.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// # Simple JavaScript
//
// In a simple JavaScript library/app, you just create:
//
// - `package.json`
// - `$NAME.js`
// - `icon.png`
//
// Running `simple-javascript release` then increment patch-version in `package.json`, and (auto)generates:
//
// - `dist.js` packaged web version of the app with all dependencies included.
// - `dist.map.js` source map for dist.js
// - `.babelrc` temporary build config
// - `webpack-config.js` temporary build config
// - `README.md` documentation based on name, description and homepage in package.json
// - `lib.js` babel compiled version of the source, mapping ES6/ES7/JSX to plain ES5.
// - `index.js` loader used for building dist.*
// - `index.html` webpage containing element with id=app, and executing exports.main
// - `.gitignore` ignores unneeded files
//
// # Literate code
//

function throwError(e) {
  throw new Error(e);
}

function html(pkg) {
  return `<!DOCTYPE html>
<!--

  AUTOGENERATED FILE
  DO NOT EDIT

-->
<html>
  <head>
    <meta charset="utf-8">
    <title>${pkg.name}</title>
    <link rel=icon href=icon.png>
    <meta name="viewport" content="width=device-width">
    <style>
body {
  font-family: sans-serif;
}
    </style>
  </head>
  <body>
  <div>
    <img src=icon.png width=32 height=32 style=float:left;margin-right:16px>
    <strong>${pkg.name}</strong>
    <div>${pkg.description}</div>
  </div>
    <div id=app></div>
    <script>exports={};module={exports:exports};</script>
    <script src=./dist.js></script>
    <script>module.exports.main()</script>
    <script src=https://unpkg.com/ldoc></script>
  </body>
</html>`;
}
function exec(cmd) {
  return new Promise((resolve, reject) => {
    let proc = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).exec(cmd, err => err ? reject(err) : resolve());
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
  });
}

let dstName = name => process.cwd() + '/' + name;
let srcName = name => __dirname + '/' + name;

let githubUser = process.env.GITHUB_ORG || process.env.GITHUB_USER || process.env.USER;

let autogen = '<!--\n\t\tAUTOGENERATED FILE\n\t\tDO NOT EDIT \n-->';

;

function write(fname, data) {
  let fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  fs.writeFile(dstName(fname), data, 'utf-8', pass);
}

function pass() {}

if (typeof process !== undefined && process.versions && process.versions.node) {
  let dispatch = { create, release, dev, test }[process.argv[2]] || help;
  dispatch().catch(e => process.exit(-1));
}

exports.main = () => console.log('this app should be run as a cli binary');
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), "/"))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
//# sourceMappingURL=dist.js.map