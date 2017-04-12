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
    let proc = require('child_process')
      .exec(cmd, (err => err ? reject(err) : resolve()));
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
  });
}

let fs = require('fs');
let dstName = (name) => process.cwd() + '/' + name;
let srcName = (name) => __dirname + '/' + name;

let githubUser = process.env.GITHUB_ORG || 
  process.env.GITHUB_USER || process.env.USER;

let autogen = '<!--\n\t\tAUTOGENERATED FILE\n\t\tDO NOT EDIT \n-->';

async function create() {
  let name = process.argv[3] || throwError('missing project name');
  fs.mkdirSync(name);
  process.chdir(name);

  write('.travis.yml', 'language: node_js\nnode_js:\n- node\n');
  fs.writeFileSync(dstName('package.json'), 
    JSON.stringify({name}));

  fs.writeFileSync(name + '.js',
    '/' + '/ # ' + name + '\n//\nconsole.log(\'hello\');\n');

  console.log('installing dependencies, please wait..');
  await exec('yarn');

  release();
  await exec('git init');
  await exec('git add .');
  await exec('git commit -am \'initial commit\'');
  await exec('git remote add origin https://github.com/' +
    githubUser + '/' + name + '.git');
  //exec('git push -u origin master');
};

async function release() {
  console.log('building release.');
  let pkg = JSON.parse(fs.readFileSync(dstName('package.json'), 'utf-8'));
  let homepage = pkg.homepage ? '\n\n***See <' +
    pkg.homepage + '> for details.***\n' : '\n';
  let readme = autogen + '\n# ' + pkg.name + '\n' +pkg.description  + homepage;
  pkg.scripts = Object.assign(pkg.scripts || {}, {
    release: 'simple-javascript release',
    dev: 'simple-javascript dev',
    test: 'simple-javascript test',
  });
  pkg.license = pkg.license || "MIT";
  pkg.main = pkg.main || 'lib.js';
  pkg.browser = pkg.browser || 'dist.js';
  pkg.devDependencies = pkg.devDependencies ||  { 'simple-javascript': '*' };
  pkg.repository = pkg.repository ||  'github:${githubUser}/${name}';
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
    fs.readFile(srcName(fname), 'utf-8',
      (err, str) => {
        if(err) throw err;
        write(fname, str.replace(/simple-javascript/g, pkg.name));
      });
  }

  await exec('node_modules/babel-cli/bin/babel.js ' +
    ' --presets react,es2016,es2017 ' +
    pkg.name + '.js -o lib.js');
  await exec('node_modules/webpack/bin/webpack.js --color');
  // Increase patch version

  pkg.version = pkg.version.replace(/\.[0-9]*$/,
    s => '.' + (1 + +s.slice(1)));
  write('package.json', JSON.stringify(pkg, '', 2));
}

function write(fname, data) {
  fs.writeFile(dstName(fname), data, 'utf-8', pass);
}

async function dev() {
  exec('node_modules/webpack-dev-server/bin/webpack-dev-server.js --hot --inline --color');
}

async function test() {
  console.log('`test` not implemented yet');
}

async function help() {
  console.log(`usage:
  simple-javascript create app-name   # Creates new directory with app.
  simple-javascript release      # Builds the app in current directory.
  simple-javascript dev       # starts dev-server in current directory.`);
}

function pass() { }

let dispatch = ({create, release, dev, test})[process.argv[2]] || help;
dispatch().catch(e => process.exit(-1));
