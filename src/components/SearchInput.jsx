import { useEffect, useState } from 'react';
import logo from '../assets/logo.gif';
import { ThreeDots } from 'react-loading-icons';
import { useClickAnyWhere, useDebounce } from 'usehooks-ts';
import { dataset } from "../assets/dataset";

/*
    This component includes both the search box and the suggestions that are supplied for it
    search is a callback which is called whenever the search input changes, and searchSuggestions is a list
    of strings which will be displayed as suggestions.
*/
const SearchInput = ({search, searchSuggestions}) => {
    const [searchValue, setSearchValue] = useState("");

    // Use a 200ms debounce time for the searches to prevent overloading the worker
    const searchQuery = useDebounce(searchValue, 200);

    useEffect(() => search(searchQuery), [ search, searchQuery ]);

    // Clear out the searched value when the element is clicked off
    useClickAnyWhere(() => setSearchValue(""));

    return (
        <label className="p-2 rounded-md bg-white shadow-xl w-5/6 md:w-3/5 max-w-[1280px]">
            {/* Row containing the search icon and input */}
            <div className="flex items-center">
                <img src={logo} alt="" className="w-8 h-8 mx-1"/>
                <input type="search" value={searchValue} onInput={e => setSearchValue(e.target.value)} className="p-2 w-full outline-none" autoFocus></input>
            </div>

            {/* List of search suggestions - the container's max height is animated for a smoother transition */}
            {(searchQuery === searchValue) && searchQuery ?
                <ul className={"flex flex-col h-fit overflow-y-auto transition-[max-height] duration-200" + (searchSuggestions.length > 0 ? "max-h-64 p-1" : "max-h-0")}>
                    {searchSuggestions.map((suggestion, i) =>
                        <li className="overflow-x-hidden" key={i}>
                            <button className="p-3 leading-4 w-full hover:bg-gray-300 text-left whitespace-nowrap text-ellipsis" onClick={() => alert(`Selected: ${suggestion}`)}>
                                &#128211; {dataset[suggestion].text}
                            </button>
                        </li>
                    )}
                </ul> :
                searchValue && <ThreeDots stroke='grey' fill='grey' strokeOpacity={1} fillOpacity={1} className='mx-auto my-10'/>
            }
        </label>
    );
}

export { SearchInput }
