const { countNumberOfLinesDown, countNumberOfLinesUp, fixRemovingUpLines, fixRemovingDownLines } = require('./utils/line.js')

const onSeparateClassMethodsSpecifiedExpressions = (context) => {
    const sourceCode = context.getSourceCode()

    return {
        MethodDefinition(node) {
            const classBody = node.parent.body
            const prevMethod = classBody[classBody.indexOf(node) - 1]
            
            if (prevMethod && countNumberOfLinesDown(prevMethod, node, sourceCode) === 0) {
                context.report({
                    node,
                    message: 'Methods declaration should be separated with lines',
                    fix: (fixer) => fixer.insertTextAfter(prevMethod, '\n')
                })
            }
        },
        ClassBody(node) {
            const openPunctuatorClassBody = sourceCode.getFirstToken(node)
            const nextOpenPunctuatorClassBody = sourceCode.getTokenAfter(openPunctuatorClassBody)

            const closePunctuatorClassBody = sourceCode.getLastToken(node)
            const prevClosePunctuatorClassBody = sourceCode.getTokenBefore(closePunctuatorClassBody)
            
            const linesBeforeEndClassBody = countNumberOfLinesDown(prevClosePunctuatorClassBody, closePunctuatorClassBody, sourceCode)
            const linesAfterStartClassBody = countNumberOfLinesUp(nextOpenPunctuatorClassBody, openPunctuatorClassBody, sourceCode)

            if (linesAfterStartClassBody > 0) {
                context.report({
                    node,
                    message: 'unecessary padding line after start declaration.',
                    fix: fixRemovingUpLines(nextOpenPunctuatorClassBody, sourceCode)
                })
            }

            if (linesBeforeEndClassBody > 0) {
                context.report({
                    node,
                    message: 'unecessary padding line after end declaration.',
                    fix: fixRemovingDownLines(prevClosePunctuatorClassBody, sourceCode)
                })
            }
        },
        TSParameterProperty(node) {
            const constructor = node.parent
            const constructorParams = constructor.params
            
            const prevNode = constructorParams[constructorParams.indexOf(node) - 1]

            if (prevNode && !sourceCode.isSpaceBetween(prevNode, node)) {
                context.report({
                    node,
                    message: 'the property should be separated in a new line',
                    fix: (fixer) => fixer.insertTextBefore(node, '\n\t\t')
                })
            }

            const constructorTokens = sourceCode.getTokens(constructor)
            const openingParenthesisConstructor = constructorTokens.find(token => token.value === '(')
            const closeParenthesisConstructor = constructorTokens.find(token => token.value === ')')

            if (!sourceCode.isSpaceBetween(openingParenthesisConstructor, node)) {
                context.report({
                    node,
                    message: 'not able to use TS parameters inline constructor',
                    fix: (fixer) => fixer.insertTextAfter(openingParenthesisConstructor, '\n\t\t')
                })
            }
            if (!sourceCode.isSpaceBetween(closeParenthesisConstructor, node)) {
                context.report({
                    node,
                    message: 'not able to use TS parameters inline constructor',
                    fix: (fixer) => fixer.insertTextAfter(node, '\n\t\t')
                })
            }
        }
    }
}

module.exports = { 
    onSeparateClassMethodsSpecifiedExpressions 
}