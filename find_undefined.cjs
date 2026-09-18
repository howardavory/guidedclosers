const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx']
});

const undefinedVars = new Set();

traverse(ast, {
  Identifier(path) {
    if (path.isReferencedIdentifier()) {
      if (!path.scope.hasBinding(path.node.name)) {
        const globals = ['console', 'alert', 'fetch', 'setTimeout', 'clearTimeout', 'process', 'window', 'document', 'Number', 'JSON', 'isNaN', 'Math', 'Promise', 'Object', 'Set', 'String'];
        if (!globals.includes(path.node.name)) {
          undefinedVars.add(path.node.name + ' at line ' + path.node.loc.start.line);
        }
      }
    }
  },
  JSXIdentifier(path) {
    if (path.parent.type === 'JSXOpeningElement' && path.parent.name === path.node) {
      const name = path.node.name;
      if (name.charAt(0) === name.charAt(0).toUpperCase()) {
        if (!path.scope.hasBinding(name)) {
          undefinedVars.add(name + ' (JSX) at line ' + path.node.loc.start.line);
        }
      }
    }
  }
});

console.log('Undefined references:\\n' + Array.from(undefinedVars).join('\\n'));
