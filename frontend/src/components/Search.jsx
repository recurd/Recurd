import React from 'react';
import { useState, useRef, useEffect } from 'react';
import SearchInput from './SearchInput';

function Search() {

    const [searchOpen, setSearchOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [buttonHover, setButtonHover] = useState(false);

    const inputRef = useRef(null);

    // We need a short delay before closing due to lost focus to prevent immediately
    // re-opening the search box with the click
    // let timer = null;

    const onLoseFocus = () => {
        setSearchOpen(false);
        //timer = setTimeout(() => setSearchOpen(false), 80);
      };

    useEffect(() => {
        if (searchOpen && inputRef.current) {
            setInputValue("");
            inputRef.current.focus();
        }
    }, [searchOpen]);

    return (
        <div className={`flex justify-end items-center transition-all rounded-full ${searchOpen ? "max-w-[200px] bg-white h-[30px] mr-[5px]" : `max-w-[41px] h-[41px] ${buttonHover ? "bg-white" : ""}`}`}>
            <SearchInput
                myRef={inputRef}
                placeholder="Search..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onLoseFocus={onLoseFocus}
                disabled={!searchOpen}
            />
            <button disabled={searchOpen} onMouseEnter={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)} onMouseUp={() => { setSearchOpen(!searchOpen) }} className={`h-full aspect-square transition-all duration-100 ${searchOpen ? "pr-[8px] absolute scale-[80%] mr-[155px]" : ""}`}>
                {/* Magnifying glass svg */}
                <svg className={`transition-all duration-100 transform ${(buttonHover || searchOpen) ? "scale-[90%] text-[#1D1B20]" : "text-white"}`} viewBox="0 0 41 41" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M33.4833 35.875L22.7208 25.1125C21.8667 25.7958 20.8844 26.3368 19.774 26.7354C18.6635 27.134 17.4819 27.3333 16.2292 27.3333C13.1257 27.3333 10.4991 26.2585 8.34948 24.1089C6.19983 21.9592 5.125 19.3326 5.125 16.2292C5.125 13.1257 6.19983 10.4991 8.34948 8.34948C10.4991 6.19983 13.1257 5.125 16.2292 5.125C19.3326 5.125 21.9592 6.19983 24.1089 8.34948C26.2585 10.4991 27.3333 13.1257 27.3333 16.2292C27.3333 17.4819 27.134 18.6635 26.7354 19.774C26.3368 20.8844 25.7958 21.8667 25.1125 22.7208L35.875 33.4833L33.4833 35.875ZM16.2292 23.9167C18.3646 23.9167 20.1797 23.1693 21.6745 21.6745C23.1693 20.1797 23.9167 18.3646 23.9167 16.2292C23.9167 14.0938 23.1693 12.2786 21.6745 10.7839C20.1797 9.28906 18.3646 8.54167 16.2292 8.54167C14.0938 8.54167 12.2786 9.28906 10.7839 10.7839C9.28906 12.2786 8.54167 14.0938 8.54167 16.2292C8.54167 18.3646 9.28906 20.1797 10.7839 21.6745C12.2786 23.1693 14.0938 23.9167 16.2292 23.9167Z" fill="currentColor" />
                </svg>
            </button>
        </div>
    );
}

export default Search;