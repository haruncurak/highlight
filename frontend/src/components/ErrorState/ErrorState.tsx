import { useAuthContext } from '@authentication/AuthContext';
import React, { useState } from 'react';

import { auth } from '../../util/auth';
import { client } from '../../util/graph';
import Button from '../Button/Button/Button';
import ElevatedCard from '../ElevatedCard/ElevatedCard';
import styles from './ErrorState.module.scss';

export const ErrorState = ({
    message,
    errorString,
}: {
    message: string;
    errorString?: string;
}) => {
    const { isLoggedIn } = useAuthContext();
    const [showError, setShowError] = useState(false);
    return (
        <div className={styles.errorWrapper}>
            <ElevatedCard title="Woops, something's wrong!">
                <p className={styles.errorBody}>
                    {message}
                    {errorString !== undefined && (
                        <span
                            className={styles.expandButton}
                            onClick={() => setShowError((t) => !t)}
                        >
                            {showError ? 'show less' : 'show more'}
                        </span>
                    )}
                </p>
                {showError && (
                    <code className={styles.errorBody}>{errorString}</code>
                )}
                <div className={styles.buttonGroup}>
                    {isLoggedIn ? (
                        <>
                            <a href="/">
                                <Button
                                    type="primary"
                                    trackingId="ErrorStateGoToMyAccount"
                                >
                                    Go to my Account
                                </Button>
                            </a>
                            <Button
                                style={{ marginLeft: 10 }}
                                trackingId="ErrorStateLoginAsDifferentUser"
                                onClick={async () => {
                                    try {
                                        auth.signOut();
                                    } catch (e) {
                                        console.log(e);
                                    }
                                    client.cache.reset();
                                }}
                            >
                                Login as a different User
                            </Button>
                        </>
                    ) : (
                        <>
                            <a href="/">
                                <Button
                                    type="primary"
                                    trackingId="ErrorStateSignIn"
                                >
                                    Sign in
                                </Button>
                            </a>
                            <a href="/?sign_up=1">
                                <Button
                                    trackingId="ErrorStateSignUp"
                                    style={{ marginLeft: 10 }}
                                >
                                    Sign up
                                </Button>
                            </a>
                        </>
                    )}
                </div>
            </ElevatedCard>
        </div>
    );
};
