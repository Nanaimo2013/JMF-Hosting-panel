import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { NavLink, useLocation } from 'react-router-dom';
import { encodePathSegments, hashToPath } from '@/helpers';
import styles from '@/theme/style.module.css';
import { HomeIcon } from '@heroicons/react/solid';
import classNames from 'classnames';

interface Props {
    renderLeft?: JSX.Element;
    withinFileEditor?: boolean;
    isNewFile?: boolean;
}

export default ({ renderLeft, withinFileEditor, isNewFile }: Props) => {
    const [file, setFile] = useState<string | null>(null);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const { hash } = useLocation();

    useEffect(() => {
        const path = hashToPath(hash);
        if (withinFileEditor && !isNewFile) {
            const name = path.split('/').pop() || null;
            setFile(name);
        }
    }, [withinFileEditor, isNewFile, hash]);

    const breadcrumbs = (): { name: string; path?: string }[] =>
        directory
            .split('/')
            .filter((directory) => !!directory)
            .map((directory, index, dirs) => {
                if (!withinFileEditor && index === dirs.length - 1) {
                    return { name: directory };
                }
                return { name: directory, path: `/${dirs.slice(0, index + 1).join('/')}` };
            });

    return (
        <div className={styles.breadcrumbs}>
            {renderLeft}
            <div className={styles.breadcrumb_container}>
                <NavLink
                    to={`/server/${id}/files`}
                    className={styles.breadcrumb_link}
                >
                    <HomeIcon className={styles.breadcrumb_icon} />
                    <span>home</span>
                </NavLink>
                <span className={styles.breadcrumb_separator}>/</span>
                <NavLink
                    to={`/server/${id}/files`}
                    className={styles.breadcrumb_link}
                >
                    container
                </NavLink>
                {breadcrumbs().map((crumb, index) => (
                    <React.Fragment key={index}>
                        <span className={styles.breadcrumb_separator}>/</span>
                        {crumb.path ? (
                            <NavLink
                                to={`/server/${id}/files#${encodePathSegments(crumb.path)}`}
                                className={styles.breadcrumb_link}
                            >
                                {crumb.name}
                            </NavLink>
                        ) : (
                            <span className={styles.breadcrumb_current}>{crumb.name}</span>
                        )}
                    </React.Fragment>
                ))}
                {file && (
                    <>
                        <span className={styles.breadcrumb_separator}>/</span>
                        <span className={styles.breadcrumb_current}>{file}</span>
                    </>
                )}
            </div>
        </div>
    );
};
