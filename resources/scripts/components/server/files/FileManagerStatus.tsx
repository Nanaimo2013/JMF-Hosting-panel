import React, { MouseEvent } from 'react';
import { ServerContext } from '@/state/server';
import { useSignal } from '@preact/signals-react';
import { CloudUploadIcon } from '@heroicons/react/outline';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import styles from '@/theme/style.module.css';
import { formatFileSize } from '@/theme/hooks';
import classNames from 'classnames';

const FileUploadList = () => {
    const uploads = ServerContext.useStoreState((state) =>
        Object.entries(state.files.uploads).sort(([a], [b]) => a.localeCompare(b))
    );
    const cancelFileUpload = ServerContext.useStoreActions((actions) => actions.files.cancelFileUpload);
    const clearFileUploads = ServerContext.useStoreActions((actions) => actions.files.clearFileUploads);

    return (
        <div className={styles.upload_list_dialog}>
            {uploads.map(([name, file]) => (
                <div key={name} className={styles.upload_item}>
                    <div className={styles.upload_item_info}>
                        <CloudUploadIcon className={styles.upload_icon} />
                        <div className={styles.upload_item_details}>
                            <span className={styles.upload_item_name}>{name}</span>
                            <span className={styles.upload_item_size}>
                                {formatFileSize(file.loaded)} / {formatFileSize(file.total)}
                            </span>
                        </div>
                    </div>
                    <div className={styles.upload_item_progress}>
                        <div className={styles.progress_bar}>
                            <div
                                className={styles.progress_bar_value}
                                style={{ width: `${(file.loaded / file.total) * 100}%` }}
                            />
                        </div>
                        <button
                            className={styles.upload_item_cancel}
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.preventDefault();
                                cancelFileUpload(name);
                            }}
                        >
                            <span className="sr-only">Cancel</span>
                            ×
                        </button>
                    </div>
                </div>
            ))}
            <Dialog.Footer>
                <Button.Danger variant={Button.Variants.Secondary} onClick={clearFileUploads}>
                    Cancel All
                </Button.Danger>
                <Button.Text>Close</Button.Text>
            </Dialog.Footer>
        </div>
    );
};

export default () => {
    const count = ServerContext.useStoreState((state) => Object.keys(state.files.uploads).length);
    const progress = ServerContext.useStoreState((state) => ({
        uploaded: Object.values(state.files.uploads).reduce((count, file) => count + file.loaded, 0),
        total: Object.values(state.files.uploads).reduce((count, file) => count + file.total, 0),
    }));
    const showDialog = useSignal(false);

    if (count === 0) {
        return null;
    }

    return (
        <>
            <button
                className={styles.upload_status_button}
                onClick={() => (showDialog.value = true)}
            >
                <div className={styles.upload_status_progress}>
                    <div
                        className={styles.upload_status_bar}
                        style={{ width: `${(progress.uploaded / progress.total) * 100}%` }}
                    />
                </div>
                <CloudUploadIcon className={styles.upload_status_icon} />
                <span className={styles.upload_status_count}>{count} files uploading</span>
            </button>
            <Dialog
                open={showDialog.value}
                onClose={() => (showDialog.value = false)}
                title="File Uploads"
                description="The following files are being uploaded to your server."
            >
                <FileUploadList />
            </Dialog>
        </>
    );
};
