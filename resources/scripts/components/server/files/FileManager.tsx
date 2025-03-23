import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { Button } from '@/components/elements/button/index';
import { SearchIcon } from '@heroicons/react/solid';
import { ViewListIcon, ViewGridIcon } from '@heroicons/react/outline';
import FileManagerBreadcrumbs from './FileManagerBreadcrumbs';
import NewDirectoryButton from './NewDirectoryButton';
import UploadButton from './UploadButton';
import FileManagerStatus from './FileManagerStatus';
import FileObjectRow from './FileObjectRow';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import { useNotification } from '@/components/elements/Notification';
import { usePermissions } from '@/plugins/usePermissions';
import Can from '@/components/elements/Can';
import styles from '@/theme/style.module.css';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { useFileManagerView } from '@/theme/hooks';
import tw from 'twin.macro';

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { data: files, mutate } = useFileManagerSwr();
    const [searchTerm, setSearchTerm] = useState('');
    const [canCreate] = usePermissions(['file.create']);
    const [canRead] = usePermissions(['file.read']);
    const [canDelete] = usePermissions(['file.delete']);
    const [canMove] = usePermissions(['file.move']);
    const [canArchive] = usePermissions(['file.archive']);
    const [canUpload] = usePermissions(['file.create']);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const { success, error } = useNotification();
    const { isGridView, toggleView } = useFileManagerView();

    const setSelectedFiles = ServerContext.useStoreActions((actions) => actions.files.setSelectedFiles);
    const selectedFiles = ServerContext.useStoreState((state) => state.files.selectedFiles);

    useEffect(() => {
        return () => {
            setSelectedFiles([]);
        };
    }, [directory]);

    const onSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.currentTarget.checked && files ? files.map((file) => file.name) : []);
    };

    const filteredFiles = files?.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.file_manager}>
            <div className={styles.file_manager_header}>
                <div className={styles.search_container}>
                    <SearchIcon className={styles.search_icon} />
                    <input
                        type="text"
                        className={styles.search_input}
                        placeholder="Search files and folders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.file_manager_actions}>
                    <Button.Text
                        className="btn-icon tooltip"
                        data-tooltip={isGridView.value ? 'List View' : 'Grid View'}
                        onClick={toggleView}
                    >
                        {isGridView.value ? <ViewListIcon className="w-5 h-5" /> : <ViewGridIcon className="w-5 h-5" />}
                    </Button.Text>
                    {canMove && selectedFiles.length > 0 && (
                        <Button className="btn-accent">
                            <i className="fas fa-arrows-alt" />
                            <span>Move Selected</span>
                        </Button>
                    )}
                    <Can action={'file.create'}>
                        <NewDirectoryButton />
                        <NavLink to={`/server/${uuid}/files/new${window.location.hash}`}>
                            <Button>New File</Button>
                        </NavLink>
                    </Can>
                    <Can action={'file.create'}>
                        <UploadButton />
                    </Can>
                </div>
            </div>

            <FileManagerBreadcrumbs
                renderLeft={
                    <input
                        type="checkbox"
                        css={tw`mx-4`}
                        checked={selectedFiles.length === (files?.length === 0 ? -1 : files?.length)}
                        onChange={onSelectAllClick}
                    />
                }
            />

            <div
                className={classNames(styles.file_grid, {
                    [styles.file_grid_list]: !isGridView.value,
                })}
            >
                {!files?.length ? (
                    <p css={tw`text-sm text-neutral-400 text-center`}>This directory seems to be empty.</p>
                ) : (
                    filteredFiles?.map((file) => (
                        <FileObjectRow key={file.key} file={file} />
                    ))
                )}
            </div>

            <FileManagerStatus />
        </div>
    );
}; 