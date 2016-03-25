import OclParserGenerator from './../lib/OclParserGenerator'

import ContextExpression from './../lib/expressions/contextExpression';
import AndExpression from './../lib/expressions/andExpression';
import ImpliesExpression from './../lib/expressions/impliesExpression';
import InvariantExpression from './../lib/expressions/invariantExpression';
import IsEmptyExpression from './../lib/expressions/isEmptyExpression';
import IteratorExpression from './../lib/expressions/iteratorExpression';
import NumberExpression from './../lib/expressions/numberExpression';
import OperationCallExpression from './../lib/expressions/operationCallExpression';
import StringExpression from './../lib/expressions/stringExpression';
import BooleanExpression from './../lib/expressions/booleanExpression';
import VariableExpression from './../lib/expressions/variableExpression';
import NilExpression from './../lib/expressions/nilExpression';

const should = require('should');

describe('OCLParser: inv:', () => {
    let OclParser;
    const assertAST = (oclExpression, expected) => new OclParser(oclExpression).parse().should.eql(expected);
    const invariantDecorator = (definition, name) => {
        return new ContextExpression('Entity', definition ? new InvariantExpression(definition, name) : {});
    };

    before(() => {
        OclParserGenerator.generate();
        OclParser = require('./../lib/oclParser').default;
    });

    it('should parse OCL constraint', () => {
        const oclExpression = `
            context Entity
                inv: c1 <> c2
        `;
        const expected = invariantDecorator(new OperationCallExpression('<>', new VariableExpression('c1'), new VariableExpression('c2')));

        assertAST(oclExpression, expected);
    });

    it('should parse attributeCall expression.', () => {
        const oclExpression = 'context Entity inv: self.participants';
        const expected = invariantDecorator(new VariableExpression('self.participants'));

        assertAST(oclExpression, expected);
    });

    it('should parse VariableExp', () => {
        const oclExpression = `
            context Entity
                inv: self
        `;
        const expected = invariantDecorator({
            type: 'VariableExpression',
            variable: 'self'
        });

        assertAST(oclExpression, expected);
    });

    it('should parse IteratorExp two iterators', () => {
        const oclExpression = `
            context Entity inv:
                self.participants->forAll(c1, c2 | c1 <> c2)
        `;

        const attributeCallExpression = new VariableExpression('self.participants');
        const operationCallExpression = new OperationCallExpression('<>', new VariableExpression('c1'), new VariableExpression('c2'));
        const iteratorExpression = new IteratorExpression(attributeCallExpression, ['c1', 'c2'], operationCallExpression);
        const expected = invariantDecorator(iteratorExpression);

        assertAST(oclExpression, expected);
    });

    it('should parse IteratorExp one iterator', () => {
        const oclExpression = `
            context Entity inv:
                self.participants->forAll( c1  | c1.name = "Stephan")
        `;

        const attributeCallExpression = new VariableExpression('self.participants');
        const operationCallExpression = new OperationCallExpression('=', new VariableExpression('c1.name'), new StringExpression("Stephan"));
        const iteratorExpression = new IteratorExpression(attributeCallExpression, ['c1'], operationCallExpression);
        const expected = invariantDecorator(iteratorExpression);

        assertAST(oclExpression, expected);
    });

    it('should parse IteratorExp one iterator II', () => {
        const oclExpression = `
            context Entity inv:
                self.participants->forAll( c  | c.name = "Stephan")
        `;

        const attributeCallExpression = new VariableExpression('self.participants');
        const operationCallExpression = new OperationCallExpression('=', new VariableExpression('c.name'), new StringExpression("Stephan"));
        const iteratorExpression = new IteratorExpression(attributeCallExpression, ['c'], operationCallExpression);
        const expected = invariantDecorator(iteratorExpression);

        assertAST(oclExpression, expected);
    });

    it('should parse ImpliesExpression', () => {
        const oclExpression = `
            context Entity inv:
                self.a = 1 implies self.b = 2
        `;

        const lefty = new OperationCallExpression('=', new VariableExpression('self.a'), new NumberExpression(1));
        const righty = new OperationCallExpression('=', new VariableExpression('self.b'), new NumberExpression(2));
        const expected = invariantDecorator(new ImpliesExpression(lefty, righty));

        assertAST(oclExpression, expected);
    });

    it('should parse ImpliesExpression with FunctionCallExpression', () => {
        const oclExpression = `
            context Entity
                inv: self.associations->isEmpty() implies self.hasAssociations = 0
        `;
        const lefty = new IsEmptyExpression(new VariableExpression('self.associations'));
        const righty = new OperationCallExpression('=', new VariableExpression('self.hasAssociations'), new NumberExpression(0));
        const expected = invariantDecorator(new ImpliesExpression(lefty, righty));

        assertAST(oclExpression, expected);
    });

    it('should parse BooleanExpression', () => {
        const oclExpression = `
            context Entity
                inv: self.isIntrinsic = true
        `;

        const expected = invariantDecorator(new OperationCallExpression('=', new VariableExpression('self.isIntrinsic'), new BooleanExpression(true)))

        assertAST(oclExpression, expected);
    });

    it('should parse complex Invariant', () => {
        const oclExpression = `
            context Entity
                inv: self.a = true and self.b = false
        `;

        const andLeft = new OperationCallExpression('=', new VariableExpression('self.a'), new BooleanExpression(true));
        const andRight = new OperationCallExpression('=', new VariableExpression('self.b'), new BooleanExpression(false));
        new AndExpression(andLeft, andRight);
        const expected = invariantDecorator(new AndExpression(andLeft, andRight));

        assertAST(oclExpression, expected);
    });

    it('should parse OCL constraint', () => {
        const oclExpression = `
            context Entity
                inv MyCustomInvariant: c1 <> c2
        `;

        const expected = invariantDecorator(new OperationCallExpression('<>', new VariableExpression('c1'), new VariableExpression('c2')), 'MyCustomInvariant');
        assertAST(oclExpression, expected);
    });

    it('should parse nil expression', () => {
        const oclExpression = `
            context Entity
                inv: c1 <> nil
        `;

        const expected = invariantDecorator(new OperationCallExpression('<>', new VariableExpression('c1'), new NilExpression()));
        assertAST(oclExpression, expected);
    });
});