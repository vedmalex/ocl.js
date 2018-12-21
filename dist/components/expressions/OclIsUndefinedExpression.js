"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Expression_1 = require("./Expression");
/**
 * Checks if *self* is not defined
 *
 * @oclExpression oclIsUndefined() : Boolean
 */
var OclIsUndefinedExpression = /** @class */ (function (_super) {
    __extends(OclIsUndefinedExpression, _super);
    function OclIsUndefinedExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OclIsUndefinedExpression.prototype.evaluate = function (visitor) {
        var result = this.getSource()
            .evaluate(visitor);
        return result === undefined || typeof result === 'undefined';
    };
    return OclIsUndefinedExpression;
}(Expression_1.SourceBasedExpression));
exports.OclIsUndefinedExpression = OclIsUndefinedExpression;
//# sourceMappingURL=OclIsUndefinedExpression.js.map