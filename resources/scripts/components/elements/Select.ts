import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

interface Props {
    hideDropdownArrow?: boolean;
    children?: React.ReactNode;
}

const Select = styled.select<Props>`
    ${tw`block w-full p-2 bg-neutral-700 border-2 border-neutral-600 rounded text-sm text-neutral-200 appearance-none hover:border-neutral-500 transition-colors duration-150`};
    
    &:not(:disabled) {
        ${tw`cursor-pointer hover:border-neutral-500`};
    }
    
    &:disabled {
        ${tw`cursor-not-allowed opacity-50`};
    }
    
    ${props => !props.hideDropdownArrow && tw`pr-8`};
    
    & + .arrow {
        ${tw`absolute right-0 mr-2 text-neutral-300`};
        top: 50%;
        transform: translateY(-50%);
        
        ${props => props.hideDropdownArrow && tw`hidden`};
    }
`;

export default Select; 