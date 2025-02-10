export const fuzzySearch = (text, pattern) => {
    const textLength = text.length;
    const patternLength = pattern.length;

    // Initialize the matrix
    const matrix = Array(patternLength + 1)
        .fill()
        .map(() => Array(textLength + 1).fill(0));

    for (let i = 0; i <= patternLength; i++) {
        matrix[i][0] = i; // Cost of deleting characters from the pattern
    }

    // Populate the matrix
    for (let i = 1; i <= patternLength; i++) {
        for (let j = 1; j <= textLength; j++) {
            const cost = text[j - 1] === pattern[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // Deletion
                matrix[i][j - 1] + 1, // Insertion
                matrix[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    // Find the best match in the last row of the matrix
    let minDistance = Infinity;
    let bestEndPos = -1;
    for (let j = 1; j <= textLength; j++) {
        if (matrix[patternLength][j] < minDistance) {
            minDistance = matrix[patternLength][j];
            bestEndPos = j;
        }
    }

    // Calculate the start position of the match
    const startPosition = bestEndPos - patternLength;

    return {
        distance: minDistance,
        position: startPosition,
    };
};