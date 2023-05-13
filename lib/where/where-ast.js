import WhereLexer from './where-lexer.js';
import WhereParser from './where-parser.js';

export default class WhereAST {
  constructor(verbose) {
    this.verbose = verbose;
    this.whereLexer = new WhereLexer(this.verbose);
    this.whereParser = new WhereParser(this.verbose);
  }

  generateAst(expression) {
    if (!!expression) {
      const tokens = this.whereLexer.tokenize(expression);
      this.verbose && console.log('Where Tokens:', tokens);
      const ast = this.whereParser.parse(tokens);
      this.verbose && console.log('Where AST:', JSON.stringify(ast, null, 2));
      return ast;
    } else {
      console.warn('Error: Missing or invalid WHERE expression!');
    }
  }

  recreateExpression(ast) {
    // implementation to recreate the expression from the given AST
    switch (ast.type) {
      case "LogicalExpression":
        return `(${this.recreateExpression(ast.left)} ${ast.operator} ${this.recreateExpression(ast.right)})`;
      case "BinaryExpression":
        return `${this.recreateExpression(ast.left)} ${ast.operator} ${this.recreateExpression(ast.right)}`;
      case "BetweenExpression":
        return `${this.recreateExpression(ast.left)} BETWEEN ${this.recreateExpression(ast.min)} AND ${this.recreateExpression(ast.max)}`;
      case "NotBetweenExpression":
        return `${this.recreateExpression(ast.left)} NOT BETWEEN ${this.recreateExpression(ast.min)} AND ${this.recreateExpression(ast.max)}`;
      case "LikeExpression":
        return `${this.recreateExpression(ast.left)} LIKE ${this.recreateExpression(ast.right)}`;
      case "NotLikeExpression":
        return `${this.recreateExpression(ast.left)} NOT LIKE ${this.recreateExpression(ast.right)}`;
      case "InExpression":
        return `${this.recreateExpression(ast.left)} IN (${ast.values.map(this.recreateExpression.bind(this)).join(", ")})`;
      case "NotInExpression":
        return `${this.recreateExpression(ast.left)} NOT IN (${ast.values.map(this.recreateExpression.bind(this)).join(", ")})`;
      case "IsExpression":
        return `${this.recreateExpression(ast.left)} IS ${ast.operator.includes("NOT") ? "NOT" : ""} ${this.recreateExpression(ast.right)}`;
      case "NotExpression":
        return `NOT ${this.recreateExpression(ast.argument)}`;
      case "Literal":
        if (typeof ast.value === 'string') {
          return `"${ast.value}"`;
        } else if (ast.value instanceof Date) {
          return ast.value.toISOString();
        } else if (ast.value === null) {
          return 'NULL';
        } else {
          return ast.value;
        }
    }
  }

  toJavaScript(ast) {
    // implementation to create a JavaScript expression from the given AST
    switch (ast.type) {
      case "LogicalExpression":
        {
          let operator = ast.operator;
          if (operator === "AND") operator = "&&";
          if (operator === "OR") operator = "||";
          return `(${this.toJavaScript(ast.left)} ${operator} ${this.toJavaScript(ast.right)})`;
        }
      case "BinaryExpression":
        {
          let operator = ast.operator;
          if (operator === "=") operator = "==";
          if (operator === "<>") operator = "!=";
          return `row[${this.toJavaScript(ast.left)}] ${operator} ${this.toJavaScript(ast.right)}`;
        }
      case "BetweenExpression":
        return `(row[${this.toJavaScript(ast.left)}] >= ${this.toJavaScript(ast.min)} && row[${this.toJavaScript(ast.left)}] <= ${this.toJavaScript(ast.max)})`;
      case "NotBetweenExpression":
        return `(row[${this.toJavaScript(ast.left)}] < ${this.toJavaScript(ast.min)} || row[${this.toJavaScript(ast.left)}] > ${this.toJavaScript(ast.max)})`;
      case "LikeExpression":
        return `row[${this.toJavaScript(ast.left)}].includes(${this.toJavaScript(ast.right)})`;
      case "NotLikeExpression":
        return `!row[${this.toJavaScript(ast.left)}].includes(${this.toJavaScript(ast.right)})`;
      case "InExpression":
        return `[${ast.values.map(this.toJavaScript.bind(this)).join(", ")}].includes(row[${this.toJavaScript(ast.left)}])`;
      case "NotInExpression":
        return `![${ast.values.map(this.toJavaScript.bind(this)).join(", ")}].includes(row[${this.toJavaScript(ast.left)}])`;
      case "IsExpression":
        if (ast.operator.includes("NOT")) {
          return `row[${this.toJavaScript(ast.left)}] !== ${this.toJavaScript(ast.right)}`;
        } else {
          return `row[${this.toJavaScript(ast.left)}] === ${this.toJavaScript(ast.right)}`;
        }
      case "NotExpression":
        return `!${this.toJavaScript(ast.argument)}`;
      case "Literal":
        if (typeof ast.value === 'string') {
          return `"${ast.value}"`;
        } else if (ast.value instanceof Date) {
          return `new Date("${ast.value.toISOString()}")`;
        } else if (ast.value === null) {
          return 'null';
        } else {
          return ast.value;
        }
    }
  }
}