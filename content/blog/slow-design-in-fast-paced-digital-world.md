---
title: "GitHub Actions CI/CD for Laravel: A Zero-Downtime Deployment Setup"
description: A practical walkthrough of atomic symlink deployments, parallel test pipelines, and one-command rollbacks using GitHub Actions and DigitalOcean.
date: 2025-01-28
image: https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1260&auto=format&fit=crop&q=80
minRead: 7
author:
  name: Vincent Ndegwa
  avatar:
    src: https://media.licdn.com/dms/image/v2/D4D03AQH277wN5U3E6Q/profile-displayphoto-scale_400_400/B4DZoIDfnkG8Ag-/0/1761071732624?e=1775088000&v=beta&t=J9QjZYYVnIdtRmvPPuD1QGgOxxXh2Gtq0DIsm0puffY
    alt: Vincent Ndegwa
---

I have seen great Laravel features fail for one simple reason: deployment was fragile. The code was correct, but release day was stressful because the process relied on manual SSH steps and luck.

This is the setup I now use to make releases boring, predictable, and reversible.

## Deployment Requirements

- test and deploy from GitHub Actions
- no downtime for users
- rollback in under one minute
- same approach works for Laravel, Django, and FastAPI services

## CI Pipeline First

Every push to main triggers tests. Deploy only runs if tests pass.

```yaml
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
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: /var/www/scripts/deploy.sh
```

## Atomic Release Strategy

The server keeps timestamped releases:

- /var/www/releases/20260330114500
- /var/www/releases/20260330121810
- /var/www/current -> symlink to active release

New code is prepared in a fresh folder. Only after migrations, cache warmup, and health checks pass do we switch the symlink.

```bash
ln -sfn /var/www/releases/$RELEASE /var/www/current
sudo systemctl reload php8.4-fpm
```

The symlink change is atomic, so active requests complete safely while new requests hit the new release.

## Rollback Procedure

If health checks fail after deploy:

```bash
PREV=$(ls -t /var/www/releases | sed -n '2p')
ln -sfn /var/www/releases/$PREV /var/www/current
sudo systemctl reload php8.4-fpm
```

No panic, no patching in production. Just revert, recover, and inspect logs.

## Secrets and Environment Safety

- keep .env outside release folders
- inject secrets via GitHub encrypted secrets
- never expose internal AI services directly to the public network

## Why This Matters for AI Features Too

If your Laravel app depends on FastAPI AI services, release reliability matters even more. Coordinated deploys and quick rollback protect both your core product and AI flows.

A stable CI/CD system is not just DevOps polish. It is product reliability, customer trust, and engineering sanity.
