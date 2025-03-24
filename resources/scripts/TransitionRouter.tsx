import React from 'react';
import { Route, useLocation } from 'react-router-dom';
import { SwitchTransition } from 'react-transition-group';
import styled from 'styled-components';
import Fade from '@/components/elements/Fade';
import tw from 'twin.macro';

const StyledTransitionWrapper = styled.div`
    ${tw`relative`};

    & section {
        ${tw`relative w-full`};
    }
`;

const TransitionRouter: React.FC = ({ children }) => {
    const location = useLocation();

    return (
        <StyledTransitionWrapper>
            <SwitchTransition>
                <Fade timeout={150} key={location.pathname + location.search} in appear unmountOnExit>
                    <section>{children}</section>
                </Fade>
            </SwitchTransition>
        </StyledTransitionWrapper>
    );
};

export default TransitionRouter;
