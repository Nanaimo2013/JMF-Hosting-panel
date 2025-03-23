#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Setting up Pterodactyl Panel Development Environment...${NC}"

# Directory where your panel is installed
PANEL_DIR="/var/www/pterodactyl"
DEV_DIR="./panel-dev"

# Create development directory if it doesn't exist
mkdir -p $DEV_DIR

# Clone panel if not already cloned
if [ ! -d "$DEV_DIR/.git" ]; then
    echo "Cloning Pterodactyl Panel..."
    git clone https://github.com/pterodactyl/panel.git $DEV_DIR
fi

cd $DEV_DIR

# Create development branch
BRANCH_NAME="jmf-customization-$(date +%Y%m%d)"
git checkout -b $BRANCH_NAME

# Install dependencies
echo "Installing dependencies..."
composer install
yarn install

# Copy environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    # Generate application key
    php artisan key:generate
fi

# Build assets for development
echo "Building assets..."
yarn build:development

# Watch for changes (in background)
echo "Starting asset watcher..."
yarn watch &

echo -e "${GREEN}Development environment is ready!${NC}"
echo -e "Your development branch is: ${BRANCH_NAME}"
echo -e "\nTo customize the panel:"
echo -e "1. Edit files in ${DEV_DIR}/resources/scripts/components for React components"
echo -e "2. Edit files in ${DEV_DIR}/resources/scripts/styles for styling"
echo -e "3. Changes will automatically rebuild"
echo -e "4. Test your changes at http://localhost:8080"
echo -e "\nTo apply changes to production:"
echo -e "1. Stop the watcher with: kill %1"
echo -e "2. Build production assets: yarn build:production"
echo -e "3. Commit your changes"
echo -e "4. Push to your repository" 