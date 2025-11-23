// TF-IDF calculation (classic formulation)
// TF(t,d) = count(t in d) / totalWords(d)
// IDF(t) = ln(N / df(t))
// TF-IDF(t,d) = TF(t,d) * IDF(t)
import { preprocess } from "./preprocess.js";

export function computeTFIDF(docs) {
  // docs: array of raw strings
  if (!Array.isArray(docs) || docs.length === 0) return {};

  const tfPerDoc = []; // array of term-frequency objects for each doc
  const df = {}; // document frequency (number of documents containing the term)
  const N = docs.length;

  // Build TF per document and DF (count unique tokens per document)
  docs.forEach(doc => {
    const tokens = preprocess(doc);
    const tfDoc = {};
    tokens.forEach(token => {
      tfDoc[token] = (tfDoc[token] || 0) + 1;
    });
    // increment DF for unique tokens in this document
    const uniqueTokens = new Set(Object.keys(tfDoc));
    uniqueTokens.forEach(token => {
      df[token] = (df[token] || 0) + 1;
    });
    tfPerDoc.push({ tfDoc, totalTerms: tokens.length });
  });

  // Calculate TF-IDF per document using classic formulas, then aggregate by summing across docs
  const tfidfPerDoc = tfPerDoc.map(({ tfDoc, totalTerms }) => {
    const tfidf = {};
    Object.keys(tfDoc).forEach(token => {
      const termCount = tfDoc[token];
      const dfVal = df[token] || 1;
      // TF = termCount / totalTerms
      const tfVal = totalTerms > 0 ? (termCount / totalTerms) : 0;
      // IDF = ln(N / df)
      const idfVal = dfVal > 0 ? Math.log(N / dfVal) : 0;
      tfidf[token] = tfVal * idfVal;
    });
    return tfidf;
  });

  // Aggregate TF-IDF across all documents (sum) to match the notebook approach (sum over docs)
  const aggregated = {};
  tfidfPerDoc.forEach(tfidf => {
    Object.entries(tfidf).forEach(([token, val]) => {
      aggregated[token] = (aggregated[token] || 0) + val;
    });
  });

  return aggregated;
}
