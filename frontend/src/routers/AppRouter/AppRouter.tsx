import '../../App.scss';

import { useAuthContext } from '@authentication/AuthContext';
import { DEMO_WORKSPACE_PROXY_APPLICATION_ID } from '@components/DemoWorkspaceButton/DemoWorkspaceButton';
import LoginForm from '@pages/Login/Login';
import NewProjectPage from '@pages/NewProject/NewProjectPage';
import { ProjectRedirectionRouter } from '@routers/OrgRouter/OrgRedirectionRouter';
import { WorkspaceRouter } from '@routers/OrgRouter/WorkspaceRouter';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Landing } from '../../pages/Landing/Landing';
import NewMemberPage from '../../pages/NewMember/NewMemberPage';
import InternalRouter from '../InternalRouter/InternalRouter';
import { ProjectRouter } from '../OrgRouter/OrgRouter';
import styles from './AppRouter.module.scss';

export const AppRouter = () => {
    const { isLoggedIn } = useAuthContext();

    return (
        <div className={styles.appBody}>
            <Router>
                <Switch>
                    <Route path="/:project_id(\d+)/invite/:invite_id">
                        <Landing>
                            <NewMemberPage />
                        </Landing>
                    </Route>
                    <Route path="/w/:workspace_id(\d+)/invite/:invite_id">
                        <Landing>
                            <NewMemberPage />
                        </Landing>
                    </Route>
                    <Route path="/new">
                        <Landing>
                            <NewProjectPage />
                        </Landing>
                    </Route>
                    <Route path="/w/:workspace_id(\d+)/new">
                        <Landing>
                            <NewProjectPage />
                        </Landing>
                    </Route>
                    <Route path="/w/:workspace_id(\d+)/switch">
                        <Landing>
                            <NewProjectPage />
                        </Landing>
                    </Route>
                    <Route path="/_internal">
                        <InternalRouter />
                    </Route>
                    <Route path="/:project_id(\d+)">
                        <ProjectRouter />
                    </Route>
                    <Route
                        path={`/:project_id(${DEMO_WORKSPACE_PROXY_APPLICATION_ID})`}
                    >
                        <ProjectRouter />
                    </Route>
                    <Route path="/w/:workspace_id(\d+)/">
                        <WorkspaceRouter />
                    </Route>
                    <Route path="/">
                        {isLoggedIn ? (
                            <ProjectRedirectionRouter />
                        ) : (
                            <LoginForm />
                        )}
                    </Route>
                </Switch>
            </Router>
        </div>
    );
};
