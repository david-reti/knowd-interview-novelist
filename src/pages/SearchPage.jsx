import { useState } from "react"
import { SearchInput } from "../components/SearchInput"
import {Engine, Search} from "../search-engine/search-engine";
import {Stripe, Gmail, Alexa} from "../assets/dataset";

const dataset = [...Stripe, ...Gmail, ...Alexa].map((text) => ({text}));
const engine = Engine(dataset);

/*
    This is the main page of the app - it includes the search input centered on the screen
    The main function of this page is to wrap the input (and later potentially other components)
    With the search state and logic needed by them.
*/
const SearchPage = () => {
    const [searchResults, setSearchResults] = useState({query: "", suggestions: []});

    // Carry out a search - this involves calling the search engine and updating the search state
    const search = searchQuery => {
        setSearchResults(() => {
            const searchResults = Search(engine, searchQuery).map((item) => dataset[item[0]].text);
            return {query: searchQuery, suggestions: searchResults};
        });
    }

    return (
        <div className="container h-full flex justify-center items-center">
            <SearchInput query={searchResults.query} search={search} searchSuggestions={searchResults.suggestions}/>
        </div>
    )
}

export { SearchPage }
