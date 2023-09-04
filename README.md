# jiff-crypto-provider

Standalone crypto provider party for JIFF computations

See `example/` for a demonstration of usage.

## Dependencies

You need to install this repo's dependencies as well as the JIFF submodule
dependencies.

```bash
# Inside this directory
git submodule init && git submodule update
npm install
cd jiff && npm install
```

## Running

You can run the example using `./example.sh`. Follow the instructions it prints
to try it out!

## Deploying crypto provider.

### Authentication

This code is experimental and should not be deployed in a public facing way without
improved authentication: anyone can connect to any computation id and claim to be any party
provided they know the computation id token. They can read all the generated crypto material
for that party, or request too many tokens to deny service.

### Restarter

With proper authentication, you can deploy the cryptoprovider, and use the `restarter.js`
script so that you can remotely restart the provider if needed.

The restarter script takes a password command line argument. You can then
use that password to restart the provider from your browser following the URL
the restarter prints to the screen.

## SSL

You probably need to setup an SSL certificate for your cryptoprovider, and setup
the cryptoprovider express and socket server to use it while serving requests.

We recommend you setup an Nginx proxy that sits infront of the cryptoprovider
and configure it to use your certificate. You also need to register your certificate
to your domain name, and potentially setup an auto-renewal policy for it.

See `letsencrypt` and `certbot` for more details.

Below is a sample nginx configuration:

```
# /etc/nginx/sites-enabled/cryptoprovider
server {
  server_name <YOUR server name>;
  access_log </path/to/nginx.log>;
  error_log </path/to/nginx.err>;

  listen 443 ssl; # managed by Certbot
  ssl_certificate </etc/letsencrypt/live/path/to/fullchain.pem>; # managed by Certbot
  ssl_certificate_key </etc/letsencrypt/live/path/to/privkey.pem>; # managed by Certbot
  include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

  location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;

    proxy_pass http://localhost:4321;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }

}

```
