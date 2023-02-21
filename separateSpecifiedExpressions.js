const onSeparateSpecifiedExpressions = (context) => {
    const sourceCode = context.getSourceCode()
    const options = context.options[0]

    return {
        ExpressionStatement(node) {
            const nodeName = node.expression?.callee?.name

            if (options.breakExpressions.includes(nodeName)) {
                const parentNode = node.parent
                const parentNodeBody = parentNode.body

                const nextNode = parentNodeBody[parentNodeBody.indexOf(node) + 1]
                const prevNode = parentNodeBody[parentNodeBody.indexOf(node) - 1]

                if (!prevNode) {
                    const firstToken = sourceCode.getFirstToken(parentNode)
                    const numberOfLinesBeforeNodeExpression = countNumberOfLinesUp(node, firstToken, sourceCode)

                    if (numberOfLinesBeforeNodeExpression) {
                        context.report({
                            node,
                            message: 'unecessary padding line before first expression',
                            fix: fixRemovingUpLines(node, sourceCode)
                        })
                    }
                }

                if (!nextNode)  {
                    const lastToken = sourceCode.getLastToken(parentNode)
                    const numberOfLinesAfterNodeExpression = countNumberOfLinesDown(node, lastToken, sourceCode)
                    if (numberOfLinesAfterNodeExpression) {
                        context.report({
                            node,
                            message: 'unecessary padding line after last expression',
                            fix: fixRemovingDownLines(node, sourceCode)
                        })
                    }
                }

                const nextNodeName = nextNode?.expression?.callee?.name
                
                if (nextNodeName === nodeName) {
                    const numberOfLinesBeforeNodeExpression = countNumberOfLinesDown(node, nextNode, sourceCode)

                    if (numberOfLinesBeforeNodeExpression === 0) {
                        context.report({
                            node,
                            message: `'${nodeName}' must be separated with line`,
                            fix: fixAddingNewLine(node, sourceCode)
                        })
                    }
                }
            }
        }
    }
}

function fixRemovingDownLines(node, sourceCode) {
    return (fixer) => {
        const lineToRemove = endLine(node.loc) + 1        
        const lineRange = getAllLineRange(lineToRemove, sourceCode)

        return fixer.replaceTextRange(lineRange, '')
    }
}

function fixRemovingUpLines(node, sourceCode) {
    return (fixer) => {
        const lineToRemove = startLine(node.loc) - 1        
        const lineRange = getAllLineRange(lineToRemove, sourceCode)

        return fixer.replaceTextRange(lineRange, '')
    }
}

function fixAddingNewLine(node) {
    return (fixer) => {
        return fixer.insertTextAfter(node, '\n')
    }
}

function getAllLineRange(line, sourceCode) {
    const startRange = sourceCode.getIndexFromLoc({
        line: line,
        column: 0
    })
    const endRange = sourceCode.getIndexFromLoc({
        line: line + 1,
        column: 0
    })

    return [startRange, endRange]
}

function countNumberOfLinesUp(nodeOrToken, firstNodeOrToken, sourceCode) {
    const nodeOrTokenLoc = nodeOrToken.loc
    const firstNodeOrTokenLoc = firstNodeOrToken.loc
    
    return sourceCode.lines
        .slice(
            endLine(firstNodeOrTokenLoc), 
            startLine(nodeOrTokenLoc) - 1
        ).filter(line => hasOnlyWhitespace(line)).length
}

function countNumberOfLinesDown(nodeOrToken, lastNodeOrToken, sourceCode) {
    const nodeOrTokenLoc = nodeOrToken.loc
    const lastNodeOrTokenLoc = lastNodeOrToken.loc
    
    return sourceCode.lines
        .slice(
            endLine(nodeOrTokenLoc), 
            startLine(lastNodeOrTokenLoc) - 1
        ).filter(
            line => hasOnlyWhitespace(line)
        ).length
}

function endLine(loc) {
    return loc.end.line
}

function startLine(loc) {
    return loc.start.line
}

function hasOnlyWhitespace(string) {
    return !string.trim().length
}

module.exports = { 
    onSeparateSpecifiedExpressions 
}