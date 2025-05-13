/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "dhlmlmk88",
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: "ml_default",
    CLOUDINARY_API_KEY: "755568369119196",
    CLOUDINARY_API_SECRET: "pV32MoPRe1LlNld4D_W4HVXb6n8",
  },
};

module.exports = nextConfig;
