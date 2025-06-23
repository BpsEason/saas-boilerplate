FROM php:8.2-fpm-alpine

# 安裝系統依賴
RUN apk add --no-cache \
    bash \
    git \
    curl \
    onig-dev \
    libxml2-dev \
    zip \
    unzip \
    postgresql-dev \
    libpq \
    build-base \
    autoconf \
    nginx

# 安裝 PHP 擴展
RUN docker-php-ext-install pdo_mysql pdo_pgsql opcache bcmath exif pcntl gd xml

# 安裝 Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html

COPY . .

# 設置權限
RUN chown -R www-data:www-data /var/www/html/storage \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# 設置 PHP-FPM
COPY docker/php-fpm.conf /etc/php82/php-fpm.d/www.conf

EXPOSE 9000
CMD ["php-fpm"]
