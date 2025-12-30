# TODO - Refresh Token Fix

## Issues Identified:
1. Cookie `secure: true` inconsistency - using HTTP, not HTTPS
2. Login sets `secure: true`, but refresh sets `secure: false`
3. Logout uses `secure: true`

## Tasks:
- [x] Fix cookie settings in authController.js (login & refresh)
- [x] Fix cookie settings in authService.js (logout)
- [ ] Test the changes

## Files to Edit:
1. server/src/controllers/authController.js
2. server/src/services/authService.js

## Changes Made:
1. **authController.js** (login): Changed `secure: true` to `secure: process.env.NODE_ENV === "production"`
2. **authController.js** (refresh): Changed `secure: false` to `secure: process.env.NODE_ENV === "production"`
3. **authService.js** (logout): Changed `secure: true` to `secure: process.env.NODE_ENV === "production"`

