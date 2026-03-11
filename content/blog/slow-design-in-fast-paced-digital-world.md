---
title: "GitHub Actions CI/CD for Laravel: A Zero-Downtime Deployment Setup"
description: Why designing digital experiences that encourage users to slow down
  and engage deeply can lead to more meaningful interactions and better
  outcomes.
date: 2025-01-28
image: https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1260&auto=format&fit=crop&q=80
minRead: 7
author:
  name: Vincent
  avatar:
    src: https://media.licdn.com/dms/image/v2/D4D03AQH277wN5U3E6Q/profile-displayphoto-scale_400_400/B4DZoIDfnkG8Ag-/0/1761071732624?e=1775088000&v=beta&t=J9QjZYYVnIdtRmvPPuD1QGgOxxXh2Gtq0DIsm0puffY
    alt: Vincent
---

Every project I ship has a GitHub Actions pipeline. Not because it's fashionable, but because manually SSH-ing into a server and running `git pull` is a liability. Here's the exact setup I use for Laravel projects on DigitalOcean, with zero-downtime atomic deployments.

## The Goal

- Push to `main` → tests run → if green, deploy automatically
- No downtime during deployment
- Rollback in one command if something goes wrong

## The Workflow File

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
      - run: composer install --no-interaction --prefer-dist
      - run: cp .env.testing .env && php artisan key:generate
      - run: php artisan test --parallel

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            cd /var/www/releases
            git clone git@github.com:you/app.git $(date +%Y%m%d%H%M%S)
            cd $(ls -t | head -1)
            composer install --no-dev --optimize-autoloader
            cp /var/www/shared/.env .env
            php artisan migrate --force
            php artisan config:cache && php artisan route:cache
            ln -sfn /var/www/releases/$(ls -t /var/www/releases | head -1) /var/www/current
            sudo systemctl reload php8.4-fpm
            # Keep only the last 5 releases
            ls -t /var/www/releases | tail -n +6 | xargs -I{} rm -rf /var/www/releases/{}
```

## How Zero-Downtime Works

The key is the **atomic symlink swap**: Nginx serves `/var/www/current`, which is a symlink. The new release is fully built in a timestamped directory *before* the symlink is updated. The swap (`ln -sfn`) is a single atomic filesystem operation — requests in flight finish against the old release, new requests immediately use the new one.

## Rollback

If something breaks:

```bash
# On the server — point current at the previous release
PREV=$(ls -t /var/www/releases | sed -n '2p')
ln -sfn /var/www/releases/$PREV /var/www/current
sudo systemctl reload php8.4-fpm
```

Done. Previous version is live in seconds.

## Secrets Management

Never commit `.env`. The shared `.env` lives at `/var/www/shared/.env` on the server and is copied into each release. GitHub Secrets store the SSH key and host details — they're never in the repo.

I recently took on a project that challenged everything about my usual design process. A small literary journal wanted a digital platform that encouraged readers to slow down and engage deeply with content—the exact opposite of most websites optimized for quick consumption.

This got me thinking about what I'm calling "slow design"—an approach that intentionally creates space for contemplation rather than rapid interaction.

For the Wordsmith Journal, I experimented with subtle animations that respond to reading pace, typography that encourages focus, and navigation that reveals content gradually rather than all at once. The result feels more like turning pages in a physical book than scrolling through a typical website.

User testing revealed something fascinating: readers spent 3x longer with articles and reported higher satisfaction and better recall of content compared to the journal's previous site. By designing for attention rather than distraction, we created a digital experience that honors the thoughtful nature of the content itself.

I'm now incorporating elements of slow design into all my projects, asking: "Where can we create moments of pause? How can we reward attention rather than just capturing it?"

In our rush to optimize for engagement metrics, I think we've forgotten that sometimes the most meaningful digital experiences are the ones that don't demand immediate action but instead create space for thought.
