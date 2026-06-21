import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const BUCKET = "motorent-assets";

async function main() {
  // Create bucket (public)
  const { error: bucketErr } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    allowedMimeTypes: ["image/*"],
  });
  if (bucketErr && !bucketErr.message.includes("already exists")) {
    console.error("Bucket error:", bucketErr.message);
    process.exit(1);
  }
  console.log(`✓ Bucket "${BUCKET}" ready`);

  // Upload logo
  const file = readFileSync("C:/Users/janed/Documents/Landing pages/logo.jpg");
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload("logo.jpg", file, {
      contentType: "image/jpeg",
      upsert: true,
    });
  if (uploadErr) {
    console.error("Upload error:", uploadErr.message);
    process.exit(1);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl("logo.jpg");
  console.log("✓ Logo uploaded successfully");
  console.log("Public URL:", data.publicUrl);
}

main();
