import { useState } from "react"
import { SearchInput } from "../components/SearchInput"
import {Engine, Search} from "../search-engine/search-engine";
// const engine = Engine(dataset);

/*
    This is the main page of the app - it includes the search input centered on the screen
    The main function of this page is to wrap the input (and later potentially other components)
    With the search state and logic needed by them.
*/
const SearchPage = ({loading, searchResults, setSearchResults, worker}) => {
    // Carry out a search - this involves calling the search engine and updating the search state
    const search = searchQuery => {
        worker.current.postMessage({
            type: 'search',
            text: searchQuery
        });
    }

    // if(loading < 99) {
    //     return (       
    //         <div className="w-full h-full absolute top-0 left-0 bg-gray-200">
    //             <h2>Loading model "instructor-large"... {loading}%</h2>
    //         </div>
    //     ); 
    // }
      
    return (
        <div className="container mx-auto h-full flex justify-center items-center">
            <SearchInput search={search} searchSuggestions={searchResults.suggestions}/>
        </div>
    )
}

export { SearchPage }
