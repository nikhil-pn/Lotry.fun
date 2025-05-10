// Cloudinary configuration file
"use client";

import { Cloudinary } from "@cloudinary/url-gen";

// Create a new Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: "dhlmlmk88", // Your Cloudinary cloud name
  },
  url: {
    secure: true, // Use HTTPS
  },
});
