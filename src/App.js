import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchPage } from './pages/SearchPage';
import { saveAs } from "file-saver";
import { dataset } from "./assets/dataset";

// If this is true, then all the vectors will be generated from scratch and downloaded in a file
// Otherwise, pre-computed vectors will be fetched which is faster. 
const GENERATE_EMBEDDINGS = false; 

const App = () => {
    const worker = useRef(null);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState({suggestions: []});

    const handleWorkerEvents = useCallback(e => {
        switch(e.data.type) {
            // When the worker has finished loading the model and tokeniser, load the precomputed vectors or generate the embeddings from the dataset
            case 'ready':
                if(GENERATE_EMBEDDINGS) {
                    // Send the dataset to the worker, if it needs to be computed
                    worker.current.postMessage({
                        type: 'index',
                        items: dataset
                    });
                } else {
                    // Otherwise fetch the precomputed embeddings from the corresponding file
                    fetch('embeddings.dat')
                    .then(async value => {
                        const blob = await value.blob();
                        const buffer = await blob.arrayBuffer();
                        
                        worker.current.postMessage({
                            type: 'load_embeddings',
                            embeddings: new Float32Array(buffer),
                            dataset: dataset
                        });
                    })
                    .catch(_ => {
                        alert('Could not load embeddings, please reload the page to try again.');
                    });
                }
                break;
            // When search results come in, update the state which is reflected on the search page
            case 'search_results':
                setSearchResults({
                    suggestions: e.data.results.map(result => result.id)
                });
                break;
            // When all the embeddings have been generated, download them as a binary file
            case 'complete':
                setLoading(false);
                if(GENERATE_EMBEDDINGS) {
                    saveAs(new Blob(e.data.embeddings.map(embedding => embedding.vector)), "embeddings.dat");
                }
                break;
            default:
                break;
        } 
    }, []);

    // Create the worker for generating embeddings once the page loads
    useEffect(() => {
        if(!worker.current) {
            worker.current = new Worker(new URL('./search-engine/worker.js', import.meta.url), {
                type: 'module'
            });
        }

        worker.current.addEventListener('message', handleWorkerEvents);
    }, [handleWorkerEvents]);

    return (
        <div className="w-screen h-screen bg-gray-200">
            <SearchPage loading={loading} searchResults={searchResults} setSearchResults={setSearchResults} worker={worker}/>
            <p className="absolute bottom-2 right-2 text-gray-600">Knowd Technical Interview - David Reti</p>
        </div>
    );
}

export default App;
