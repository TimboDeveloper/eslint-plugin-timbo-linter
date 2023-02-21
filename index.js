const { onSeparateClassMethodsSpecifiedExpressions } = require('./separateClassMethodsSpecifiedExpressions')
const { onSeparateSpecifiedExpressions } = require('./separateSpecifiedExpressions')

module.exports = {
    rules: {
        expressions: {
            meta: {
                fixable: 'whitespace'  
            },
            create: onSeparateSpecifiedExpressions,
        },
        class: {
            meta: {
                fixable: 'whitespace'
            },
            create: onSeparateClassMethodsSpecifiedExpressions
        }
    }
}