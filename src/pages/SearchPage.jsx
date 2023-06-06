import { useCallback } from "react";
import { SearchInput } from "../components/SearchInput"

/*
    This is the main page of the app - it includes the search input centered on the screen
    The main function of this page is to wrap the input (and later potentially other components)
    With the search state and logic needed by them.
*/
const SearchPage = ({loading, setSearchResults, searchResults, worker}) => {
    // Carry out a search - this involves calling the search engine and updating the search state
    const search = useCallback(searchQuery => {
        if(searchQuery) {
            worker.current.postMessage({
                type: 'search',
                text: searchQuery
            });
        } else {
            setSearchResults({suggestions: []});
        }
    }, [ setSearchResults, worker ]);

    // Return either the loading screen, or a page with the search input in the middle
    return (
        loading ?
            <div className="w-full h-full absolute top-0 left-0 bg-gray-200">
                <h2 className="text-2xl mt-12 ml-12">Loading model and precomputed embeddings...</h2>
            </div> : 
            <div className="container mx-auto h-full flex justify-center items-center">
                <SearchInput search={search} searchSuggestions={searchResults.suggestions}/>
            </div>
    );
}

export { SearchPage }
