#!/bin/bash

set -e

REPO_NAME="WebSolow"
REPO_DIR="$HOME/$REPO_NAME"
NGINX_DIR="/etc/nginx"
NGINX_SITES_AVAILABLE="$NGINX_DIR/sites-available"
NGINX_SITES_ENABLED="$NGINX_DIR/sites-enabled"
FRONTEND_DIR="/var/www/crazy-barbarian.org"

# create backup dirs
mkdir -p "$HOME/config_backup/etc/nginx"
mkdir -p "$HOME/config_backup/var/www/crazy-barbarian.org"

BACKUP_NGINX_DIR="$HOME/config_backup/etc/nginx"
BACKUP_FRONTEND_DIR="$HOME/config_backup/var/www/crazy-barbarian.org"

# backup old configs if exists
if [ -f "$NGINX_DIR/nginx.conf" ]; then
    mv -f "$NGINX_DIR/nginx.conf" "$BACKUP_NGINX_DIR/" 2>/dev/null || true
fi

if [ -d "$NGINX_SITES_AVAILABLE" ]; then
    mv -f "$NGINX_SITES_AVAILABLE" "$BACKUP_NGINX_DIR/" 2>/dev/null || true
fi

# backup old frontend if exists
if [ -d "$FRONTEND_DIR" ]; then
    mv -f "$FRONTEND_DIR"/* "$BACKUP_FRONTEND_DIR/" 2>/dev/null || true
fi

# remove files from sites-enabled
rm -f "$NGINX_SITES_ENABLED"/* 2>/dev/null || true

mkdir -p "$NGINX_SITES_AVAILABLE"
mkdir -p "$FRONTEND_DIR/WebSolow"

# copy nginx configs
if [ -f "$REPO_DIR/deploy/nginx.conf" ]; then
    cp -f "$REPO_DIR/deploy/nginx.conf" "$NGINX_DIR/"
fi

if [ -d "$REPO_DIR/deploy/sites-available" ]; then
    cp -fr "$REPO_DIR/deploy/sites-available/"* "$NGINX_SITES_AVAILABLE/"
fi

# copy frontend
if [ -f "$REPO_DIR/index.html" ]; then
    cp -f "$REPO_DIR/index.html" "$FRONTEND_DIR/"
fi

if [ -d "$REPO_DIR/frontend" ]; then
    cp -fr "$REPO_DIR/frontend/"* "$FRONTEND_DIR/WebSolow/"
fi

# copy files to sites-enabled

cp -rs "$NGINX_SITES_AVAILABLE/." "$NGINX_SITES_ENABLED/"

chown -R www-data:www-data "$FRONTEND_DIR"
chmod -R 755 "$FRONTEND_DIR"

echo "$(nginx -t)"