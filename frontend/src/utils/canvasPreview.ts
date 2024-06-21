import { PixelCrop } from 'react-image-crop';

const setCanvasPreview = (
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    width: number,
    height: number
) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('No 2d context');
    }

    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    ctx.save();
    const { x, y, width: cropWidth, height: cropHeight } = crop;
    ctx.drawImage(image, x * scaleX, y * scaleY, cropWidth * scaleX, cropHeight * scaleY, 0, 0, width, height);
    ctx.restore();
};

export default setCanvasPreview;
