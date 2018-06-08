import { ContextExpression } from './ContextExpression'

/**
 */
export class OperationContextExpression extends ContextExpression {
    constructor(operationMetaInfo, expressions) {
        super();

        let split = operationMetaInfo.pathName.split('::')
        this.targetType = split[0];
        this.fnName = split[1];
        this.params = operationMetaInfo.params;
        this.returnType = operationMetaInfo.returnType;
        this.expressions = expressions;
    }

    accept(visitor) {
        console.log(visitor);
        return true;
    }

    visit(visitor) {
        visitor.visitOperationContextExpression(this);
    }
}