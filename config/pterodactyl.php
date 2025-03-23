<?php

return [
    /*
    |--------------------------------------------------------------------------
    | File Manager Settings
    |--------------------------------------------------------------------------
    */
    'files' => [
        // Increase maximum files to display (default is 250)
        'max_files_per_directory' => 1000,
        
        // Maximum file size for the file manager in MB
        'max_upload_size' => 100,
        
        // Enable better file browsing features
        'enhanced_browsing' => true,
        
        // Cache file listings to improve performance
        'cache_listings' => true,
        'cache_time' => 300, // 5 minutes
        
        // Allowed file upload extensions
        'allowed_upload_types' => [
            'application/json',
            'text/plain',
            'image/jpeg',
            'image/png',
            'application/zip',
            'application/x-7z-compressed',
            'application/x-rar-compressed',
            'application/x-tar',
            'application/x-gzip',
        ],
    ],
]; 