'use strict';
import { expect } from "chai";
import { FixtureFactory } from "../../fixture.factory";
import { OclParser } from "../../../lib/components/parser/OclParser";

require('../../../generator/oclParserGenerator');

describe('Collection->forAll', () => {
    const mother = FixtureFactory.createPerson('Hilde', 50);

    it('should evaluate forAll(c|...): negative', () => {
        const oclExpression = `
            context Person
                inv ChildrenAreAllYounger: self.children->forAll(c|c.age < self.age)
        `;

        mother.children = [
            FixtureFactory.createPerson('A', 10),
            FixtureFactory.createPerson('B', 50)
        ];

        const oclRule = OclParser.parse(oclExpression);
        let actual = oclRule.evaluate(mother);
        expect(actual).to.not.be.true;
    });

    it('should evaluate forAll(c|...): positive', () => {
        const oclExpression = `
            context Person inv:
                self.children->forAll(c|c.age < self.age)
        `;

        mother.children = [
            FixtureFactory.createPerson('A', 10),
            FixtureFactory.createPerson('B', 40)
        ];

        const oclRule = OclParser.parse(oclExpression);
        let actual = oclRule.evaluate(mother);
        expect(actual).to.be.true;
    });

    it('should evaluate forAll(c1,c2|...): positive', () => {
        // All children have different ages
        const oclExpression = `
            context Person inv:
                self.children->forAll(c1, c2|c1.age <> c2.age)
        `;

        mother.children = [
            FixtureFactory.createPerson('A', 1),
            FixtureFactory.createPerson('B', 2),
            FixtureFactory.createPerson('C', 3),
            FixtureFactory.createPerson('D', 4),
            FixtureFactory.createPerson('E', 5)
        ];

        const oclRule = OclParser.parse(oclExpression);
        let actual = oclRule.evaluate(mother);
        expect(actual).to.be.true;
    });

    it('should evaluate forAll(c1,c2|...): negative', () => {
        // All children have different ages
        const oclExpression = `
            context Person inv:
                self.children->forAll(c1, c2|c1.age <> c2.age)
        `;

        mother.children = [
            FixtureFactory.createPerson('A', 1),
            FixtureFactory.createPerson('B', 2),
            FixtureFactory.createPerson('C', 2),
            FixtureFactory.createPerson('D', 4),
            FixtureFactory.createPerson('E', 5)
        ];

        const oclRule = OclParser.parse(oclExpression);
        let actual = oclRule.evaluate(mother);
        expect(actual).to.not.be.true;
    });

    it('should iterate over collected items without having a collector', () => {
        const oclExpression = `
            context Person inv:
                self.children->forAll(age < 10)
       `;

        mother.children = [
            FixtureFactory.createPerson('A', 1),
            FixtureFactory.createPerson('B', 2),
            FixtureFactory.createPerson('C', 4),
            FixtureFactory.createPerson('D', 8),
            FixtureFactory.createPerson('E', 10)
        ];

        const oclRule = OclParser.parse(oclExpression);
        let actual = oclRule.evaluate(mother);
        expect(actual).to.be.false;
    });
});
