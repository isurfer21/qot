import SelectAST from './select-ast.js';

export default class SelectClause {
  constructor(verbose, allRows) {
    this.verbose = verbose;
    this.allRows = allRows;
  }

  process(select) {
    const selectAST = new SelectAST(this.verbose);
    const ast = selectAST.generateAst(select);

    const existingColumns = Object.keys(this.allRows[0]);
    this.columns = selectAST.toColumns(ast, existingColumns);
    this.verbose && console.info('SelectClause::process, Columns:', this.columns);
    
    const invalidColumns = selectAST.findInvalidColumn(this.columns, existingColumns);
    this.verbose && console.info('SelectClause::process, Invalids:', invalidColumns);
    if (invalidColumns.length > 0) {
      console.error(`Error: '${invalidColumns.join(', ')}' ${invalidColumns.length > 1 ? 'are invalid columns' : 'is invalid column'}.`);
      process.exit(1);
    }
    
    this.aggregates = selectAST.aggregators(ast);
    this.verbose && console.info('SelectClause::process, Aggregates:', this.aggregates);

    this.filters = selectAST.filters(ast);
    this.verbose && console.info('SelectClause::process, Filters:', this.filters);
  }
}
