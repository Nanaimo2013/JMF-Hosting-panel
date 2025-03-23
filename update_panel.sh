#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Applying Panel Changes...${NC}"

# Directory where your panel is installed
PANEL_DIR="/var/www/pterodactyl"

# Pull latest changes from your GitHub repository
echo "Pulling latest changes..."
cd $PANEL_DIR
git stash
git pull origin main

# Clear cache
echo "Clearing cache..."
php artisan view:clear
php artisan config:clear
php artisan cache:clear

# Build assets
echo "Building assets..."
yarn install
yarn build:production

# Fix permissions
echo "Fixing permissions..."
chown -R www-data:www-data $PANEL_DIR/*
find $PANEL_DIR -type f -exec chmod 644 {} \;
find $PANEL_DIR -type d -exec chmod 755 {} \;

# Restart services
echo "Restarting services..."
systemctl restart php8.1-fpm
systemctl restart nginx

echo -e "${GREEN}Changes applied successfully!${NC}" 