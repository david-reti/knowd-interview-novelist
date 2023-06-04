import logo from '../assets/logo.gif';

const SearchInput = ({query, search, searchSuggestions}) => {
    return (
        <label className="p-2 rounded-md bg-white shadow-xl w-5/6 md:w-3/5 max-w-[1280px]">
            <div className="flex items-center">
                <img src={logo} alt="" className="w-8 h-8 mx-1"/>
                <input type="search" onInput={e => search(e.target.value)} className="p-2 w-full outline-none" autoFocus></input>
            </div>

            <div className={"flex flex-col h-fit overflow-y-auto transition-[max-height] duration-200 " + (searchSuggestions.length > 0 ? "max-h-64 p-1" : "max-h-0")}>
                {searchSuggestions.map((suggestion, i) =>
                    <button key={i} className="p-3 w-ful hover:bg-gray-300 text-left whitespace-nowrap overflow-x-hidden text-ellipsis" onClick={() => alert(`Selected: ${suggestion}`)}>
                        &#128211; {suggestion}
                    </button>
                )}
            </div>
        </label>
    )
}

export { SearchInput }
