FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev

# Install PHP extensions
RUN docker-php-ext-install intl pdo_mysql zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www/html

# Copy composer.json
COPY composer.json ./
COPY composer.lock ./

# Install Symfony Flex
RUN composer require symfony/flex

# Install dependencies
RUN composer install --prefer-dist --no-progress --no-interaction

# Copy existing application directory contents
COPY . .

# Run Symfony Flex recipes
RUN composer symfony:sync-recipes --force

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Install Doctrine
RUN composer require symfony/orm-pack
RUN composer require --dev symfony/maker-bundle