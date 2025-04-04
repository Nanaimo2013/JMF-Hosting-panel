import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

interface Props {
    $hoverable?: boolean;
}

const StyledGreyRowBox = styled.div<Props>`
    ${tw`flex rounded no-underline text-neutral-200 items-center bg-neutral-700 p-3 transition-colors duration-150`};
    
    ${props => props.$hoverable !== false && tw`hover:bg-neutral-600`};
`;

const GreyRowBox: React.FC<PropsWithChildren<Props & React.HTMLAttributes<HTMLDivElement>>> = ({ children, ...props }) => (
    <StyledGreyRowBox {...props}>{children}</StyledGreyRowBox>
);

export default GreyRowBox;
