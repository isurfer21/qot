export default class WhereParser {
  constructor(verbose) {
    this.verbose = verbose;
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
}