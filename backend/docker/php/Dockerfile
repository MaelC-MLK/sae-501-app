# Use the official PHP 8.2 FPM image as the base image
FROM php:8.2-fpm

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    libonig-dev

# Install PDO MySQL extension
RUN docker-php-ext-install pdo_mysql

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the working directory to /var/www/html
WORKDIR /var/www/html

# Expose port 9000 for PHP-FPM
EXPOSE 9000
