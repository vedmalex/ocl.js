import Expression from './expression';

class StringExpression extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    evaluate() {
        return this.value;
    }
}

export default StringExpression;