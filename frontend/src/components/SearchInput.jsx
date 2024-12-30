import { useEditable } from '@chakra-ui/react';
import React, { useEffect } from 'react';

function SearchInput({ myRef, placeholder, value, onChange, onLoseFocus, onSubmit }) {
  
  return (
    <form onSubmit={onSubmit} className="p-0 m-0 w-full h-full inline-flex items-center">
      <input
        ref={myRef}
        type="text"
        name="search_query"
        className="w-[100%] h-[80%] text-[50%] pl-[32px] rounded-full bg-none bg-transparent focus:outline-none"
        placeholder={placeholder}
        onBlur={onLoseFocus}
        value={value}
        onChange={onChange}
      />
    </form>
  );
}

export default SearchInput;