function fixRemovingUpLines(node, sourceCode) {
    return (fixer) => {
        const lineToRemove = startLine(node.loc) - 1        
        const lineRange = getAllLineRange(lineToRemove, sourceCode)

        return fixer.replaceTextRange(lineRange, '')
    }
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

function fixRemovingDownLines(node, sourceCode) {
    return (fixer) => {
        const lineToRemove = endLine(node.loc) + 1        
        const lineRange = getAllLineRange(lineToRemove, sourceCode)

        return fixer.replaceTextRange(lineRange, '')
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
    fixRemovingUpLines,
    countNumberOfLinesUp,
    fixRemovingDownLines,
    getAllLineRange,
    countNumberOfLinesDown,
    endLine,
    startLine,
    hasOnlyWhitespace
}
