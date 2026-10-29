// Microscope Story's calibrated image/ROI grammar, adapted from Lemo (MIT).
// A project supplies decoded, licensed scan plates. No synthetic tissue is made.
export function scanPlate(g,image,{x,y,width,height,roi=[0,0,1,1]}) {
  const iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height;
  if(!(iw>0&&ih>0&&roi[2]>0&&roi[3]>0))throw new Error('Decoded scan and valid ROI required');
  g.drawImage(image,roi[0]*iw,roi[1]*ih,roi[2]*iw,roi[3]*ih,x,y,width,height);
}
export function scaleBar(g,{x,y,screenPixels,micronsPerPixel,sourceToScreen=1,color='#FFF'}) {
  if(!(screenPixels>0&&micronsPerPixel>0&&sourceToScreen>0))throw new Error('Real image calibration required');
  const microns=screenPixels/sourceToScreen*micronsPerPixel;
  g.save();g.strokeStyle=color;g.lineWidth=3;g.beginPath();g.moveTo(x,y-8);g.lineTo(x,y);g.lineTo(x+screenPixels,y);g.lineTo(x+screenPixels,y-8);g.stroke();g.fillStyle=color;g.font='20px monospace';g.fillText(`${Number(microns.toPrecision(4))} µm`,x,y-15);g.restore();return microns;
}
export function roiBox(g,{x,y,width,height,label,color='#E8D57B'}) {g.save();g.strokeStyle=color;g.lineWidth=2;g.strokeRect(x,y,width,height);g.fillStyle=color;g.font='21px sans-serif';g.fillText(label,x,y-12);g.restore();}
