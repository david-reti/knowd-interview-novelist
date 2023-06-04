// Source: https://www.npmjs.com/package/wink-bm25-text-search
// BM25 is a popular lexical search algorithm for sparse retrieval

const bm25 = require("wink-bm25-text-search");
const winkNLP = require("wink-nlp");
const model = require("wink-eng-lite-web-model");
const nlp = winkNLP(model);
const its = nlp.its;

const prepTask = function (text) {
  const tokens = [];
  nlp
    .readDoc(text)
    .tokens()
    // Use only words ignoring punctuations etc and from them remove stop words
    .filter((t) => t.out(its.type) === "word" && !t.out(its.stopWordFlag))
    // Handle negation and extract stem of the word
    .each((t) =>
      tokens.push(
        t.out(its.negationFlag) ? "!" + t.out(its.stem) : t.out(its.stem)
      )
    );

  return tokens;
};

// Initialize the search engine
export const Engine = (docs) => {
  const BM25Engine = bm25();
  BM25Engine.defineConfig({ fldWeights: { text: 1 } });

  BM25Engine.definePrepTasks([prepTask]);

  docs.forEach(function (doc, i) {
    // Note, 'i' becomes the unique id for 'doc'
    BM25Engine.addDoc(doc, i);
  });

  BM25Engine.consolidate();

  return BM25Engine;
};

// Provide a search function
export const Search = (engine, query) => {
  // return the top 100 results
  const results = engine.search(query, 100);
  return results;
};
