FROM php:8.0-apache

RUN apt-get update && apt install build-essential git -y && cd /home && git clone https://github.com/rofl0r/microsocks && cd microsocks && make && make install

RUN mkdir /var/ultra_secure_folder \
    && echo -n "%exampleflag%" > /var/ultra_secure_folder/flag  \
    && echo    "<Directory /var/www/html/> \n\
    Options Indexes FollowSymLinks MultiViews \n\
    AllowOverride None \n\
    allow from all \n\
    </Directory>" >> /etc/apache2/sites-available/000-default.conf

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

WORKDIR /var/wwww/html/

COPY src/xxe.php .

COPY src/script.sh /

RUN chmod +x /script.sh

CMD /script.sh

