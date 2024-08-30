export const convertToWebP = async (image: File): Promise<Blob | undefined> => {
  try {
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Unable to get canvas context'));
            return;
          }

          canvas.width = 512;
          canvas.height = 512;
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const width = img.width * scale;
          const height = img.height * scale;

          const x = (canvas.width - width) / 2;
          const y = (canvas.height - height) / 2;

          ctx.drawImage(img, x, y, width, height);

          canvas.toBlob(
            (webpBlob) => {
              if (!webpBlob) {
                reject(new Error('Failed to create WebP Blob'));
                return;
              }
              resolve(webpBlob);
            },
            'image/webp',
            0.5
          );
        };
      };

      fileReader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      fileReader.readAsDataURL(image);
    });

    return blob;
  } catch (error) {
    console.error('Error converting to WebP:', error);
    throw error;
  }
};
