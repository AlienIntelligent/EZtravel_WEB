import babel from '@babel/core';
import fs from 'fs';

function reactFcToFunction({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        if (path.node.declarations.length !== 1) return;
        const decl = path.node.declarations[0];
        
        if (!t.isArrowFunctionExpression(decl.init)) return;
        
        if (decl.id.typeAnnotation) {
          const typeAnn = decl.id.typeAnnotation.typeAnnotation;
          let isReactFC = false;
          if (t.isTSTypeReference(typeAnn)) {
            const typeName = typeAnn.typeName;
            if (t.isIdentifier(typeName) && typeName.name === 'FC') isReactFC = true;
            if (t.isTSQualifiedName(typeName) && 
                t.isIdentifier(typeName.left, { name: 'React' }) && 
                t.isIdentifier(typeName.right, { name: 'FC' })) {
              isReactFC = true;
            }
          }
          
          if (isReactFC) {
            const funcName = decl.id.name;
            const params = decl.init.params;
            let body = decl.init.body;
            
            if (!t.isBlockStatement(body)) {
              body = t.blockStatement([t.returnStatement(body)]);
            }
            
            const funcDecl = t.functionDeclaration(
              t.identifier(funcName),
              params,
              body
            );
            
            if (path.parentPath.isExportNamedDeclaration()) {
              path.parentPath.replaceWith(t.exportNamedDeclaration(funcDecl, []));
            } else {
              path.replaceWith(funcDecl);
            }
          }
        }
      }
    }
  };
}

const file = 'src/components/auth/GuestGuard.tsx'; // Will pick one existing file to test
if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    const result = babel.transformSync(code, {
      filename: file,
      presets: [
        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
      ],
      plugins: [
        reactFcToFunction,
        '@babel/plugin-syntax-jsx'
      ],
      retainLines: true,
    });
    fs.writeFileSync('test-out.jsx', result.code);
    console.log("Success!");
} else {
    // Just find any tsx file
    const glob = fs.readdirSync('src/components', {recursive: true});
    const tsx = glob.find(f => f.endsWith('.tsx'));
    console.log("Try with file:", tsx);
}
