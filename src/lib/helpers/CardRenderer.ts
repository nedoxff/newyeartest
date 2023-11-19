import { generateCompactBarcode } from '$lib/helpers/barcodeGenerator';
import StampImage from '$lib/assets/card/stamp.png';
import PolarBearImage from '$lib/assets/results/polarBear.svg';
import { cardData, loadedFolders, result } from '$lib';
import { get } from 'svelte/store';
import {format} from 'svelte-i18n';

const CANVAS_SCALE: number = 3;
const CANVAS_BASE_WIDTH: number = 500;
const CANVAS_BASE_HEIGHT: number = 275;

function textWrap(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    maxWidth: number
) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const words = lines[i].split(' ');
        let currentLine = words[0];
        for (let j = 1; j < words.length; j++) {
            let metrics = ctx.measureText(currentLine + ' ' + words[j]);
            if (metrics.width < maxWidth) {
                currentLine += ' ' + words[j];
            } else {
                ctx.fillText(currentLine, x, y);
                metrics = ctx.measureText(currentLine);
                y += metrics.actualBoundingBoxAscent + metrics.fontBoundingBoxDescent;
                currentLine = words[j];
            }
        }
        ctx.fillText(currentLine, x, y);
        const metrics = ctx.measureText(currentLine);
        y += metrics.actualBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    }
    return y;
}

const scaled = (num: number) => num * CANVAS_SCALE;

export async function renderEmployeeCard(id: string, name: string, job: string) {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const barcodeImage = new Image();
    const stampImage = new Image();
    const workerImage = new Image();

    await new Promise((resolve) => {
        barcodeImage.onload = () => {
            stampImage.src = StampImage;
            stampImage.onload = () => {
                if (loadedFolders.get('results') !== undefined)
                    workerImage.src = loadedFolders
                        .get('results')
                        ?.find((x) => x.includes(get(result)[0]))!;
                else workerImage.src = PolarBearImage;
                workerImage.onload = resolve;
            };
        };
        barcodeImage.src = generateCompactBarcode(id, scaled(2), 7);
    });
    await document.fonts.load(`${scaled(24)}px NeueMachina-Regular`);
    await document.fonts.load(`${scaled(34)}px NeueMachina-Bold`);

    canvas.width = scaled(CANVAS_BASE_WIDTH);
    canvas.height = scaled(CANVAS_BASE_HEIGHT);

    let nextY: number = 0;
    const drawText = (
        text: string,
        size: number,
        fontVariant: string,
        color: string,
        x: number,
        y: number,
        addSpacing: boolean = false,
        spacing: number = 10
    ) => {
        ctx.font = `${scaled(size)}px NeueMachina-${fontVariant}`;
        ctx.fillStyle = color;
        ctx.textBaseline = 'top';
        ctx.fillText(text, x, y);
        if (addSpacing === true) {
            let metrics = ctx.measureText(text);
            nextY += scaled(spacing) + metrics.actualBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        }
    };

    // #region Card background
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, scaled(15));
    ctx.fill();
    ctx.closePath();
    // #endregion

    // #region Card title + horizontal line below it
    drawText(get(format)('card.title'), 24, 'Regular', 'black', scaled(10), scaled(10), true, 10);

    ctx.lineWidth = scaled(1.25);
    ctx.moveTo(scaled(10), nextY);
    ctx.lineTo(scaled(CANVAS_BASE_WIDTH - 10), nextY);
    ctx.stroke();
    nextY += ctx.lineWidth + scaled(10);
    // #endregion

    // #region Name + employee's image
    let prevY = nextY;
    drawText(get(format)('card.name'), 16, 'Regular', '#afafaf', scaled(10), nextY, true, 0);

    const roundedImage = (
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        image: HTMLImageElement
    ) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(image, x, y, width, height);
        ctx.restore();
    };
    roundedImage(
        scaled(CANVAS_BASE_WIDTH - 160),
        prevY,
        scaled(150),
        scaled(150),
        scaled(15),
        workerImage
    );

    drawText(name, 34, 'Bold', 'black', scaled(10), nextY, true, 5);
    // #endregion

    // #region Job subtext + text
    drawText(get(format)('card.job'), 16, 'Regular', '#afafaf', scaled(10), nextY, true, 0);

    ctx.fillStyle = '#000000';
    ctx.font = `${24 * CANVAS_SCALE}px NeueMachina-Regular`;
    nextY = textWrap(ctx, scaled(10), nextY, job, scaled(330)) + scaled(5);
    // #endregion

    // #region Working since text
    drawText(get(format)('card.workingSince'), 16, 'Regular', '#afafaf', scaled(10), nextY, true, 0);
    prevY = nextY;

    let date = new Date();
    let dateString = () =>
        date.toLocaleDateString(undefined, {
            year: 'numeric',
            day: '2-digit',
            month: '2-digit'
        });
    drawText(dateString(), 24, 'Bold', 'black', scaled(10), nextY, true, 0);
    // #endregion

    // #region Working until text
    drawText(get(format)('card.workingUntil'), 16, 'Regular', '#afafaf', scaled(10), nextY, true, 0);

    date = new Date(date.setMonth(date.getMonth() + 3));
    drawText(dateString(), 24, 'Bold', 'black', scaled(10), nextY, true, 0);
    // #endregion

    // #region Stamp image
    let metrics = ctx.measureText(dateString());
    ctx.drawImage(
        stampImage,
        scaled(15) + metrics.width,
        prevY - scaled(15),
        scaled(125),
        scaled(125)
    );
    // #endregion

    // #region Barcode
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        barcodeImage,
        scaled(10),
        scaled(CANVAS_BASE_HEIGHT - 10) - barcodeImage.height * 0.75,
        scaled(CANVAS_BASE_WIDTH - 20),
        barcodeImage.height * 0.75
    );
    // #endregion Barcode

    // #region ID (above the barcode)
    ctx.font = `${12 * CANVAS_SCALE}px NeueMachina-Regular`;
    ctx.fillStyle = '#000000';
    metrics = ctx.measureText(id);
    drawText(
        id,
        12,
        'Regular',
        'black',
        scaled(CANVAS_BASE_WIDTH - 10) - metrics.width,
        scaled(CANVAS_BASE_HEIGHT - 10) -
        barcodeImage.height * 0.75 -
        metrics.actualBoundingBoxAscent -
        metrics.fontBoundingBoxDescent,
        false
    );
    // #endregion

    canvas.toBlob(b => {
        if(b == null) throw new Error('failed to save card canvas as blob');
        cardData.set(b);
    });
}