#!/bin/bash

echo "Starting Laravel..."

# Pastikan permission benar
chmod -R 775 storage bootstrap/cache

# Cache dibersihkan dulu
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Jalankan migration
php artisan migrate --force

# Buat storage link (aman jika sudah ada)
php artisan storage:link || true

# Cache ulang
php artisan config:cache
php artisan route:cache

# Jalankan PHP-FPM
php-fpm -D

# Jalankan Nginx
nginx -g "daemon off;"