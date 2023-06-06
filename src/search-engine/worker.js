import { HNSW } from "hnsw";
import { AutoModel, AutoTokenizer, env } from "@xenova/transformers";

// The built-in cache seems to be buggy - it often corrupts or raises security errors
env.useBrowserCache = false;

let embeddings = [];
const hnsw = new HNSW();

// The quantized version of instructor-large is included in this repo
const model = await AutoModel.from_pretrained('hkunlp/instructor-large', { quantized: true });
const tokenizer = await AutoTokenizer.from_pretrained('hkunlp/instructor-large', { quantized: true });

// Run the tokenizer and model on a given text, then return the last hidden state
const embed = async text => {
    let inputs = await tokenizer(text);
    let { last_hidden_state } = await model(inputs);
    last_hidden_state = last_hidden_state.sum(1);
    return last_hidden_state;
}

self.addEventListener('message', async e => {
    switch(e.data.type) {
        // When the embeddings are loaded from a file, the float value are split into chunks and matched with the dataset
        case 'load_embeddings':
            // Split the array into chunks of 1024 elements, one for each key in the dataset
            const floats = e.data.embeddings.reduce((all, one, i) => {
                const ch = Math.floor(i / 1024); 
                all[ch] = [].concat((all[ch] || []), one); 
                return all;
            }, []);
             
            // Assemble the embeddings from the chunks of float values and the corresponding key
            embeddings = e.data.dataset.map((_, i) => ({id: i, vector: floats[i]}));
            await hnsw.buildIndex(embeddings);

            self.postMessage({
                type: 'complete',
                embeddings: embeddings
            });
            break;
        // When the dataset is being indexed, all the embeddings are generated then sent to the main thread to allow them to be downloaded 
        case 'index':
            let i = 0;
            for(const item of e.data.items) { 
                const vector = await embed(item.text);
                
                i++;
                embeddings.push({id: i, vector: vector.data});
                console.log(`Generating embeddings: ${i * 100 / e.data.items.length}%`);
            }
           
            await hnsw.buildIndex(embeddings);

            self.postMessage({
                type: 'complete',
                embeddings: embeddings
            });
            break;
        // When a search is carried out, generate the embedding for the query, then get the 10 nearest neighbours
        case 'search':
            const vector = await embed(e.data.text);
            let results = hnsw.searchKNN(vector.data, 10);
            
            // Sort results based on score, highest to lowest
            results.sort((a, b) => b.score - a.score);

            self.postMessage({
                type: 'search_results',
                query: e.data.text,
                results: results,
            });
            break;
        default:
            break;
    }
});
    
// Indicate that the worker is ready to start accepting queries
self.postMessage({
    type: 'ready'
});    
