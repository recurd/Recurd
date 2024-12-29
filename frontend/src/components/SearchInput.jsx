import { useEditable } from '@chakra-ui/react';
import React, { useEffect } from 'react';

function SearchInput({ myRef, placeholder, value, onChange, onLoseFocus }) {
  
  return (
    <input
      ref={myRef}
      type="text"
      className="w-[100%] h-[80%] text-[50%] pl-[32px] rounded-full bg-none bg-transparent focus:outline-none"
      placeholder={placeholder}
      onBlur={onLoseFocus}
      value={value}
      onChange={onChange}
    />
  );
}

export default SearchInput;