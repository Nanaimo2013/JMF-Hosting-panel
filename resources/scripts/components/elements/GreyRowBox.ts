import styled from 'styled-components';
import tw from 'twin.macro';

interface Props {
    $hoverable?: boolean;
}

const GreyRowBox = styled.div<Props>`
    ${tw`flex rounded no-underline text-neutral-200 items-center bg-neutral-700 p-3 transition-colors duration-150`};
    
    ${props => props.$hoverable !== false && tw`hover:bg-neutral-600`};
`;

export default GreyRowBox; 