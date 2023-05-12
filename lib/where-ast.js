export default class WhereAST {
  constructor() {}

  generateAST(expression) {
    if (!!expression) {
      const tokens = this.tokenize(expression);
      console.log('Tokens', tokens);
      const ast = this.parse(tokens);
      console.log('AST:', JSON.stringify(ast, null, 2));
      return ast;
    } else {
      console.warn('Error: Missing or invalid expression!');
    }
  }

  tokenize(expression) {
    const tokens = [];
    let currentToken = "";
    let inString = false;
    let stringChar = "";

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if (inString) {
        currentToken += char;
        if (char === stringChar) {
          inString = false;
          stringChar = "";
          tokens.push(currentToken);
          currentToken = "";
        }
      } else if (char === " ") {
        if (currentToken.length > 0) {
          tokens.push(currentToken);
          currentToken = "";
        }
      } else if (["=", "<", ">", "!"].includes(char)) {
        if (currentToken.length > 0) {
          tokens.push(currentToken);
          currentToken = "";
        }
        currentToken += char;
        if (
          ["<>", ">=", "<=", "!="].includes(
            expression.substring(i, i + 2)
          )
        ) {
          currentToken += expression[i + 1];
          i++;
        }
        tokens.push(currentToken);
        currentToken = "";
      } else if (char === "(" || char === ")") {
        if (currentToken.length > 0) {
          tokens.push(currentToken);
          currentToken = "";
        }
        tokens.push(char);
      } else if (char === ",") {
        if (currentToken.length > 0) {
          tokens.push(currentToken);
          currentToken = "";
        }
        tokens.push(char);
      } else if (char === "'" || char === '"'  || char === '`') {
        inString = true;
        stringChar = char;
        currentToken += char;
      } else {
        currentToken += char;
      }
    }

    if (currentToken.length > 0) {
      tokens.push(currentToken);
    }

    return tokens;
  }

  parse(tokens) {
    let ast = this.parseExpression(tokens);
    return ast;
  }

  parseExpression(tokens) {
    let left = this.parseCondition(tokens);
    while (tokens.length > 0 && ["AND", "OR"].includes(tokens[0])) {
      let operator = tokens.shift();
      let right = this.parseCondition(tokens);
      left = { type: "LogicalExpression", operator, left, right };
    }
    return left;
  }

  parseCondition(tokens) {
    if (tokens[0] === "(") {
      tokens.shift();
      let expression = this.parseExpression(tokens);
      tokens.shift(); // )
      return expression;
    }
    if (tokens[0] === "NOT") {
      tokens.shift();
      let argument = this.parseCondition(tokens);
      return { type: "NotExpression", argument };
    }
    let left = this.parseValue(tokens);
    if (tokens.length > 0 && ["=", "<>", ">", "<", ">=", "<="].includes(tokens[0])) {
      let operator = tokens.shift();
      let right = this.parseValue(tokens);
      return { type: "BinaryExpression", operator, left, right };
    } else if (tokens.length > 0 && ["BETWEEN", "LIKE", "IN"].includes(tokens[0])) {
      let not = false;
      if (tokens[1] === "NOT") {
        not = true;
        tokens.shift();
      }
      let operator = tokens.shift();
      if (operator === "BETWEEN") {
        let min = this.parseValue(tokens);
        tokens.shift(); // AND
        let max = this.parseValue(tokens);
        return not ? { type: "NotBetweenExpression", left, min, max } : { type: "BetweenExpression", left, min, max };
      } else if (operator === "LIKE") {
        let right = this.parseValue(tokens);
        return not ? { type: "NotLikeExpression", left, right } : { type: "LikeExpression", left, right };
      } else if (operator === "IN") {
        tokens.shift(); // (
        let values = [];
        while (tokens[0] !== ")") {
          values.push(this.parseValue(tokens));
          if (tokens[0] === ",") tokens.shift();
        }
        tokens.shift(); // )
        return not ? { type: "NotInExpression", left, values } : { type: "InExpression", left, values };
      }
    } else if (tokens.length > 0 && ["IS"].includes(tokens[0])) {
      let operator = tokens.shift();
      if (tokens[0] === "NOT") {
        operator += ` ${tokens.shift()}`;
      }
      let right = this.parseValue(tokens);
      return { type: "IsExpression", operator, left, right };
    }
    return left;
  }

  parseValue(tokens) {
    let value = tokens.shift();
    if (/^-?\d+$/.test(value)) {
      value = parseInt(value);
    } else if (/^-?\d*\.\d+$/.test(value)) {
      value = parseFloat(value);
    } else if (/^['`"].*['`"]$/.test(value)) {
      value = value.slice(1, -1);
    } else if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3})?Z?)?$/.test(value)) {
      value = new Date(value);
    } else if (value === 'NULL' || value === 'undefined') {
      value = null;
    }
    return { type: "Literal", value };
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