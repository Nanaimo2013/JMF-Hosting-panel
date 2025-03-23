import React, { useRef } from 'react';
import { Button } from '@/components/elements/button/index';
import { CloudUploadIcon } from '@heroicons/react/outline';
import { ServerContext } from '@/state/server';
import { useNotification } from '@/components/elements/Notification';
import { useUploadProgress, formatFileSize } from '@/theme/hooks';
import styles from '@/theme/style.module.css';
import { WithClassname } from '@/components/types';
import Portal from '@/components/elements/Portal';
import axios from 'axios';
import getFileUploadUrl from '@/api/server/files/getFileUploadUrl';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import JmfConfig from '@/theme/config';
import { useSignal } from '@preact/signals-react';

export default ({ className }: WithClassname) => {
    const fileUploadInput = useRef<HTMLInputElement>(null);
    const visible = useSignal(false);
    const { mutate } = useFileManagerSwr();
    const { success, error } = useNotification();
    const { uploads, updateProgress, removeUpload, clearUploads } = useUploadProgress();

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const directory = ServerContext.useStoreState((state) => state.files.directory);

    const handleFileUpload = async (files: FileList) => {
        // Check if any files are folders (size === 0 and type === '')
        if (Array.from(files).some((file) => !file.size && !file.type)) {
            error('Upload Error', 'Folder uploads are not supported.');
            return;
        }

        // Check file size limits
        if (Array.from(files).some((file) => file.size > JmfConfig.fileManager.maxUploadSize)) {
            error('Upload Error', `Files must be smaller than ${formatFileSize(JmfConfig.fileManager.maxUploadSize)}`);
            return;
        }

        try {
            const url = await getFileUploadUrl(uuid);
            const uploads = Array.from(files).map((file) => {
                const controller = new AbortController();

                return axios.post(
                    url,
                    { files: file },
                    {
                        signal: controller.signal,
                        headers: { 'Content-Type': 'multipart/form-data' },
                        params: { directory },
                        onUploadProgress: (e) => {
                            if (e.total) {
                                updateProgress(file.name, e.loaded, e.total);
                            }
                        },
                    }
                );
            });

            await Promise.all(uploads);
            success('Upload Complete', 'All files have been uploaded successfully.');
            clearUploads();
            mutate();
            visible.value = false;
        } catch (err) {
            console.error('Upload error:', err);
            error('Upload Failed', 'An error occurred while uploading your files.');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        visible.value = false;
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    return (
        <>
            <Portal>
                <div
                    className={styles.upload_overlay}
                    style={{ display: visible.value ? 'block' : 'none' }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <div className={styles.upload_zone}>
                        <div className={styles.upload_zone_content}>
                            <CloudUploadIcon className={styles.upload_icon_large} />
                            <p>Drag and drop files here or click to browse</p>
                            <input
                                type="file"
                                ref={fileUploadInput}
                                className="hidden"
                                multiple
                                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                            />
                            <Button
                                className="mt-4"
                                onClick={() => fileUploadInput.current?.click()}
                            >
                                Choose Files
                            </Button>
                        </div>
                        <div className={styles.upload_list}>
                            {Object.entries(uploads.value).map(([fileName, { loaded, total }]) => (
                                <div key={fileName} className={styles.upload_item}>
                                    <div className={styles.upload_item_info}>
                                        <CloudUploadIcon className="w-5 h-5" />
                                        <div className={styles.upload_item_details}>
                                            <span className={styles.upload_item_name}>{fileName}</span>
                                            <span className={styles.upload_item_size}>
                                                {formatFileSize(loaded)} / {formatFileSize(total)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.upload_item_progress}>
                                        <div className={styles.progress_bar}>
                                            <div
                                                className={styles.progress_bar_value}
                                                style={{ width: `${(loaded / total) * 100}%` }}
                                            />
                                        </div>
                                        <button
                                            className={styles.upload_item_cancel}
                                            onClick={() => removeUpload(fileName)}
                                        >
                                            <span className="sr-only">Cancel</span>
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Portal>
            <Button
                className={className}
                onClick={() => fileUploadInput.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    visible.value = true;
                }}
            >
                Upload
            </Button>
        </>
    );
};
