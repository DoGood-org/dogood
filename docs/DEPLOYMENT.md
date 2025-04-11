# Deployment Guide

## Local
Use `.env`, `npm run dev`.

## Production (Vercel / Docker)
- Set all environment variables
- Use `npm run build && npm start`
- For Docker, see `docker-compose.yml`

CI/CD is configured via GitHub Actions.
