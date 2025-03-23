import React, { memo } from 'react';
import { FileObject } from '@/api/server/files/loadDirectory';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { ServerContext } from '@/state/server';
import { join } from 'path';
import { usePermissions } from '@/plugins/usePermissions';
import { encodePathSegments } from '@/helpers';
import { formatFileSize, getFileIcon } from '@/theme/hooks';
import styles from '@/theme/style.module.css';
import { format, formatDistanceToNow } from 'date-fns';
import FileDropdownMenu from './FileDropdownMenu';
import SelectFileCheckbox from './SelectFileCheckbox';
import classNames from 'classnames';
import isEqual from 'react-fast-compare';

interface Props {
    file: FileObject;
}

const FileObjectRow = ({ file }: Props) => {
    const [canReadContents] = usePermissions(['file.read-content']);
    const [canRead] = usePermissions(['file.read']);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const match = useRouteMatch();

    const isClickable = (file.isFile && canReadContents) || (!file.isFile && canRead);
    const to = `${match.url}${file.isFile ? '/edit' : ''}#${encodePathSegments(join(directory, file.name))}`;

    const FileContent = () => (
        <div className={styles.file_item_content}>
            <i className={classNames('fas', getFileIcon(file.name), styles.file_icon)} />
            <span className={styles.file_name}>{file.name}</span>
            {file.isFile && <span className={styles.file_size}>{formatFileSize(file.size)}</span>}
            <span className={styles.file_date}>
                {file.modifiedAt.getTime() - new Date().getTime() > 48 * 60 * 60 * 1000
                    ? format(file.modifiedAt, 'MMM do, yyyy h:mma')
                    : formatDistanceToNow(file.modifiedAt, { addSuffix: true })}
            </span>
        </div>
    );

    return (
        <div
            className={styles.file_item}
            onContextMenu={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent(`pterodactyl:files:ctx:${file.key}`, { detail: e.clientX }));
            }}
        >
            <SelectFileCheckbox name={file.name} />
            {isClickable ? (
                <NavLink to={to} className={styles.file_item_clickable}>
                    <FileContent />
                </NavLink>
            ) : (
                <FileContent />
            )}
            <FileDropdownMenu file={file} />
        </div>
    );
};

export default memo(FileObjectRow, (prevProps, nextProps) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { isArchiveType, isEditable, ...prevFile } = prevProps.file;
    const { isArchiveType: nextIsArchiveType, isEditable: nextIsEditable, ...nextFile } = nextProps.file;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    return isEqual(prevFile, nextFile);
});
