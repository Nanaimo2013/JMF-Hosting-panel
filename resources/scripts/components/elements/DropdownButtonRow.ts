import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

interface Props {
    danger?: boolean;
    children?: React.ReactNode;
}

const DropdownButtonRow = styled.button<Props>`
    ${tw`p-2 w-full text-left transition-colors duration-150 hover:bg-neutral-600 disabled:hover:bg-neutral-700 disabled:cursor-not-allowed`};
    
    ${props => props.danger && tw`hover:bg-red-600 hover:text-red-50`};
`;

export default DropdownButtonRow; 