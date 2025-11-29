const { Project, SyntaxKind } = require("ts-morph");

const project = new Project({
  tsConfigFilePath: "tsconfig.json"
});

const sourceFiles = project.getSourceFiles("src/**/*.ts");

sourceFiles.forEach((file) => {
  const expressions = file.getDescendantsOfKind(SyntaxKind.BinaryExpression);

  expressions.forEach((expr) => {
    const operator = expr.getOperatorToken().getText();

    if (operator === "==" || operator === "!=") {
      const left = expr.getLeft().getText();
      const right = expr.getRight().getText();
      const newOperator = operator === "==" ? "===" : "!==";

      expr.replaceWithText(`${left} ${newOperator} ${right}`);
    }
  });

  file.saveSync();
});

console.log("✅ Migración de '==' y '!=' completada.");
