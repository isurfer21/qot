export default class SelectParser {
  constructor(verbose) {
    this.verbose = verbose;
  }

  parse(tokens) {
    this.tokens = tokens;
    this.currentTokenIndex = 0;

    const ast = {
      type: 'select',
      columns: []
    };

    while (this.currentTokenIndex < this.tokens.length) {
      const token = this.tokens[this.currentTokenIndex];

      if (token.type === 'identifier') {
        ast.columns.push(this.parseColumn());
      } else if (token.type === 'reserved_word' && token.value === 'DISTINCT') {
        ast.columns.push(this.parseDistinct());
      } else if (token.type === 'reserved_word' && ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX'].includes(token.value)) {
        ast.columns.push(this.parseAggregateFunction());
      } else {
        this.currentTokenIndex++;
      }
    }

    return ast;
  }

  parseColumn() {
    const column = {
      type: 'column',
      column: this.tokens[this.currentTokenIndex].value
    };

    this.currentTokenIndex++;

    if (this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].type === 'reserved_word' && this.tokens[this.currentTokenIndex].value === 'AS') {
      this.currentTokenIndex++;
      column.alias = this.tokens[this.currentTokenIndex].value;
      this.currentTokenIndex++;
    }

    return column;
  }

  parseDistinct() {
    const distinct = {
      type: 'distinct',
      column: null
    };

    this.currentTokenIndex++;

    if (this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].type === 'identifier') {
      distinct.column = this.tokens[this.currentTokenIndex].value;
      this.currentTokenIndex++;
    }

    if (this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].type === 'reserved_word' && this.tokens[this.currentTokenIndex].value === 'AS') {
      this.currentTokenIndex++;
      distinct.alias = this.tokens[this.currentTokenIndex].value;
      this.currentTokenIndex++;
    }

    return distinct;
  }

  parseAggregateFunction() {
    const aggregateFunction = {
      type: 'aggregate_function',
      method: this.tokens[this.currentTokenIndex].value,
      column: null
    };

    this.currentTokenIndex++;

    if (this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].type === 'parenthesis' && this.tokens[this.currentTokenIndex].value === '(') {
      this.currentTokenIndex++;

      if (this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].type === 'identifier') {
        aggregateFunction.column = this.tokens[this.currentTokenIndex].value;
        this.currentTokenIndex++;
      }

      if (this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].type === 'parenthesis' && this.tokens[this.currentTokenIndex].value === ')') {
        this.currentTokenIndex++;
      }
    }

    if (this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].type === 'reserved_word' && this.tokens[this.currentTokenIndex].value === 'AS') {
      this.currentTokenIndex++;
      aggregateFunction.alias = this.tokens[this.currentTokenIndex].value;
      this.currentTokenIndex++;
    }

    return aggregateFunction;
  }
}