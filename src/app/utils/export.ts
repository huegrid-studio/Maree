const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const svgToCanvas = (svg: SVGSVGElement): Promise<HTMLCanvasElement> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const width = svg.viewBox.baseVal.width;
    const height = svg.viewBox.baseVal.height;
    
    canvas.width = width;
    canvas.height = height;
    
    const str = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([str], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.src = url;
  });
};

const svgToCanvasFrame = (svg: SVGSVGElement, canvas: HTMLCanvasElement): Promise<void> => {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    const str = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([str], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.src = url;
  });
};

export const exportSVG = (svgRef: React.RefObject<SVGSVGElement>) => {
  if (!svgRef.current) return;
  const str = new XMLSerializer().serializeToString(svgRef.current);
  const blob = new Blob([str], { type: 'image/svg+xml' });
  downloadBlob(blob, 'pattern.svg');
};

export const exportWEBP = async (svgRef: React.RefObject<SVGSVGElement>) => {
  if (!svgRef.current) return;
  const canvas = await svgToCanvas(svgRef.current);
  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, 'pattern.webp');
  }, 'image/webp', 0.9);
};

export const exportConfig = (config: any) => {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'pattern-config.json');
};

// Check if browser supports MP4 recording natively
const supportsNativeMP4 = (): boolean => {
  try {
    const mimeTypes = [
      'video/mp4',
      'video/mp4;codecs=h264',
      'video/mp4;codecs=h264,aac',
      'video/mp4;codecs=avc1.42E01E',
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    ];
    
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

// Get the best supported MP4 MIME type
const getBestMP4MimeType = (): string | null => {
  const mimeTypes = [
    'video/mp4;codecs=h264,aac',
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4;codecs=h264',
    'video/mp4;codecs=avc1.42E01E',
    'video/mp4',
  ];
  
  for (const mimeType of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }
  return null;
};

export const exportWEBM = async (
  svgRef: React.RefObject<SVGSVGElement>,
  duration: number,
  onProgress?: (progress: number) => void
): Promise<void> => {
  if (!svgRef.current) return;

  const svg = svgRef.current;
  const fps = 60; // Updated to 60fps for smooth motion
  const totalFrames = Math.ceil((duration / 1000) * fps);
  const frameInterval = 1000 / fps;

  // Create canvas for recording
  const canvas = document.createElement('canvas');
  canvas.width = svg.viewBox.baseVal.width;
  canvas.height = svg.viewBox.baseVal.height;

  // Determine video bitrate based on resolution
  const pixelCount = canvas.width * canvas.height;
  const bitrate = Math.max(2500000, Math.min(10000000, pixelCount / 2)); // 2.5Mbps to 10Mbps

  // Setup MediaRecorder
  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: bitrate
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      downloadBlob(blob, 'pattern.webm');
      resolve();
    };

    mediaRecorder.onerror = (error) => {
      console.error('MediaRecorder error:', error);
      reject(error);
    };

    mediaRecorder.start();

    let frameCount = 0;

    const captureFrame = async () => {
      if (frameCount >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      // Render current frame
      await svgToCanvasFrame(svg, canvas);

      // Report progress
      if (onProgress) {
        onProgress((frameCount / totalFrames) * 100);
      }

      frameCount++;

      // Wait for next frame
      setTimeout(captureFrame, frameInterval);
    };

    captureFrame();
  });
};

// MP4 Export using hybrid approach
export const exportMP4 = async (
  svgRef: React.RefObject<SVGSVGElement>,
  duration: number,
  onProgress?: (progress: number) => void
): Promise<void> => {
  if (!svgRef.current) return;

  const svg = svgRef.current;
  const fps = 60; // 60fps for smooth motion
  const totalFrames = Math.ceil((duration / 1000) * fps);
  const frameInterval = 1000 / fps;

  // Create canvas for recording
  const canvas = document.createElement('canvas');
  canvas.width = svg.viewBox.baseVal.width;
  canvas.height = svg.viewBox.baseVal.height;

  // Determine video bitrate based on resolution
  const pixelCount = canvas.width * canvas.height;
  const bitrate = Math.max(2500000, Math.min(10000000, pixelCount / 2));

  // Try native MP4 recording first (works in Chrome/Edge)
  if (supportsNativeMP4()) {
    const mimeType = getBestMP4MimeType();
    if (mimeType) {
      try {
        const stream = canvas.captureStream(fps);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: bitrate
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        return new Promise((resolve, reject) => {
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/mp4' });
            downloadBlob(blob, 'pattern.mp4');
            resolve();
          };

          mediaRecorder.onerror = (error) => {
            console.error('Native MP4 recording error:', error);
            reject(error);
          };

          mediaRecorder.start();

          let frameCount = 0;

          const captureFrame = async () => {
            if (frameCount >= totalFrames) {
              mediaRecorder.stop();
              return;
            }

            await svgToCanvasFrame(svg, canvas);

            if (onProgress) {
              onProgress((frameCount / totalFrames) * 100);
            }

            frameCount++;
            setTimeout(captureFrame, frameInterval);
          };

          captureFrame();
        });
      } catch (error) {
        console.warn('Native MP4 recording failed, falling back to H264 encoder:', error);
      }
    }
  }

  // Fallback: Use H264-MP4-Encoder for Safari and other browsers
  console.log('Using H264-MP4-Encoder for MP4 export');
  
  return new Promise(async (resolve, reject) => {
    try {
      // Dynamically import the encoder
      const { default: H264MP4Encoder } = await import('h264-mp4-encoder');
      
      // Initialize encoder
      const encoder = await H264MP4Encoder.create();
      encoder.width = canvas.width;
      encoder.height = canvas.height;
      encoder.frameRate = fps;
      encoder.quantizationParameter = 10; // Lower = better quality (range: 10-51)
      encoder.initialize();

      // Capture and encode frames
      const ctx = canvas.getContext('2d')!;
      
      for (let frameCount = 0; frameCount < totalFrames; frameCount++) {
        // Render current frame
        await svgToCanvasFrame(svg, canvas);
        
        // Get frame data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Encode frame
        encoder.addFrameRgba(imageData.data);

        // Report progress
        if (onProgress) {
          onProgress((frameCount / totalFrames) * 100);
        }
      }

      // Finalize encoding
      encoder.finalize();
      const mp4Data = encoder.FS.readFile(encoder.outputFilename);
      
      // Create blob and download
      const blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });
      downloadBlob(blob, 'pattern.mp4');
      
      // Cleanup
      encoder.delete();
      
      resolve();
    } catch (error) {
      console.error('H264 encoder error:', error);
      reject(error);
    }
  });
};