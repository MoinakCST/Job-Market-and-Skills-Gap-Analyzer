const STOP_WORDS = new Set([
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have", "in", "is", "it",
    "of", "on", "or", "that", "the", "to", "was", "were", "will", "with", "you", "your", "we", "our"
]);

// Basic text cleanup and tokenization for lightweight keyword matching.
function tokenize(text) {
    const normalized = (typeof text === "string" ? text : "").toLowerCase();
    return normalized
        .split(/[^a-z0-9+#.]+/)
        .map((token) => token.trim())
        .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

// Extracts the most frequent job keywords used as model features.
function extractImportantKeywords(text, limit = 20) {
    const frequency = new Map();
    const tokens = tokenize(text);

    for (const token of tokens) {
        const previous = frequency.get(token) || 0;
        frequency.set(token, previous + 1);
    }

    return Array.from(frequency.entries())
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, limit)
        .map(([token]) => token);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// First local ML baseline: keyword-overlap scoring between candidate profile and job description.
function calculateMlMatchScore({ resume, selfDescription, jobDescription }) {
    const candidateText = `${resume || ""}\n${selfDescription || ""}`;
    const jobKeywords = extractImportantKeywords(jobDescription, 24);
    const candidateTokenSet = new Set(tokenize(candidateText));

    const matchedKeywords = [];
    const missingKeywords = [];

    for (const keyword of jobKeywords) {
        if (candidateTokenSet.has(keyword)) {
            matchedKeywords.push(keyword);
            continue;
        }
        missingKeywords.push(keyword);
    }

    const keywordCoverage = jobKeywords.length > 0 ? matchedKeywords.length / jobKeywords.length : 0;
    const score = Math.round(clamp(keywordCoverage * 100, 0, 100));

    return {
        model: "keyword-overlap-baseline",
        version: "v1",
        matchScore: score,
        keywordCoverage: Number(keywordCoverage.toFixed(2)),
        matchedKeywords,
        missingKeywords
    };
}

module.exports = calculateMlMatchScore;
