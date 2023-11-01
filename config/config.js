import dotenv from 'dotenv';

dotenv.config();

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
export const jwtKey = process.env.jwtKey;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const OWNER_EMAIL = process.env.OWNER_EMAIL;
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
export const isProduction = process.env.NODE_ENV === 'production';
// OPENAI_API_KEY
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;     

export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
