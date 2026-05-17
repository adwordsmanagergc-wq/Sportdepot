#!/usr/bin/env node
// Build wrapper that guarantees DATABASE_URL is set so `prisma generate`
// never fails for missing-env on platforms (Vercel etc.) where the var
// hasn't been added yet. The site falls back to mock data at runtime if
// the DB isn't reachable — see src/lib/safeQuery.js.

const { execSync } = require('node:child_process');

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL =
    'postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public';
  console.log('[build] DATABASE_URL not set — using placeholder for prisma generate');
}

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env });
}

run('prisma generate');
run('next build');
