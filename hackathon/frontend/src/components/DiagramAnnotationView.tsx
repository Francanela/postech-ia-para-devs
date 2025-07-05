'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

// Mock data types based on the provided example
interface AnnotationPoint {
  0: number;
  1: number;
}

interface AnnotationBox {
  type?: string;
  label: string;
  x: string;
  y: string;
  width: string;
  height: string;
  points?: AnnotationPoint[];
  color: string;
}

interface AnnotationData {
  boxes: AnnotationBox[];
  height: number;
  width: number;
  key: string;
}

// Demo annotation data from YOLO team
const MOCK_ANNOTATION_DATA: AnnotationData = {
  boxes: [
    {
      label: "Application",
      x: "426",
      y: "13",
      width: "65",
      height: "13",
      color: "#00FFCE"
    },
    {
      label: "Events",
      x: "496",
      y: "14",
      width: "37",
      height: "9",
      color: "#00FFCE"
    },
    {
      label: "ra}",
      x: "1685",
      y: "59",
      width: "30",
      height: "20",
      color: "#00FFCE"
    },
    {
      label: "Write",
      x: "1495",
      y: "83",
      width: "30",
      height: "10",
      color: "#00FFCE"
    },
    {
      label: "BF",
      x: "62",
      y: "118",
      width: "16",
      height: "3",
      color: "#00FFCE"
    },
    {
      label: "Systems",
      x: "89",
      y: "112",
      width: "62",
      height: "13",
      color: "#00FFCE"
    },
    {
      label: "of",
      x: "139",
      y: "104",
      width: "15",
      height: "25",
      color: "#00FFCE"
    },
    {
      label: "aws",
      x: "327",
      y: "115",
      width: "39",
      height: "13",
      color: "#00FFCE"
    },
    {
      label: "Event",
      x: "1356",
      y: "172",
      width: "40",
      height: "11",
      color: "#00FFCE"
    },
    {
      label: "Bus",
      x: "1401",
      y: "172",
      width: "24",
      height: "11",
      color: "#00FFCE"
    },
    {
      label: "Amazon",
      x: "1355",
      y: "206",
      width: "46",
      height: "9",
      color: "#00FFCE"
    },
    {
      label: "EventBridge",
      x: "1406",
      y: "205",
      width: "69",
      height: "13",
      color: "#00FFCE"
    },
    {
      label: "File",
      x: "366",
      y: "208",
      width: "19",
      height: "10",
      color: "#00FFCE"
    },
    {
      label: "System",
      x: "390",
      y: "209",
      width: "40",
      height: "12",
      color: "#00FFCE"
    },
    {
      label: "Changes",
      x: "434",
      y: "208",
      width: "49",
      height: "13",
      color: "#00FFCE"
    }
  ],
  height: 9352,
  width: 6612,
  key: "DiagramSample.png"
};

// Generate a consistent color based on label string
function generateColorFromLabel(label: string): string {
  // Simple hash function to generate a number from a string
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert hash to a hex color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).slice(-2);
  }
  
  return color;
}

export default function DiagramAnnotationView({ 
  imageUrl, 
  annotationData = MOCK_ANNOTATION_DATA,
  onSelect = (label: string) => {}
}: { 
  imageUrl: string;
  annotationData?: AnnotationData;
  onSelect?: (label: string) => void;
}) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [showAllLabels, setShowAllLabels] = useState(false);
  const [boxScaleFactor, setBoxScaleFactor] = useState(10); // Default scale factor
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
  // Process annotation data to ensure each label has a unique color
  const processedAnnotationData = useMemo(() => {
    const data = {...annotationData};
    const labelColors: Record<string, string> = {};
    
    // Assign colors to each unique label
    data.boxes = data.boxes.map((box: AnnotationBox) => {
      if (!labelColors[box.label]) {
        // If all boxes have the same color, generate new colors based on label
        if (data.boxes.every((b: AnnotationBox) => b.color === data.boxes[0].color)) {
          labelColors[box.label] = generateColorFromLabel(box.label);
        } else {
          labelColors[box.label] = box.color;
        }
      }
      
      return {
        ...box,
        color: labelColors[box.label]
      };
    });
    
    return data;
  }, [annotationData]);
  
  // Group boxes by label to create the class list
  const classes = [...new Set(processedAnnotationData.boxes.map(box => box.label))];
  const boxesByLabel: Record<string, AnnotationBox[]> = {};
  classes.forEach(label => {
    boxesByLabel[label] = processedAnnotationData.boxes.filter(box => box.label === label);
  });

  // Load image and set scale
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        
        // Calculate scale based on container size
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;
          const widthScale = containerWidth / img.width;
          const heightScale = containerHeight / img.height;
          setScale(Math.min(widthScale, heightScale) * 0.9); // 90% to leave some margin
        }
      };
      img.src = imageUrl;
    }
  }, [imageUrl, containerRef]);

  const handleBoxClick = (label: string) => {
    setSelectedLabel(label);
    onSelect(label);
  };

  // Zoom controls
  const zoomIn = () => setScale(prev => prev * 1.2);
  const zoomOut = () => setScale(prev => prev * 0.8);
  const resetZoom = () => {
    if (containerRef.current && imageSize.width && imageSize.height) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const widthScale = containerWidth / imageSize.width;
      const heightScale = containerHeight / imageSize.height;
      setScale(Math.min(widthScale, heightScale) * 0.9);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold">Diagram Annotation</h2>
        <div className="flex gap-2 items-center">
          <div className="flex items-center mr-4">
            <span className="text-sm mr-2">Box Size:</span>
            <button 
              className="p-1 bg-gray-100 rounded hover:bg-gray-200 text-sm" 
              onClick={() => setBoxScaleFactor(prev => Math.max(prev - 5, 5))}
            >
              -
            </button>
            <span className="mx-2">{boxScaleFactor}</span>
            <button 
              className="p-1 bg-gray-100 rounded hover:bg-gray-200 text-sm" 
              onClick={() => setBoxScaleFactor(prev => prev + 5)}
            >
              +
            </button>
          </div>
          
          <div className="flex items-center mr-4">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={showAllLabels}
                onChange={() => setShowAllLabels(!showAllLabels)}
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              <span className="ml-2 text-sm font-medium">Show All Labels</span>
            </label>
          </div>
          
          <button 
            className="p-2 bg-gray-100 rounded hover:bg-gray-200" 
            onClick={zoomIn}
          >
            Zoom +
          </button>
          <button 
            className="p-2 bg-gray-100 rounded hover:bg-gray-200" 
            onClick={zoomOut}
          >
            Zoom -
          </button>
          <button 
            className="p-2 bg-gray-100 rounded hover:bg-gray-200" 
            onClick={resetZoom}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-grow h-[calc(100vh-250px)]">
        {/* Left sidebar - Class list */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-medium mb-2">Classes</h3>
            <div className="space-y-2">
              {classes.map((label) => {
                const box = boxesByLabel[label][0]; // Use the first box for this label to get the color
                return (
                  <div 
                    key={label}
                    className={`flex items-center p-2 rounded cursor-pointer ${selectedLabel === label ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleBoxClick(label)}
                  >
                    <div 
                      className="w-4 h-4 mr-3 rounded-sm" 
                      style={{ backgroundColor: box.color }}
                    />
                    <div className="flex-grow">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-gray-500">{boxesByLabel[label].length}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium mb-2">Unused Classes</h3>
            <div className="text-gray-400 italic text-sm">
              Classes will appear here when identified but not used
            </div>
          </div>
        </div>

        {/* Main annotation view */}
        <div 
          ref={containerRef} 
          className="flex-grow relative bg-gray-900 overflow-auto"
        >
          <div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center"
            style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
          >
            {imageUrl && (
              <div className="relative">
                <img 
                  src={imageUrl} 
                  alt="Diagram to annotate" 
                  className="max-w-none"
                  style={{ 
                    width: `${imageSize.width}px`,
                    height: `${imageSize.height}px`
                  }}
                />
                
                {/* Render annotation boxes */}
                {processedAnnotationData.boxes.map((box: AnnotationBox, index: number) => {
                  // Convert to numeric values for calculations
                  const x = parseFloat(box.x);
                  const y = parseFloat(box.y);
                  const width = parseFloat(box.width);
                  const height = parseFloat(box.height);
                  
                  // Calculate position and dimensions
                  // Use a scaling factor to make boxes more visible (the original coordinates seem to be very small)
                  
                  const left = (x - width / 2) / 1000 * imageSize.width;
                  const top = (y - height / 2) / 1000 * imageSize.height;
                  const boxWidth = Math.max(width / 1000 * imageSize.width * boxScaleFactor, 30); // Minimum width of 30px
                  const boxHeight = Math.max(height / 1000 * imageSize.height * boxScaleFactor, 20); // Minimum height of 20px
                  
                  const isSelected = selectedLabel === box.label;
                  
                  return (
                    <div
                      key={index}
                      className={`absolute border-2 cursor-pointer transition-all ${isSelected ? 'border-4' : 'border-2'}`}
                      style={{
                        left: `${left}px`,
                        top: `${top}px`,
                        width: `${boxWidth}px`,
                        height: `${boxHeight}px`,
                        borderColor: box.color,
                        backgroundColor: `${box.color}22`, // Add 22 for 13% opacity
                      }}
                      onClick={() => handleBoxClick(box.label)}
                    >
                      {(isSelected || showAllLabels) && (
                        <div className="absolute -top-6 left-0 bg-black text-white text-xs px-1 py-0.5 rounded whitespace-nowrap z-10">
                          {box.label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
