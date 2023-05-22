import WhereAST from './where-ast.js';
import Utility from '../utility.js';

export default class WhereClause {
  constructor(verbose, allRows) {
    this.verbose = verbose;
    this.allRows = allRows;
  }

  process(where) {
    const whereAST = new WhereAST(this.verbose);

    where = Utility.dualDotToSpace(where);
    const ast = whereAST.generateAst(where);

    const expr = whereAST.toJavaScript(ast);
    this.verbose && console.info('WhereClause::process, Expression:', expr);

    this.filteredRows = this.allRows.filter(row => eval(expr));
  }
}
