"use client";
import { CldImage } from "next-cloudinary";

export default function CloudinaryImage({
  src,
  alt,
  width = 500,
  height = 500,
  ...props
}) {
  // If the source is already a Cloudinary URL, extract just the public ID
  const getPublicId = (url) => {
    if (!url) return "";

    // Check if it's a Cloudinary URL
    if (url.includes("res.cloudinary.com")) {
      // Extract the public ID from URLs like
      // https://res.cloudinary.com/dhlmlmk88/image/upload/v1234567890/folder/image.jpg
      const matches = url.match(/\/v\d+\/(.+)$/);
      return matches ? matches[1] : url;
    }

    return url;
  };

  const publicId = getPublicId(src);

  return (
    <CldImage
      src={publicId}
      alt={alt || "Image"}
      width={width}
      height={height}
      crop="fill"
      gravity="auto"
      {...props}
    />
  );
}
