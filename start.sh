#!/bin/bash

# Generate app key kalau belum ada
php artisan key:generate --force

# Jalankan migration
php artisan migrate --force

# Cache config untuk performa
php artisan config:cache
php artisan route:cache

# Jalankan PHP-FPM di background
php-fpm -D

# Jalankan Nginx di foreground
nginx -g "daemon off;"