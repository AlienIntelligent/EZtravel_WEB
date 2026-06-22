import { Project, SyntaxKind } from "ts-morph";
import babel from "@babel/core";
import fs from "fs";

async function main() {
    const project = new Project();
    project.addSourceFilesAtPaths([
        "d:/eztravel/WebClient/src/components/**/*.tsx",
        "d:/eztravel/WebClient/src/modules/**/*.tsx",
        "d:/eztravel/WebClient/src/layouts/**/*.tsx",
        "d:/eztravel/WebClient/src/routes/**/*.tsx",
    ]);

    const files = project.getSourceFiles();
    console.log(`Found ${files.length} files to migrate.`);

    for (const sourceFile of files) {
        try {
            const varStmts = sourceFile.getVariableStatements();
            for (const varStmt of varStmts) {
                const decls = varStmt.getDeclarations();
                if (decls.length !== 1) continue;
                
                const decl = decls[0];
                const typeNode = decl.getTypeNode();
                
                if (typeNode) {
                    const typeText = typeNode.getText();
                    if (typeText.includes("React.FC") || typeText.includes("FC<") || typeText === "FC") {
                        const initializer = decl.getInitializer();
                        if (initializer && initializer.getKind() === SyntaxKind.ArrowFunction) {
                            const arrowFunc = initializer.asKind(SyntaxKind.ArrowFunction);
                            const name = decl.getName();
                            const params = arrowFunc.getParameters().map(p => p.getText()).join(", ");
                            
                            let bodyText = arrowFunc.getBodyText();
                            const isBlock = arrowFunc.getBody().getKind() === SyntaxKind.Block;
                            if (!isBlock) {
                                bodyText = `return (\n${arrowFunc.getBody().getText()}\n);`;
                            }
                            
                            const isExported = varStmt.hasExportKeyword();
                            const isDefault = varStmt.hasDefaultKeyword();
                            
                            const prefix = isExported ? "export " : "";
                            const defaultKw = isDefault ? "default " : "";
                            const replacement = `${prefix}${defaultKw}function ${name}(${params}) {\n${bodyText}\n}`;
                            
                            varStmt.replaceWithText(replacement);
                        }
                    }
                }
            }

            let code = sourceFile.getFullText();
            code = code.replace(/from\s+['"](.*)\.tsx['"]/g, "from '$1.jsx'");
            
            const result = babel.transformSync(code, {
                filename: sourceFile.getFilePath(),
                presets: [
                    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
                ],
                plugins: [
                    '@babel/plugin-syntax-jsx'
                ],
                retainLines: true
            });
            
            const newFilePath = sourceFile.getFilePath().replace(/\.tsx$/, '.jsx');
            fs.writeFileSync(newFilePath, result.code);
            fs.unlinkSync(sourceFile.getFilePath());
            console.log(`Migrated: ${newFilePath}`);
        } catch (e) {
            console.error(`Failed to process ${sourceFile.getFilePath()}`, e);
        }
    }
}

main();
