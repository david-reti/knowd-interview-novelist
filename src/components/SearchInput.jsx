import logo from '../assets/logo.gif';

/*
    This component includes both the search box and the suggestions that are supplied for it
    search is a callback which is called whenever the search input changes, and searchSuggestions is a list
    of strings which will be displayed as suggestions.
*/
const SearchInput = ({query, search, searchSuggestions}) => {
    return (
        <label className="p-2 rounded-md bg-white shadow-xl w-5/6 md:w-3/5 max-w-[1280px]">
            {/* Row containing the search icon and input */}
            <div className="flex items-center">
                <img src={logo} alt="" className="w-8 h-8 mx-1"/>
                <input type="search" value={query} onInput={e => search(e.target.value)} className="p-2 w-full outline-none" autoFocus></input>
            </div>

            {/* List of search suggestions - the container's max height is animated for a smoother transition */}
            <ul className={"flex flex-col h-fit overflow-y-auto transition-[max-height] duration-200 " + (searchSuggestions.length > 0 ? "max-h-64 p-1" : "max-h-0")}>
                {searchSuggestions.map((suggestion, i) =>
                    <li className="overflow-x-clip" key={i}>
                        <button className="p-3 leading-4 w-ful hover:bg-gray-300 text-left whitespace-nowrap text-ellipsis" onClick={() => alert(`Selected: ${suggestion}`)}>
                            &#128211; {suggestion}
                        </button>
                    </li>
                )}
            </ul>
        </label>
    );
}

export { SearchInput }
