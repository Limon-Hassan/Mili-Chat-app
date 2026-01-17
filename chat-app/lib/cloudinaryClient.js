export async function uploadToCloudinary(
  file,
  folder = 'default',
  resourceType = 'auto',
) {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  );
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    { method: 'POST', body: formData },
  );

  const data = await res.json();
  return data.secure_url; 
}
