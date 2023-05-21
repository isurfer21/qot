import SelectLexer from './select-lexer.js';
import SelectParser from './select-parser.js';

export default class SelectAST {
  constructor(verbose) {
    this.verbose = verbose;
    this.selectLexer = new SelectLexer(this.verbose);
    this.selectParser = new SelectParser(this.verbose);
  }

  generateAst(expression) {
    if (!!expression) {
      const tokens = this.selectLexer.tokenize(expression);
      this.verbose && console.info('SelectAST::generateAst, Tokens:', tokens);
      const ast = this.selectParser.parse(tokens);
      this.verbose && console.info('SelectAST::generateAst, AST:', JSON.stringify(ast, null, 2));
      return ast;
    } else {
      console.warn('Error: Missing or invalid SELECT expression!');
    }
  }

  toColumns(ast, columnIds) {
    let columns = {};
    if (ast.columns.length === 0) {
      for (let i = 0; i < columnIds.length; i++) {
        columns[columnIds[i]] = columnIds[i];
      }
    } else {
      for (let i = 0; i < ast.columns.length; i++) {
        if (!!ast.columns[i].alias) {
          columns[ast.columns[i].column] = ast.columns[i].alias;
        } else {
          if (!!ast.columns[i].type && ast.columns[i].type == 'aggregate_function') {
            columns[ast.columns[i].column] = `${ast.columns[i].method}(${ast.columns[i].column})`;
          } else {
            columns[ast.columns[i].column] = ast.columns[i].column;
          }
        }
      }
    }
    return columns;
  }

  aggregators(ast) {
    let aggregates = {};
    for (let i = 0; i < ast.columns.length; i++) {
      if (ast.columns[i].type == 'aggregate_function') {
        aggregates[ast.columns[i].column] = ast.columns[i].method;
      } else if (ast.columns[i].type == 'distinct') {
        aggregates[ast.columns[i].column] = ast.columns[i].type;
      }
    }
    return aggregates;
  }
}
