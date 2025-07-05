# Annotation Data Format Documentation

This document describes the required format for diagram annotation data that will be used with our YOLO-trained model integration.

## JSON Structure Overview

The annotation data should be formatted as a JSON object with the following top-level structure:

```json
{
  "boxes": [ ... ],  // Array of annotation boxes (required)
  "height": 9352,    // Original image height in pixels (required)
  "width": 6612,     // Original image width in pixels (required)
  "key": "00097.jpg" // Filename or unique identifier for the image (required)
}
```

## Box Object Structure

Each item in the `boxes` array represents an annotation/bounding box for a detected element and must include:

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Class name of the detected element (e.g., "drawing", "table", "text") |
| `x` | string | Center X-coordinate of the bounding box (as string, relative to original image dimensions) |
| `y` | string | Center Y-coordinate of the bounding box (as string, relative to original image dimensions) |
| `width` | string | Width of the bounding box (as string, in pixels) |
| `height` | string | Height of the bounding box (as string, in pixels) |
| `color` | string | Hexadecimal color code for rendering the box (e.g., "#FF8000") |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Box type, e.g., "polygon" or "rectangle" (default is "rectangle" if not specified) |
| `points` | array | For polygon types, an array of coordinate pairs `[[x1,y1], [x2,y2], ...]` that define the vertices |

## Coordinate System

- The coordinate system origin (0,0) is at the top-left corner of the image
- X increases to the right, Y increases downward
- The `x` and `y` values in each box represent the center point of the bounding box
- All coordinates should be relative to the original image dimensions specified in the `width` and `height` fields

## Example

Here's an example of a valid annotation data object:

```json
{
  "boxes": [
    {
      "type": "polygon",
      "label": "drawing",
      "x": "5445.1197",
      "y": "1485.4321",
      "width": "499.1108",
      "height": "1076.4000",
      "points": [
        [5195.5643488583955, 947.2320351155006],
        [5694.675132291566, 947.2320351155006],
        [5694.675132291566, 2023.6320750194784],
        [5195.5643488583955, 2023.6320750194784]
      ],
      "color": "#FF8000"
    },
    {
      "label": "Structure diagram",
      "x": "3340.83",
      "y": "3274.95",
      "width": "3265.60",
      "height": "3331.46",
      "color": "#00FFCE"
    }
  ],
  "height": 9352,
  "width": 6612,
  "key": "00097.jpg"
}
```

## Notes for YOLO Training

When preparing this data for YOLO training:

1. Ensure all class labels are consistent across your dataset
2. The values for x, y, width, and height can be strings in our frontend format, but you may need to convert them to floating-point numbers when preparing YOLO training data
3. For YOLO specifically, you'll need to normalize the coordinates (divide by image width/height) to get values between 0 and 1
4. If using polygon annotations, you'll need to convert them to bounding boxes for YOLO training (min/max of the polygon coordinates)
5. Colors are for visualization purposes in our frontend and are not needed for the YOLO model

## Supported Object Classes

Our current implementation supports the following classes:

- drawing
- Structure diagram
- table
- illustration
- text
- other

Please maintain consistent capitalization and naming conventions for these classes in your annotations.
