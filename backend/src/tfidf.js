// TF-IDF calculation
import { preprocess } from "./preprocess.js";

export function computeTFIDF(docs) {
  // docs: array of strings (preprocessed)
  const tf = [];
  const df = {};
  const N = docs.length;
  // Calculate term frequency (TF) and document frequency (DF)
  docs.forEach(doc => {
    const tokens = preprocess(doc);
    const tfDoc = {};
    tokens.forEach(token => {
      tfDoc[token] = (tfDoc[token] || 0) + 1;
      df[token] = (df[token] || 0) + 1;
    });
    tf.push(tfDoc);
  });
  // Calculate TF-IDF
  const tfidfDocs = tf.map(tfDoc => {
    const tfidf = {};
    Object.keys(tfDoc).forEach(token => {
      const tfVal = tfDoc[token];
      const idfVal = Math.log(N / (df[token] || 1));
      tfidf[token] = tfVal * idfVal;
    });
    return tfidf;
  });
  // Aggregate TF-IDF for all docs
  const tfidfTotal = {};
  tfidfDocs.forEach(tfidf => {
    Object.entries(tfidf).forEach(([token, val]) => {
      tfidfTotal[token] = (tfidfTotal[token] || 0) + val;
    });
  });
  return tfidfTotal;
}
