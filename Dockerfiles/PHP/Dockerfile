FROM php:8.0-apache

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

WORKDIR /var/wwww/html/

COPY . .

RUN mkdir /var/ultra_secure_folder

RUN echo -n "test123321" > /var/ultra_secure_folder/flag

