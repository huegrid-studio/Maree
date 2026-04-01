import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Settings2 } from 'lucide-react';
import { TessorPanel, TessorTab, TessorSection } from './components/ui/TessorPanel';
import { TessorButton } from './components/ui/TessorButton';
import { TessorFileUpload } from './components/ui/TessorFileUpload';
import { TessorFormatSelector } from './components/ui/TessorFormatSelector';
import {
  DynamicControlGroup,
  DynamicControl,
  DynamicControlNumeric,
  DynamicControlToggle,
  DynamicControlDropdown,
  DynamicControlSegmented,
  DynamicColorControl,
} from './components/ui/DynamicControls';
import {
  SoloControlGroup,
  SoloControl,
  SoloControlNumeric,
  SoloControlToggle,
  SoloControlDropdown,
  SoloControlColor,
} from './components/ui/SoloControls';
import {
  Play,
  Timer,
  TrendingUp,
  ArrowLeftRight,
  Layers,
  Hash,
  ChevronsUpDown,
  RotateCcw,
  Maximize2,
  Eye,
  ArrowRight,
  ArrowLeft,
  Grid3X3,
  MoveHorizontal,
  MoveVertical,
  Shuffle,
  Activity,
  Pipette,
  Minus,
  Circle,
  PenLine,
} from 'lucide-react';
import { AspectRatioSelector } from './components/ui/AspectRatioSelector';
import { ResolutionSelector } from './components/ui/ResolutionSelector';
import { RenderShape } from './components/RenderShape';
import { ClipShapeGrid } from './components/ClipShapeGrid';
import { ElementComboGrid } from './components/ElementComboGrid';
import { useAnimationTime } from './hooks/useAnimationTime';
import { SHAPES, CUSTOM_SVG_PREFIX } from './constants';
import { calcCanvasSize } from './utils/canvas';
import { exportSVG, exportWEBP, exportConfig, exportWEBM, exportMP4 } from './utils/export';
import { parseSVG } from './utils/svg-parser';
import { generateElements } from './utils/grid-generator';
import { loadClipSVG } from './utils/clips';
import { DEFAULT_CONFIG } from './config/default-config';
import type { 
  CanvasConfig, 
  GridConfig, 
  PatternConfig, 
  TransformConfig, 
  AnimationConfig, 
  ClipConfig,
  ShapeConfig,
  CustomSVGItem
} from './types';

function PatternTool() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('SVG');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // State initialization from default config
  const [canvasConfig, setCanvasConfig] = useState<CanvasConfig>(DEFAULT_CONFIG.canvas);
  const [gridConfig, setGridConfig] = useState<GridConfig>(DEFAULT_CONFIG.grid);
  const [patternConfig, setPatternConfig] = useState<PatternConfig>(DEFAULT_CONFIG.pattern);
  const [transformConfig, setTransformConfig] = useState<TransformConfig>(DEFAULT_CONFIG.transforms);
  const [rectConfig, setRectConfig] = useState<ShapeConfig>(DEFAULT_CONFIG.rect);
  const [dotConfig, setDotConfig] = useState<ShapeConfig>(DEFAULT_CONFIG.dot);
  const [lineConfig, setLineConfig] = useState<ShapeConfig>(DEFAULT_CONFIG.line);
  const [starConfig, setStarConfig] = useState<ShapeConfig>(DEFAULT_CONFIG.star);
  const [animConfig, setAnimConfig] = useState<AnimationConfig>(DEFAULT_CONFIG.animation);
  const [clipConfig, setClipConfig] = useState<ClipConfig>(DEFAULT_CONFIG.clip);
  const [squareConfig, setSquareConfig] = useState<ShapeConfig>(DEFAULT_CONFIG.square);
  const [triangleConfig, setTriangleConfig] = useState<ShapeConfig>(DEFAULT_CONFIG.triangle);
  const [crossConfig, setCrossConfig] = useState<ShapeConfig>(DEFAULT_CONFIG.cross);
  const [diamondConfig, setDiamondConfig] = useState<ShapeConfig>(DEFAULT_CONFIG.diamond);
  const [customSVGItems, setCustomSVGItems] = useState<CustomSVGItem[]>([]);
  const [customSVG, setCustomSVG] = useState<string | null>(null);

  const { width: canvasW, height: canvasH } = useMemo(
    () => calcCanvasSize(canvasConfig.aspectRatio, canvasConfig.resolution),
    [canvasConfig.aspectRatio, canvasConfig.resolution]
  );

  const time = useAnimationTime(animConfig.enabled);

  const shapes = useMemo(() => ({
    [SHAPES.RECT]: rectConfig,
    [SHAPES.DOT]: dotConfig,
    [SHAPES.LINE]: lineConfig,
    [SHAPES.STAR]: starConfig,
    [SHAPES.SQUARE]: squareConfig,
    [SHAPES.TRIANGLE]: triangleConfig,
    [SHAPES.CROSS]: crossConfig,
    [SHAPES.DIAMOND]: diamondConfig,
  }), [rectConfig, dotConfig, lineConfig, starConfig, squareConfig, triangleConfig, crossConfig, diamondConfig]);

  const customSVGMap = useMemo(() => {
    const map: Record<string, ShapeConfig> = {};
    customSVGItems.forEach(item => {
      map[`${CUSTOM_SVG_PREFIX}${item.id}`] = item.config;
    });
    return map;
  }, [customSVGItems]);

  const activePattern = patternConfig.elements.length > 0 ? patternConfig.elements : [SHAPES.RECT];

  const elements = useMemo(() => generateElements({
    cols: gridConfig.cols,
    rows: gridConfig.rows,
    gapX: gridConfig.gapX,
    gapY: gridConfig.gapY,
    cellW: gridConfig.cellW,
    cellH: gridConfig.cellH,
    pattern: activePattern,
    sequence: patternConfig.sequence,
    seed: gridConfig.seed,
    canvasW,
    canvasH,
  }), [gridConfig, patternConfig, canvasW, canvasH]);

  const clipPath = useMemo(() => {
    if (!clipConfig.preset || clipConfig.preset === 'None') return null;
    
    if (clipConfig.preset === 'Custom' && clipConfig.customSVGPath) {
      const centerX = clipConfig.customSVGCenterX;
      const centerY = clipConfig.customSVGCenterY;
      const scaleFactor = clipConfig.scale * clipConfig.customSVGNormalizedScale;
      
      const translateX = canvasW / 2 - centerX * scaleFactor;
      const translateY = canvasH / 2 - centerY * scaleFactor;
      
      return {
        path: clipConfig.customSVGPath,
        transform: `translate(${translateX}, ${translateY}) scale(${scaleFactor})`,
      };
    }
    
    // For preset SVGs, we'll load and use them
    if (clipConfig.customSVGPath) {
      const centerX = clipConfig.customSVGCenterX;
      const centerY = clipConfig.customSVGCenterY;
      const scaleFactor = clipConfig.scale * clipConfig.customSVGNormalizedScale;
      
      const translateX = canvasW / 2 - centerX * scaleFactor;
      const translateY = canvasH / 2 - centerY * scaleFactor;
      
      return {
        path: clipConfig.customSVGPath,
        transform: `translate(${translateX}, ${translateY}) scale(${scaleFactor})`,
      };
    }
    
    return null;
  }, [clipConfig, canvasW, canvasH]);

  // Handle preset clip shape selection
  const handleClipShapeSelect = async (preset: string) => {
    if (preset === 'Custom') {
      return; // Custom upload is handled by the upload input
    }
    
    // Load preset SVG using dynamic import
    const svgUrl = new URL(`../../clip_svgs/${preset}.svg`, import.meta.url).href;
    
    try {
      const response = await fetch(svgUrl);
      if (!response.ok) {
        console.error(`Failed to load clip SVG: ${preset}`, response.status);
        return;
      }
      const svgText = await response.text();
      const svgData = parseSVG(svgText);
      
      if (!svgData) {
        console.error('Failed to parse clip SVG:', preset);
        return;
      }

      const targetSize = canvasH * 0.8;
      const svgHeight = svgData.viewBox.height;
      const normalizedScale = (targetSize / 10) / svgHeight;

      setCustomSVG(svgData.path);
      setClipConfig({
        preset,
        customSVGPath: svgData.path,
        customSVGName: preset,
        customSVGViewBox: svgData.viewBox,
        customSVGCenterX: svgData.centerX,
        customSVGCenterY: svgData.centerY,
        customSVGNormalizedScale: normalizedScale,
        scale: 10
      });
    } catch (error) {
      console.error('Error loading clip SVG:', error);
    }
  };

  // Handle element combo toggle
  const handleElementToggle = (element: string) => {
    const current = patternConfig.elements;
    if (current.includes(element) && current.length === 1) return;
    const next = current.includes(element)
      ? current.filter(e => e !== element)
      : [...current, element];
    setPatternConfig({ ...patternConfig, elements: next });
  };

  // Handle custom SVG element upload (adds new item to the list, max 5)
  const handleElementSVGUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (customSVGItems.length >= 5) return;

    const baseName = file.name.replace(/\.svg$/i, '');
    const firstWord = baseName.split(/[\s_-]/)[0] || 'Custom';
    const name = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    const id = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    const shapeKey = `${CUSTOM_SVG_PREFIX}${id}`;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const parsedSVG = parseSVG(text);

      if (!parsedSVG) {
        alert('Error: Could not parse SVG file.');
        return;
      }

      const normalizedScale = 1 / parsedSVG.viewBox.height;
      const svgContent = `<path d="${parsedSVG.path}" fill="currentColor" />`;

      const newItem: CustomSVGItem = {
        id,
        name,
        svgContent,
        viewBox: parsedSVG.viewBox,
        config: {
          size: 30,
          fill: '#ffffff',
          opacity: 1,
          customSVGPath: parsedSVG.path,
          customSVGCenterX: parsedSVG.centerX,
          customSVGCenterY: parsedSVG.centerY,
          customSVGNormalizedScale: normalizedScale,
        },
      };

      setCustomSVGItems(prev => [...prev, newItem]);
      setPatternConfig(prev => ({ ...prev, elements: [...prev.elements, shapeKey] }));
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Phosphor icon selection — fetches SVG and creates a CustomSVGItem
  const handlePhosphorIconSelect = (iconName: string, svgText: string) => {
    if (customSVGItems.length >= 5) return;

    const withoutFill = iconName.replace(/-fill$/, '');
    const firstWord = withoutFill.split('-')[0] || 'Icon';
    const name = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    const id = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    const shapeKey = `${CUSTOM_SVG_PREFIX}${id}`;

    const parsedSVG = parseSVG(svgText);
    if (!parsedSVG) return;

    const normalizedScale = 1 / parsedSVG.viewBox.height;
    const svgContent = `<path d="${parsedSVG.path}" fill="currentColor" />`;

    const newItem: CustomSVGItem = {
      id,
      name,
      svgContent,
      viewBox: parsedSVG.viewBox,
      config: {
        size: 30,
        fill: '#ffffff',
        opacity: 1,
        customSVGPath: parsedSVG.path,
        customSVGCenterX: parsedSVG.centerX,
        customSVGCenterY: parsedSVG.centerY,
        customSVGNormalizedScale: normalizedScale,
      },
    };

    setCustomSVGItems(prev => [...prev, newItem]);
    setPatternConfig(prev => ({ ...prev, elements: [...prev.elements, shapeKey] }));
  };

  // Handle removing a custom SVG item
  const handleRemoveCustomSVG = (id: string) => {
    const shapeKey = `${CUSTOM_SVG_PREFIX}${id}`;
    setCustomSVGItems(prev => prev.filter(item => item.id !== id));
    setPatternConfig(prev => {
      const remaining = prev.elements.filter(e => e !== shapeKey);
      return { ...prev, elements: remaining.length > 0 ? remaining : [SHAPES.RECT] };
    });
  };

  // SVG Upload Handler
  const handleSVGUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const parsedSVG = parseSVG(text);
      
      if (!parsedSVG) {
        alert('Error: Could not parse SVG file. Make sure it contains valid shapes.');
        return;
      }

      const targetSize = canvasH * 0.8;
      const svgHeight = parsedSVG.viewBox.height;
      const normalizedScale = (targetSize / 10) / svgHeight;

      setCustomSVG(parsedSVG.path);
      setClipConfig({ 
        preset: 'Custom',
        customSVGPath: parsedSVG.path,
        customSVGName: file.name,
        customSVGViewBox: parsedSVG.viewBox,
        customSVGCenterX: parsedSVG.centerX,
        customSVGCenterY: parsedSVG.centerY,
        customSVGNormalizedScale: normalizedScale,
        scale: 10
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Load Config Handler
  const handleLoadConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const config = JSON.parse(text);

        if (config.canvas) setCanvasConfig(config.canvas);
        if (config.grid) setGridConfig(config.grid);

        // Resolve pattern config (may need to fix CustomSVG elements key for legacy)
        let resolvedPattern: PatternConfig | null = null;
        if (config.pattern) {
          if (config.pattern.elements) {
            resolvedPattern = config.pattern;
          } else if (config.pattern.preset != null) {
            // Backward compat: map legacy preset names to element arrays
            const legacyPresetMap: Record<string, string[]> = {
              'Rectangles': [SHAPES.RECT],
              'Dots': [SHAPES.DOT],
              'Lines': [SHAPES.LINE],
              'Stars': [SHAPES.STAR],
              'Rect + Dots': [SHAPES.RECT, SHAPES.DOT],
              'Rect + Lines': [SHAPES.RECT, SHAPES.LINE],
              'Rect + Stars': [SHAPES.RECT, SHAPES.STAR],
              'Dots + Lines': [SHAPES.DOT, SHAPES.LINE],
              'Mixed All': [SHAPES.RECT, SHAPES.DOT, SHAPES.LINE, SHAPES.STAR],
              'Checkerboard': [SHAPES.RECT, SHAPES.EMPTY],
            };
            const mappedElements = legacyPresetMap[config.pattern.preset] || [SHAPES.RECT];
            resolvedPattern = {
              elements: mappedElements,
              sequence: config.pattern.fillMode || 'sequential',
            };
          }
        }

        // Resolve custom SVG items
        // Accept both key variants for multi-item arrays
        const rawCustomSVGItems = config.customSVGItems ?? config.customSVGItemsArray;
        // Accept both key variants for legacy single-SVG configs
        const rawLegacySingle = config.customSVGElement ?? config.customSVGElementConfig;

        if (rawCustomSVGItems && Array.isArray(rawCustomSVGItems)) {
          // Normalize items — guard missing fields AND reconstruct svgContent from
          // trusted path data to prevent XSS from arbitrary HTML in imported JSON.
          const importTs = Date.now();
          const normalizedItems: CustomSVGItem[] = (rawCustomSVGItems as CustomSVGItem[]).slice(0, 5).map((item, idx) => ({
            id: item.id || `imported_${importTs}_${idx}`,
            name: item.name || 'Custom',
            viewBox: item.viewBox ?? { width: 100, height: 100 },
            svgContent: item.config?.customSVGPath
              ? `<path d="${item.config.customSVGPath}" fill="currentColor" />`
              : '',
            config: {
              size: 30,
              fill: '#ffffff',
              opacity: 1,
              ...item.config,
            },
          }));
          setCustomSVGItems(normalizedItems);

          // Validate pattern elements: drop stale custom_svg_* keys that don't correspond
          // to any loaded item, keeping all other (non-custom) element keys intact.
          if (resolvedPattern) {
            const validCustomKeys = new Set(normalizedItems.map(it => `${CUSTOM_SVG_PREFIX}${it.id}`));
            const cleanedElements = resolvedPattern.elements.filter(el =>
              !el.startsWith(CUSTOM_SVG_PREFIX) || validCustomKeys.has(el)
            );
            resolvedPattern = {
              ...resolvedPattern,
              elements: cleanedElements.length > 0 ? cleanedElements : [SHAPES.RECT],
            };
          }
        } else if (rawLegacySingle?.customSVGPath) {
          // Backward compat: old single-SVG config — promote to first item
          const legacyId = 'legacy';
          const legacyItem: CustomSVGItem = {
            id: legacyId,
            name: 'Custom',
            svgContent: `<path d="${rawLegacySingle.customSVGPath}" fill="currentColor" />`,
            viewBox: { width: 100, height: 100 },
            config: rawLegacySingle,
          };
          setCustomSVGItems([legacyItem]);
          // Remap 'CustomSVG' element key to new dynamic key in pattern
          if (resolvedPattern) {
            resolvedPattern = {
              ...resolvedPattern,
              elements: resolvedPattern.elements.map(el =>
                el === SHAPES.CUSTOM_SVG ? `${CUSTOM_SVG_PREFIX}${legacyId}` : el
              ),
            };
          }
        } else {
          setCustomSVGItems([]);
        }

        if (resolvedPattern) setPatternConfig(resolvedPattern);
        if (config.rect) setRectConfig(config.rect);
        if (config.square) setSquareConfig(config.square);
        if (config.dot) setDotConfig(config.dot);
        if (config.line) setLineConfig(config.line);
        if (config.star) setStarConfig(config.star);
        if (config.triangle) setTriangleConfig(config.triangle);
        if (config.cross) setCrossConfig(config.cross);
        if (config.diamond) setDiamondConfig(config.diamond);
        if (config.transforms) setTransformConfig(config.transforms);
        if (config.animation) setAnimConfig(config.animation);
        if (config.clip) {
          setClipConfig(config.clip);
          if (config.clip.customSVGPath) {
            setCustomSVG(config.clip.customSVGPath);
          }
        }
      } catch (error) {
        console.error('Error loading config:', error);
        alert('Error loading configuration file');
      }
    };
    reader.readAsText(file);
  };

  // Fit to Canvas Handler
  const handleFitToCanvas = () => {
    setClipConfig({ ...clipConfig, scale: 10 });
  };

  // Export Config Handler
  const handleExportConfig = () => {
    exportConfig({
      canvas: canvasConfig,
      grid: gridConfig,
      pattern: patternConfig,
      rect: rectConfig,
      square: squareConfig,
      dot: dotConfig,
      line: lineConfig,
      star: starConfig,
      triangle: triangleConfig,
      cross: crossConfig,
      diamond: diamondConfig,
      customSVGItems,
      transforms: transformConfig,
      animation: animConfig,
      clip: clipConfig
    });
  };

  // Unified Export Handler
  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      switch (exportFormat) {
        case 'SVG':
          exportSVG(svgRef);
          break;
        case 'WEBP':
          await exportWEBP(svgRef);
          break;
        case 'JSON':
          handleExportConfig();
          break;
        case 'WEBM':
          await exportWEBM(svgRef, animConfig.duration, (progress) => {
            setExportProgress(progress);
          });
          break;
        case 'MP4':
          await exportMP4(svgRef, animConfig.duration, (progress) => {
            setExportProgress(progress);
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Check if export button should be disabled
  const isExportDisabled = isExporting || ((exportFormat === 'WEBM' || exportFormat === 'MP4') && !animConfig.enabled);
  const exportTooltip = isExporting 
    ? 'Export in progress...'
    : (exportFormat === 'WEBM' || exportFormat === 'MP4') && !animConfig.enabled
      ? `Enable animation in Motion tab to export ${exportFormat}` 
      : undefined;

  // Canvas container ref for dynamic sizing
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  
  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;

    const updateContainerSize = () => {
      const { width, height } = el.getBoundingClientRect();
      setContainerSize({ width, height });
    };

    updateContainerSize();

    const ro = new ResizeObserver(updateContainerSize);
    ro.observe(el);
    window.addEventListener('resize', updateContainerSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);

  // Calculate scale to fit canvas within container
  const scale = Math.min(containerSize.width / canvasW, containerSize.height / canvasH, 1);

  return (
    <div className="min-h-screen h-screen relative" style={{ background: 'var(--t-page)', padding: 'var(--t-space-5)' }}>
      {/* Absolutely Positioned Title */}
      <h1 className="absolute z-10 flex items-center" style={{ top: 'var(--t-space-5)', left: 'var(--t-space-5)', fontSize: 'var(--t-font-md)', fontWeight: 'var(--t-font-weight)', color: 'var(--t-text)', gap: 'var(--t-space-2)' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="5" height="5" stroke="var(--t-title-icon)" strokeWidth="1.5" fill="none" />
          <rect x="9" y="2" width="5" height="5" stroke="var(--t-title-icon)" strokeWidth="1.5" fill="none" />
          <rect x="2" y="9" width="5" height="5" stroke="var(--t-title-icon)" strokeWidth="1.5" fill="none" />
          <rect x="9" y="9" width="5" height="5" stroke="var(--t-title-icon)" strokeWidth="1.5" fill="none" />
        </svg>
        Maree
      </h1>

      {!isPanelOpen && (
        <div className="absolute flex items-center z-10" style={{ top: 'var(--t-space-5)', right: 'var(--t-space-5)', gap: 'var(--t-space-3)' }}>
          <p style={{ fontSize: 'var(--t-font-md)', color: 'var(--t-text-4)' }}>{canvasW} × {canvasH}px • {elements.length} elements</p>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex items-center justify-center transition-all"
            style={{ width: 'var(--t-control-h)', height: 'var(--t-control-h)', borderRadius: 'var(--t-radius-lg)', background: 'var(--t-surface-1)', border: 'var(--t-border-w) solid var(--t-border-0)', color: 'var(--t-text-3)' }}
          >
            <Settings2 style={{ width: 'var(--t-icon-base)', height: 'var(--t-icon-base)' }} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Main Content Area - Full Height */}
      <div className="flex h-full" style={{ gap: isPanelOpen ? 'var(--t-space-5)' : '0px', transition: 'gap var(--t-duration-lg) cubic-bezier(0.4, 0, 0.2, 1)' }}>
        {/* Canvas Area */}
        <div 
          ref={canvasContainerRef} 
          className="flex-1 flex items-center justify-center min-w-0"
        >
          <svg 
            ref={svgRef} 
            width={canvasW * scale} 
            height={canvasH * scale} 
            viewBox={`0 0 ${canvasW} ${canvasH}`} 
            className="block"
            style={{ borderRadius: 'var(--t-radius-xl)', border: 'var(--t-border-w) solid var(--t-border-0)' }}
          >
            <rect width={canvasW} height={canvasH} fill={canvasConfig.bgColor} />
            {clipPath && (
              <defs>
                <clipPath id="clip" clipPathUnits="userSpaceOnUse">
                  <path d={clipPath.path} transform={clipPath.transform || undefined} />
                </clipPath>
              </defs>
            )}
            <g clipPath={clipPath ? 'url(#clip)' : undefined}>
              {elements.map(el => (
                <RenderShape 
                  key={el.id} 
                  el={el} 
                  shapes={shapes}
                  customSVGMap={customSVGMap}
                  transforms={transformConfig} 
                  animConfig={animConfig}
                  time={time}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* Control Panel */}
        <TessorPanel isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)} footerInfo={`${canvasW} × ${canvasH}px · ${elements.length} el`} exportProgress={isExporting ? { format: exportFormat, percent: exportProgress } : null} >
          {/* Canvas Tab */}
          <TessorTab label="Canvas">
            <div className="flex flex-col" style={{ gap: 'var(--t-space-5)' }}>
              <TessorFileUpload label="Import JSON" accept="application/json" onChange={handleLoadConfig} hideIcon />
              <TessorSection title="Display">
                <AspectRatioSelector value={canvasConfig.aspectRatio} onChange={(v) => setCanvasConfig({ ...canvasConfig, aspectRatio: v })} />
                <ResolutionSelector value={canvasConfig.resolution} onChange={(v) => setCanvasConfig({ ...canvasConfig, resolution: v })} />
                <SoloControlGroup>
                  <SoloControl id="canvas-bg" label="Background" value={canvasConfig.bgColor.replace('#', '')} icon={<Pipette style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} onTextChange={(v) => setCanvasConfig({ ...canvasConfig, bgColor: '#' + v.replace('#', '') })}>
                    <SoloControlColor value={canvasConfig.bgColor} onChange={(v) => setCanvasConfig({ ...canvasConfig, bgColor: v })} />
                  </SoloControl>
                </SoloControlGroup>
              </TessorSection>
              <TessorSection title="Export">
                <TessorFormatSelector value={exportFormat} options={['SVG', 'WEBP', 'JSON', 'WEBM', 'MP4']} onChange={(v) => setExportFormat(v)} />
                <TessorButton label="Export" onClick={handleExport} variant="primary" fullWidth disabled={isExportDisabled} tooltip={exportTooltip} />
              </TessorSection>
            </div>
          </TessorTab>

          {/* Pattern Tab */}
          <TessorTab label="Pattern">
            <div className="flex flex-col" style={{ gap: 'var(--t-space-5)' }}>
              <TessorSection title="Grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
                  <DynamicControlGroup>
                    <DynamicControl id="grid-cols" label="Columns" value={`${gridConfig.cols}`} numericValue={gridConfig.cols} numericMin={1} numericMax={50} numericStep={1} onNumericChange={(v) => setGridConfig({ ...gridConfig, cols: v })} icon={<Grid3X3 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={gridConfig.cols} min={1} max={50} step={1} onChange={(v) => setGridConfig({ ...gridConfig, cols: v })} />
                    </DynamicControl>
                    <DynamicControl id="grid-rows" label="Rows" value={`${gridConfig.rows}`} numericValue={gridConfig.rows} numericMin={1} numericMax={50} numericStep={1} onNumericChange={(v) => setGridConfig({ ...gridConfig, rows: v })} icon={<Grid3X3 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={gridConfig.rows} min={1} max={50} step={1} onChange={(v) => setGridConfig({ ...gridConfig, rows: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                  <DynamicControlGroup>
                    <DynamicControl id="grid-gapx" label="Gap X" value={`${gridConfig.gapX}`} unit="px" numericValue={gridConfig.gapX} numericMin={0} numericMax={100} numericStep={1} onNumericChange={(v) => setGridConfig({ ...gridConfig, gapX: v })} icon={<MoveHorizontal style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={gridConfig.gapX} min={0} max={100} step={1} onChange={(v) => setGridConfig({ ...gridConfig, gapX: v })} />
                    </DynamicControl>
                    <DynamicControl id="grid-gapy" label="Gap Y" value={`${gridConfig.gapY}`} unit="px" numericValue={gridConfig.gapY} numericMin={0} numericMax={100} numericStep={1} onNumericChange={(v) => setGridConfig({ ...gridConfig, gapY: v })} icon={<MoveVertical style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={gridConfig.gapY} min={0} max={100} step={1} onChange={(v) => setGridConfig({ ...gridConfig, gapY: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                  <DynamicControlGroup>
                    <DynamicControl id="grid-cellw" label="Cell W" value={`${gridConfig.cellW}`} unit="px" numericValue={gridConfig.cellW} numericMin={10} numericMax={200} numericStep={1} onNumericChange={(v) => setGridConfig({ ...gridConfig, cellW: v })} icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={gridConfig.cellW} min={10} max={200} step={1} onChange={(v) => setGridConfig({ ...gridConfig, cellW: v })} />
                    </DynamicControl>
                    <DynamicControl id="grid-cellh" label="Cell H" value={`${gridConfig.cellH}`} unit="px" numericValue={gridConfig.cellH} numericMin={10} numericMax={200} numericStep={1} onNumericChange={(v) => setGridConfig({ ...gridConfig, cellH: v })} icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={gridConfig.cellH} min={10} max={200} step={1} onChange={(v) => setGridConfig({ ...gridConfig, cellH: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                  <SoloControlGroup>
                    <SoloControl id="grid-seed" label="Seed" value={`${gridConfig.seed}`} numericValue={gridConfig.seed} numericMin={0} numericMax={1000} numericStep={1} onNumericChange={(v) => setGridConfig({ ...gridConfig, seed: v })} icon={<Shuffle style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <SoloControlNumeric value={gridConfig.seed} min={0} max={1000} step={1} onChange={(v) => setGridConfig({ ...gridConfig, seed: v })} />
                    </SoloControl>
                  </SoloControlGroup>
                </div>
              </TessorSection>
              <TessorSection title="Element Combo" collapsible={false}>
                <ElementComboGrid
                  selectedElements={patternConfig.elements}
                  onToggle={handleElementToggle}
                  onCustomUpload={handleElementSVGUpload}
                  onRemove={handleRemoveCustomSVG}
                  customSVGItems={customSVGItems}
                  onPhosphorSelect={handlePhosphorIconSelect}
                />
                <SoloControlGroup>
                  <SoloControl id="pattern-sequence" label="Sequence" value={patternConfig.sequence} icon={<Layers style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} scrollOptions={['sequential', 'checkerboard', 'random', 'row', 'col']} onScrollChange={(v) => setPatternConfig({ ...patternConfig, sequence: v })}>
                    <SoloControlDropdown value={patternConfig.sequence} options={['sequential', 'checkerboard', 'random', 'row', 'col']} onChange={(v) => setPatternConfig({ ...patternConfig, sequence: v })} />
                  </SoloControl>
                </SoloControlGroup>
              </TessorSection>
              <TessorSection title="Transforms">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
                  <DynamicControlGroup>
                    <DynamicControl id="rot-mode" label="Rot Mode" value={transformConfig.rotMode} icon={<RotateCcw style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} scrollOptions={['uniform', 'radial', 'wave', 'per-element']} onScrollChange={(v) => setTransformConfig({ ...transformConfig, rotMode: v })}>
                      <DynamicControlDropdown value={transformConfig.rotMode} options={['uniform', 'radial', 'wave', 'per-element']} onChange={(v) => setTransformConfig({ ...transformConfig, rotMode: v })} />
                    </DynamicControl>
                    <DynamicControl id="rot-amt" label="Rot Amt" value={`${transformConfig.rotAmt}`} unit="°" numericValue={transformConfig.rotAmt} numericMin={-360} numericMax={360} numericStep={1} onNumericChange={(v) => setTransformConfig({ ...transformConfig, rotAmt: v })} icon={<ChevronsUpDown style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={transformConfig.rotAmt} min={-360} max={360} step={1} onChange={(v) => setTransformConfig({ ...transformConfig, rotAmt: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                  <DynamicControlGroup>
                    <DynamicControl id="scale-mode-t" label="Scale Mode" value={transformConfig.scaleMode} icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} scrollOptions={['uniform', 'radial', 'radial-inv', 'wave']} onScrollChange={(v) => setTransformConfig({ ...transformConfig, scaleMode: v })}>
                      <DynamicControlDropdown value={transformConfig.scaleMode} options={['uniform', 'radial', 'radial-inv', 'wave']} onChange={(v) => setTransformConfig({ ...transformConfig, scaleMode: v })} />
                    </DynamicControl>
                    <DynamicControl id="scale-amt-t" label="Scale Amt" value={`${transformConfig.scaleAmt}`} numericValue={transformConfig.scaleAmt} numericMin={0.1} numericMax={3} numericStep={0.1} onNumericChange={(v) => setTransformConfig({ ...transformConfig, scaleAmt: v })} icon={<ChevronsUpDown style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={transformConfig.scaleAmt} min={0.1} max={3} step={0.1} onChange={(v) => setTransformConfig({ ...transformConfig, scaleAmt: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                  <DynamicControlGroup>
                    <DynamicControl id="opacity-mode-t" label="Opac Mode" value={transformConfig.opacityMode} icon={<Eye style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} scrollOptions={['uniform', 'radial', 'radial-inv', 'wave', 'random']} onScrollChange={(v) => setTransformConfig({ ...transformConfig, opacityMode: v })}>
                      <DynamicControlDropdown value={transformConfig.opacityMode} options={['uniform', 'radial', 'radial-inv', 'wave', 'random']} onChange={(v) => setTransformConfig({ ...transformConfig, opacityMode: v })} />
                    </DynamicControl>
                    <DynamicControl id="opacity-amt-t" label="Opac Amt" value={`${transformConfig.opacityAmt}`} numericValue={transformConfig.opacityAmt} numericMin={0} numericMax={1} numericStep={0.01} onNumericChange={(v) => setTransformConfig({ ...transformConfig, opacityAmt: v })} icon={<ChevronsUpDown style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={transformConfig.opacityAmt} min={0} max={1} step={0.01} onChange={(v) => setTransformConfig({ ...transformConfig, opacityAmt: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                  <DynamicControlGroup>
                    <DynamicControl id="wave-freq" label="Wave Freq" value={`${transformConfig.waveFreq}`} numericValue={transformConfig.waveFreq} numericMin={0} numericMax={10} numericStep={0.1} onNumericChange={(v) => setTransformConfig({ ...transformConfig, waveFreq: v })} icon={<Activity style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={transformConfig.waveFreq} min={0} max={10} step={0.1} onChange={(v) => setTransformConfig({ ...transformConfig, waveFreq: v })} />
                    </DynamicControl>
                    <DynamicControl id="wave-phase" label="Wave Phase" value={`${transformConfig.wavePhase}`} numericValue={transformConfig.wavePhase} numericMin={0} numericMax={1} numericStep={0.01} onNumericChange={(v) => setTransformConfig({ ...transformConfig, wavePhase: v })} icon={<Activity style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={transformConfig.wavePhase} min={0} max={1} step={0.01} onChange={(v) => setTransformConfig({ ...transformConfig, wavePhase: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                </div>
              </TessorSection>
            </div>
          </TessorTab>

          {/* Elements Tab */}
          <TessorTab label="Elements">
            <div className="flex flex-col" style={{ gap: 'var(--t-space-5)' }}>
              <TessorSection title="Line" collapsible={false}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
                  <DynamicControlGroup>
                    <DynamicControl id="line-length" label="Length" value={`${lineConfig.length}`} unit="px" numericValue={lineConfig.length!} numericMin={1} numericMax={200} numericStep={1} onNumericChange={(v) => setLineConfig({ ...lineConfig, length: v })} icon={<Minus style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={lineConfig.length!} min={1} max={200} step={1} onChange={(v) => setLineConfig({ ...lineConfig, length: v })} />
                    </DynamicControl>
                    <DynamicControl id="line-angle" label="Angle" value={`${lineConfig.angle}`} unit="°" numericValue={lineConfig.angle!} numericMin={0} numericMax={360} numericStep={1} onNumericChange={(v) => setLineConfig({ ...lineConfig, angle: v })} icon={<RotateCcw style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={lineConfig.angle!} min={0} max={360} step={1} onChange={(v) => setLineConfig({ ...lineConfig, angle: v })} />
                    </DynamicControl>
                    <DynamicControl id="line-strokew" label="Stroke W" value={`${lineConfig.strokeWidth}`} unit="px" numericValue={lineConfig.strokeWidth!} numericMin={1} numericMax={20} numericStep={1} onNumericChange={(v) => setLineConfig({ ...lineConfig, strokeWidth: v })} icon={<PenLine style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={lineConfig.strokeWidth!} min={1} max={20} step={1} onChange={(v) => setLineConfig({ ...lineConfig, strokeWidth: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                  <DynamicControlGroup>
                    <DynamicColorControl id="line-stroke" label="Stroke" value={lineConfig.stroke!} onChange={(v) => setLineConfig({ ...lineConfig, stroke: v })} icon={<Pipette style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} />
                    <DynamicControl id="line-cap" label="Line Cap" value={lineConfig.lineCap!} icon={<Minus style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} scrollOptions={['butt', 'round', 'square']} onScrollChange={(v) => setLineConfig({ ...lineConfig, lineCap: v })}>
                      <DynamicControlDropdown value={lineConfig.lineCap!} options={['butt', 'round', 'square']} onChange={(v) => setLineConfig({ ...lineConfig, lineCap: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                </div>
              </TessorSection>
              <TessorSection title="Dot" collapsible={false}>
                <DynamicControlGroup>
                  <DynamicControl id="dot-radius" label="Radius" value={`${dotConfig.radius}`} unit="px" numericValue={dotConfig.radius!} numericMin={1} numericMax={50} numericStep={1} onNumericChange={(v) => setDotConfig({ ...dotConfig, radius: v })} icon={<Circle style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                    <DynamicControlNumeric value={dotConfig.radius!} min={1} max={50} step={1} onChange={(v) => setDotConfig({ ...dotConfig, radius: v })} />
                  </DynamicControl>
                  <DynamicColorControl id="dot-fill" label="Fill" value={dotConfig.fill!} onChange={(v) => setDotConfig({ ...dotConfig, fill: v })} icon={<Pipette style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} />
                </DynamicControlGroup>
              </TessorSection>
              <TessorSection title="Square" collapsible={false}>
                <DynamicControlGroup>
                  <DynamicControl id="sq-size" label="Size" value={`${squareConfig.size}`} unit="px" numericValue={squareConfig.size!} numericMin={1} numericMax={200} numericStep={1} onNumericChange={(v) => setSquareConfig({ ...squareConfig, size: v })} icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                    <DynamicControlNumeric value={squareConfig.size!} min={1} max={200} step={1} onChange={(v) => setSquareConfig({ ...squareConfig, size: v })} />
                  </DynamicControl>
                  <DynamicControl id="sq-radius" label="Radius" value={`${squareConfig.radius}`} unit="px" numericValue={squareConfig.radius!} numericMin={0} numericMax={50} numericStep={1} onNumericChange={(v) => setSquareConfig({ ...squareConfig, radius: v })} icon={<Circle style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                    <DynamicControlNumeric value={squareConfig.radius!} min={0} max={50} step={1} onChange={(v) => setSquareConfig({ ...squareConfig, radius: v })} />
                  </DynamicControl>
                  <DynamicColorControl id="sq-fill" label="Fill" value={squareConfig.fill!} onChange={(v) => setSquareConfig({ ...squareConfig, fill: v })} icon={<Pipette style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} />
                </DynamicControlGroup>
              </TessorSection>
              <TessorSection title="Rectangle" collapsible={false}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
                  <DynamicControlGroup>
                    <DynamicControl id="rect-width" label="Width" value={`${rectConfig.width}`} unit="px" numericValue={rectConfig.width!} numericMin={1} numericMax={200} numericStep={1} onNumericChange={(v) => setRectConfig({ ...rectConfig, width: v })} icon={<MoveHorizontal style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={rectConfig.width!} min={1} max={200} step={1} onChange={(v) => setRectConfig({ ...rectConfig, width: v })} />
                    </DynamicControl>
                    <DynamicControl id="rect-height" label="Height" value={`${rectConfig.height}`} unit="px" numericValue={rectConfig.height!} numericMin={1} numericMax={200} numericStep={1} onNumericChange={(v) => setRectConfig({ ...rectConfig, height: v })} icon={<MoveVertical style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={rectConfig.height!} min={1} max={200} step={1} onChange={(v) => setRectConfig({ ...rectConfig, height: v })} />
                    </DynamicControl>
                    <DynamicControl id="rect-radius" label="Radius" value={`${rectConfig.radius}`} unit="px" numericValue={rectConfig.radius!} numericMin={0} numericMax={50} numericStep={1} onNumericChange={(v) => setRectConfig({ ...rectConfig, radius: v })} icon={<Circle style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={rectConfig.radius!} min={0} max={50} step={1} onChange={(v) => setRectConfig({ ...rectConfig, radius: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                  <SoloControlGroup>
                    <SoloControl id="rect-fill" label="Fill" value={rectConfig.fill!.replace('#', '')} icon={<Pipette style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} onTextChange={(v) => setRectConfig({ ...rectConfig, fill: '#' + v.replace('#', '') })}>
                      <SoloControlColor value={rectConfig.fill!} onChange={(v) => setRectConfig({ ...rectConfig, fill: v })} />
                    </SoloControl>
                  </SoloControlGroup>
                </div>
              </TessorSection>
              <TessorSection title="Star" collapsible={false}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
                  <DynamicControlGroup>
                    <DynamicControl id="star-size" label="Size" value={`${starConfig.size}`} unit="px" numericValue={starConfig.size!} numericMin={10} numericMax={100} numericStep={1} onNumericChange={(v) => setStarConfig({ ...starConfig, size: v })} icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={starConfig.size!} min={10} max={100} step={1} onChange={(v) => setStarConfig({ ...starConfig, size: v })} />
                    </DynamicControl>
                    <DynamicControl id="star-inner" label="Inner" value={`${starConfig.innerRatio}`} numericValue={starConfig.innerRatio!} numericMin={0.1} numericMax={0.9} numericStep={0.01} onNumericChange={(v) => setStarConfig({ ...starConfig, innerRatio: v })} icon={<Hash style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={starConfig.innerRatio!} min={0.1} max={0.9} step={0.01} onChange={(v) => setStarConfig({ ...starConfig, innerRatio: v })} />
                    </DynamicControl>
                    <DynamicControl id="star-smooth" label="Smooth" value={`${starConfig.smoothness}`} numericValue={starConfig.smoothness!} numericMin={0} numericMax={1} numericStep={0.01} onNumericChange={(v) => setStarConfig({ ...starConfig, smoothness: v })} icon={<Hash style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={starConfig.smoothness!} min={0} max={1} step={0.01} onChange={(v) => setStarConfig({ ...starConfig, smoothness: v })} />
                    </DynamicControl>
                  </DynamicControlGroup>
                  <SoloControlGroup>
                    <SoloControl id="star-fill" label="Fill" value={starConfig.fill!.replace('#', '')} icon={<Pipette style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} onTextChange={(v) => setStarConfig({ ...starConfig, fill: '#' + v.replace('#', '') })}>
                      <SoloControlColor value={starConfig.fill!} onChange={(v) => setStarConfig({ ...starConfig, fill: v })} />
                    </SoloControl>
                  </SoloControlGroup>
                </div>
              </TessorSection>
              <TessorSection title="Triangle" collapsible={false}>
                <DynamicControlGroup>
                  <DynamicControl id="tri-size" label="Size" value={`${triangleConfig.size}`} unit="px" numericValue={triangleConfig.size!} numericMin={1} numericMax={200} numericStep={1} onNumericChange={(v) => setTriangleConfig({ ...triangleConfig, size: v })} icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                    <DynamicControlNumeric value={triangleConfig.size!} min={1} max={200} step={1} onChange={(v) => setTriangleConfig({ ...triangleConfig, size: v })} />
                  </DynamicControl>
                  <DynamicColorControl id="tri-fill" label="Fill" value={triangleConfig.fill!} onChange={(v) => setTriangleConfig({ ...triangleConfig, fill: v })} icon={<Pipette style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} />
                </DynamicControlGroup>
              </TessorSection>
              <TessorSection title="Cross" collapsible={false}>
                <DynamicControlGroup>
                  <DynamicControl id="cross-size" label="Size" value={`${crossConfig.size}`} unit="px" numericValue={crossConfig.size!} numericMin={1} numericMax={200} numericStep={1} onNumericChange={(v) => setCrossConfig({ ...crossConfig, size: v })} icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                    <DynamicControlNumeric value={crossConfig.size!} min={1} max={200} step={1} onChange={(v) => setCrossConfig({ ...crossConfig, size: v })} />
                  </DynamicControl>
                  <DynamicControl id="cross-thick" label="Thick" value={`${crossConfig.crossThickness}`} unit="px" numericValue={crossConfig.crossThickness!} numericMin={1} numericMax={50} numericStep={1} onNumericChange={(v) => setCrossConfig({ ...crossConfig, crossThickness: v })} icon={<Minus style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                    <DynamicControlNumeric value={crossConfig.crossThickness!} min={1} max={50} step={1} onChange={(v) => setCrossConfig({ ...crossConfig, crossThickness: v })} />
                  </DynamicControl>
                  <DynamicColorControl id="cross-fill" label="Fill" value={crossConfig.fill!} onChange={(v) => setCrossConfig({ ...crossConfig, fill: v })} icon={<Pipette style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} />
                </DynamicControlGroup>
              </TessorSection>
              <TessorSection title="Diamond" collapsible={false}>
                <DynamicControlGroup>
                  <DynamicControl id="dia-size" label="Size" value={`${diamondConfig.size}`} unit="px" numericValue={diamondConfig.size!} numericMin={1} numericMax={200} numericStep={1} onNumericChange={(v) => setDiamondConfig({ ...diamondConfig, size: v })} icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                    <DynamicControlNumeric value={diamondConfig.size!} min={1} max={200} step={1} onChange={(v) => setDiamondConfig({ ...diamondConfig, size: v })} />
                  </DynamicControl>
                  <DynamicColorControl id="dia-fill" label="Fill" value={diamondConfig.fill!} onChange={(v) => setDiamondConfig({ ...diamondConfig, fill: v })} icon={<Pipette style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} />
                </DynamicControlGroup>
              </TessorSection>
              {customSVGItems.map(item => (
                <TessorSection key={item.id} title={item.name} collapsible={false}>
                  <DynamicControlGroup>
                    <DynamicControl id={`svg-${item.id}-size`} label="Size" value={`${item.config.size}`} unit="px" numericValue={item.config.size!} numericMin={1} numericMax={200} numericStep={1} onNumericChange={(v) => { setCustomSVGItems(prev => prev.map(i => i.id === item.id ? { ...i, config: { ...i.config, size: v } } : i)); }} icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <DynamicControlNumeric value={item.config.size!} min={1} max={200} step={1} onChange={(v) => { setCustomSVGItems(prev => prev.map(i => i.id === item.id ? { ...i, config: { ...i.config, size: v } } : i)); }} />
                    </DynamicControl>
                    <DynamicColorControl id={`svg-${item.id}-fill`} label="Fill" value={item.config.fill!} onChange={(v) => { setCustomSVGItems(prev => prev.map(i => i.id === item.id ? { ...i, config: { ...i.config, fill: v } } : i)); }} icon={<Pipette style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />} />
                  </DynamicControlGroup>
                </TessorSection>
              ))}
            </div>
          </TessorTab>

          {/* Clip/Mask Tab */}
          <TessorTab label="Clip/Mask">
            <div className="flex flex-col" style={{ gap: 'var(--t-space-5)' }}>
              <TessorSection title="Shape">
                <ClipShapeGrid 
                  selectedPreset={clipConfig.preset}
                  onSelect={handleClipShapeSelect}
                  onCustomUpload={handleSVGUpload}
                />
              </TessorSection>
              <TessorSection title="Controls" collapsible={false}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
                  <SoloControlGroup>
                    <SoloControl id="clip-scale" label="Scale" value={`${clipConfig.scale}`} numericValue={clipConfig.scale} numericMin={0.1} numericMax={20} numericStep={0.1} onNumericChange={(v) => setClipConfig({ ...clipConfig, scale: v })} icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}>
                      <SoloControlNumeric value={clipConfig.scale} min={0.1} max={20} step={0.1} onChange={(v) => setClipConfig({ ...clipConfig, scale: v })} />
                    </SoloControl>
                  </SoloControlGroup>
                  <TessorButton label="Fit to Canvas" onClick={handleFitToCanvas} variant="secondary" fullWidth />
                </div>
              </TessorSection>
            </div>
          </TessorTab>

          {/* Motion Tab */}
          <TessorTab label="Motion">
            <div className="flex flex-col" style={{ gap: 'var(--t-space-5)' }}>
              <TessorSection title="Animation" collapsible={false}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-space-2)' }}>
                  <SoloControlGroup label="Animation controls row 1">
                    <SoloControl
                      id="anim-state"
                      label="State"
                      value={animConfig.enabled ? 'ON' : 'OFF'}
                      icon={<Play style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                      scrollOptions={['OFF', 'ON']}
                      onScrollChange={(v) => setAnimConfig({ ...animConfig, enabled: v === 'ON' })}
                    >
                      <SoloControlToggle value={animConfig.enabled} onChange={(v) => setAnimConfig({ ...animConfig, enabled: v })} />
                    </SoloControl>
                  </SoloControlGroup>
                  <DynamicControlGroup label="Animation controls row 2">
                    <DynamicControl
                      id="anim-duration"
                      label="Duration"
                      value={`${animConfig.duration}`}
                      unit="ms"
                      numericValue={animConfig.duration}
                      numericMin={100}
                      numericMax={10000}
                      numericStep={100}
                      onNumericChange={(v) => setAnimConfig({ ...animConfig, duration: v })}
                      icon={<Timer style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                    >
                      <DynamicControlNumeric value={animConfig.duration} min={100} max={10000} step={100} onChange={(v) => setAnimConfig({ ...animConfig, duration: v })} />
                    </DynamicControl>
                    <DynamicControl
                      id="anim-easing"
                      label="Easing"
                      value={animConfig.easing}
                      icon={<TrendingUp style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                      scrollOptions={['linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInSine', 'easeOutSine', 'easeInOutSine']}
                      onScrollChange={(v) => setAnimConfig({ ...animConfig, easing: v })}
                    >
                      <DynamicControlDropdown value={animConfig.easing} options={['linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInSine', 'easeOutSine', 'easeInOutSine']} onChange={(v) => setAnimConfig({ ...animConfig, easing: v })} />
                    </DynamicControl>
                    <DynamicControl
                      id="anim-direction"
                      label="Direction"
                      value={animConfig.direction}
                      icon={<ArrowLeftRight style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                      scrollOptions={['normal', 'reverse', 'alternate']}
                      onScrollChange={(v) => setAnimConfig({ ...animConfig, direction: v })}
                    >
                      <DynamicControlSegmented
                        value={animConfig.direction}
                        options={['normal', 'reverse', 'alternate']}
                        icons={{
                          normal: <ArrowRight style={{ width: 'var(--t-font-md)', height: 'var(--t-font-md)' }} />,
                          reverse: <ArrowLeft style={{ width: 'var(--t-font-md)', height: 'var(--t-font-md)' }} />,
                          alternate: <ArrowLeftRight style={{ width: 'var(--t-font-md)', height: 'var(--t-font-md)' }} />,
                        }}
                        onChange={(v) => setAnimConfig({ ...animConfig, direction: v })}
                      />
                    </DynamicControl>
                  </DynamicControlGroup>
                </div>
              </TessorSection>

              <TessorSection title="Stagger" collapsible={false}>
                <DynamicControlGroup label="Stagger controls">
                  <DynamicControl
                    id="stagger-type"
                    label="Type"
                    value={animConfig.staggerType}
                    icon={<Layers style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                    scrollOptions={['none', 'index', 'distance', 'horizontal', 'vertical']}
                    onScrollChange={(v) => setAnimConfig({ ...animConfig, staggerType: v })}
                  >
                    <DynamicControlDropdown value={animConfig.staggerType} options={['none', 'index', 'distance', 'horizontal', 'vertical']} onChange={(v) => setAnimConfig({ ...animConfig, staggerType: v })} />
                  </DynamicControl>
                  <DynamicControl
                    id="stagger-amount"
                    label="Amount"
                    value={`${animConfig.staggerAmount}`}
                    unit="ms"
                    numericValue={animConfig.staggerAmount}
                    numericMin={0}
                    numericMax={500}
                    numericStep={10}
                    onNumericChange={(v) => setAnimConfig({ ...animConfig, staggerAmount: v })}
                    icon={<Hash style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                  >
                    <DynamicControlNumeric value={animConfig.staggerAmount} min={0} max={500} step={10} onChange={(v) => setAnimConfig({ ...animConfig, staggerAmount: v })} />
                  </DynamicControl>
                </DynamicControlGroup>
              </TessorSection>

              <TessorSection title="Rotation" collapsible={false}>
                <DynamicControlGroup label="Rotation controls">
                  <DynamicControl
                    id="rot-state"
                    label="State"
                    value={animConfig.rotationEnabled ? 'ON' : 'OFF'}
                    icon={<RotateCcw style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                    scrollOptions={['OFF', 'ON']}
                    onScrollChange={(v) => setAnimConfig({ ...animConfig, rotationEnabled: v === 'ON' })}
                  >
                    <DynamicControlToggle value={animConfig.rotationEnabled} onChange={(v) => setAnimConfig({ ...animConfig, rotationEnabled: v })} />
                  </DynamicControl>
                  <DynamicControl
                    id="rot-from"
                    label="From"
                    value={`${animConfig.rotationFrom}`}
                    unit="°"
                    numericValue={animConfig.rotationFrom}
                    numericMin={-360}
                    numericMax={360}
                    numericStep={1}
                    onNumericChange={(v) => setAnimConfig({ ...animConfig, rotationFrom: v })}
                    icon={<ChevronsUpDown style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                  >
                    <DynamicControlNumeric value={animConfig.rotationFrom} min={-360} max={360} step={1} onChange={(v) => setAnimConfig({ ...animConfig, rotationFrom: v })} />
                  </DynamicControl>
                </DynamicControlGroup>
              </TessorSection>

              <TessorSection title="Scale" collapsible={false}>
                <DynamicControlGroup label="Scale controls">
                  <DynamicControl
                    id="scale-state"
                    label="State"
                    value={animConfig.scaleEnabled ? 'ON' : 'OFF'}
                    icon={<Maximize2 style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                    scrollOptions={['OFF', 'ON']}
                    onScrollChange={(v) => setAnimConfig({ ...animConfig, scaleEnabled: v === 'ON' })}
                  >
                    <DynamicControlToggle value={animConfig.scaleEnabled} onChange={(v) => setAnimConfig({ ...animConfig, scaleEnabled: v })} />
                  </DynamicControl>
                  <DynamicControl
                    id="scale-from"
                    label="From"
                    value={`${animConfig.scaleFrom}`}
                    numericValue={animConfig.scaleFrom}
                    numericMin={0}
                    numericMax={3}
                    numericStep={0.1}
                    onNumericChange={(v) => setAnimConfig({ ...animConfig, scaleFrom: v })}
                    icon={<ChevronsUpDown style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                  >
                    <DynamicControlNumeric value={animConfig.scaleFrom} min={0} max={3} step={0.1} onChange={(v) => setAnimConfig({ ...animConfig, scaleFrom: v })} />
                  </DynamicControl>
                </DynamicControlGroup>
              </TessorSection>

              <TessorSection title="Opacity" collapsible={false}>
                <DynamicControlGroup label="Opacity controls">
                  <DynamicControl
                    id="opacity-state"
                    label="State"
                    value={animConfig.opacityEnabled ? 'ON' : 'OFF'}
                    icon={<Eye style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                    scrollOptions={['OFF', 'ON']}
                    onScrollChange={(v) => setAnimConfig({ ...animConfig, opacityEnabled: v === 'ON' })}
                  >
                    <DynamicControlToggle value={animConfig.opacityEnabled} onChange={(v) => setAnimConfig({ ...animConfig, opacityEnabled: v })} />
                  </DynamicControl>
                  <DynamicControl
                    id="opacity-from"
                    label="From"
                    value={`${animConfig.opacityFrom}`}
                    numericValue={animConfig.opacityFrom}
                    numericMin={0}
                    numericMax={1}
                    numericStep={0.01}
                    onNumericChange={(v) => setAnimConfig({ ...animConfig, opacityFrom: v })}
                    icon={<ChevronsUpDown style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                  >
                    <DynamicControlNumeric value={animConfig.opacityFrom} min={0} max={1} step={0.01} onChange={(v) => setAnimConfig({ ...animConfig, opacityFrom: v })} />
                  </DynamicControl>
                  <DynamicControl
                    id="opacity-to"
                    label="To"
                    value={`${animConfig.opacityTo}`}
                    numericValue={animConfig.opacityTo}
                    numericMin={0}
                    numericMax={1}
                    numericStep={0.01}
                    onNumericChange={(v) => setAnimConfig({ ...animConfig, opacityTo: v })}
                    icon={<ChevronsUpDown style={{ width: 'var(--t-icon-xs)', height: 'var(--t-icon-xs)' }} />}
                  >
                    <DynamicControlNumeric value={animConfig.opacityTo} min={0} max={1} step={0.01} onChange={(v) => setAnimConfig({ ...animConfig, opacityTo: v })} />
                  </DynamicControl>
                </DynamicControlGroup>
              </TessorSection>
            </div>
          </TessorTab>
        </TessorPanel>
      </div>
    </div>
  );
}

export default PatternTool;