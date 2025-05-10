import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Convert the file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert buffer to base64 string
    const base64String = buffer.toString("base64");
    const fileType = file.type;
    const base64File = `data:${fileType};base64,${base64String}`;

    // Upload to Cloudinary with authentication
    const result = await cloudinary.uploader.upload(base64File, {
      resource_type: "auto",
      folder: "lottery-images",
    });

    return NextResponse.json({
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
