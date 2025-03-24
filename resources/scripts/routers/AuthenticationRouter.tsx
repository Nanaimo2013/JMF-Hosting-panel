import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginCheckpointContainer from '@/components/auth/LoginCheckpointContainer';
import ForgotPasswordContainer from '@/components/auth/ForgotPasswordContainer';
import ResetPasswordContainer from '@/components/auth/ResetPasswordContainer';
import { NotFound } from '@/components/elements/ScreenBlock';

const AuthenticationRouter: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-8 xl:pt-32">
            <Routes>
                <Route path="/auth/login" element={<LoginContainer />} />
                <Route path="/auth/login/checkpoint" element={<LoginCheckpointContainer />} />
                <Route path="/auth/password" element={<ForgotPasswordContainer />} />
                <Route path="/auth/password/reset/:token" element={<ResetPasswordContainer />} />
                <Route path="/auth/checkpoint" element={<></>} />
                <Route path="*" element={<NotFound onBack={() => navigate('/auth/login')} />} />
            </Routes>
        </div>
    );
};

export default AuthenticationRouter;
