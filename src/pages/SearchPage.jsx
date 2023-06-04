import { useState } from "react"
import { SearchInput } from "../components/SearchInput"
import {Engine, Search} from "../search-engine/search-engine";
import {Stripe, Gmail, Alexa} from "../assets/dataset";

const dataset = [...Stripe, ...Gmail, ...Alexa].map((text) => ({text}));
const engine = Engine(dataset);

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const search = searchQuery => {
        setQuery(() => {
            setSuggestions(Search(engine, searchQuery).map((item) => dataset[item[0]].text));
            return searchQuery;
        });
    }

    return (
        <div className="container h-full flex justify-center items-center">
            <SearchInput query={query} search={search} searchSuggestions={suggestions}/>
        </div>
    )
}

export { SearchPage }
