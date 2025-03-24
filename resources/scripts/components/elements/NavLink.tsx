import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';

interface Props extends LinkProps {
    children?: React.ReactNode;
}

const StyledLink = styled(Link)`
    ${tw`text-neutral-300 transition-colors duration-150 hover:text-neutral-100`};
`;

const NavLink: React.FC<Props> = ({ children, ...props }) => (
    <StyledLink {...props}>{children}</StyledLink>
);

export default NavLink; 