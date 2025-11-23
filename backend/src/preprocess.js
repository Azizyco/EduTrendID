// Preprocessing: Case folding, filtering, tokenization, stemming
import stopword from "stopword";
import { Stemmer } from "sastrawijs";

const stemmer = new Stemmer();

export function preprocess(text) {
  // Case folding
  let result = text.toLowerCase();
  // Filtering (remove non-alphabetic)
  result = result.replace(/[^a-zA-Z\s]/g, " ");
  // Tokenization
  let tokens = result.split(/\s+/).filter(Boolean);
  // Stopword removal
  tokens = stopword.removeStopwords(tokens, stopword.id);
  // Stemming
  tokens = tokens.map(token => stemmer.stem(token));
  // Additional filtering: remove very short tokens and known noise words
  const extraStop = new Set(["advertisement", "google", "news", "cek", "pt", "tbk"]);
  tokens = tokens.filter(t => t.length > 1 && !extraStop.has(t));
  return tokens;
}
