#!/bin/bash

# Image Generator using fal.ai Nano Banana Pro API
# Usage: image-gen.sh "prompt" [aspect_ratio] [resolution]
# Output: /tmp/images/generated_[timestamp].png

set -e

API_URL="https://fal.run/fal-ai/nano-banana-pro"

# Check if API key is set
if [ -z "$FAL_KEY" ]; then
    echo "Error: FAL_KEY environment variable is not set"
    echo "Please set it with: export FAL_KEY=your_api_key"
    exit 1
fi

# Check if prompt is provided
if [ -z "$1" ]; then
    echo "Error: Please provide an image prompt"
    echo "Usage: image-gen.sh \"prompt\" [aspect_ratio] [resolution]"
    echo ""
    echo "Examples:"
    echo "  image-gen.sh \"A futuristic tech blog header\""
    echo "  image-gen.sh \"Modern AI visualization\" \"16:9\" \"2K\""
    exit 1
fi

PROMPT="$1"
ASPECT_RATIO="${2:-16:9}"
RESOLUTION="${3:-1K}"

OUTPUT_DIR="/tmp/images"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="${OUTPUT_DIR}/generated_${TIMESTAMP}.png"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Generating image with Nano Banana Pro..."
echo "Prompt: $PROMPT"
echo "Aspect Ratio: $ASPECT_RATIO"
echo "Resolution: $RESOLUTION"
echo ""

# Build request body
REQUEST_BODY=$(cat << EOF
{
  "prompt": "$PROMPT",
  "aspect_ratio": "$ASPECT_RATIO",
  "resolution": "$RESOLUTION",
  "output_format": "png",
  "num_images": 1
}
EOF
)

# Call fal.ai API
echo "Calling fal.ai API..."
response=$(curl -s -X POST "$API_URL" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "$REQUEST_BODY")

# Check for errors
if echo "$response" | grep -q '"error"'; then
    echo "Error from API:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    exit 1
fi

# Extract image URL
image_url=$(echo "$response" | jq -r '.images[0].url' 2>/dev/null)

if [ -z "$image_url" ] || [ "$image_url" = "null" ]; then
    echo "Error: Failed to get image URL from response"
    echo "Response:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    exit 1
fi

echo "Image URL: $image_url"
echo ""

# Download image
echo "Downloading image to: $OUTPUT_FILE"
curl -s -L -o "$OUTPUT_FILE" "$image_url"

if [ -f "$OUTPUT_FILE" ]; then
    file_size=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
    echo ""
    echo "Success!"
    echo "Image saved to: $OUTPUT_FILE"
    echo "File size: $file_size"

    # Extract dimensions from response
    width=$(echo "$response" | jq -r '.images[0].width' 2>/dev/null)
    height=$(echo "$response" | jq -r '.images[0].height' 2>/dev/null)
    if [ "$width" != "null" ] && [ "$height" != "null" ]; then
        echo "Dimensions: ${width}x${height}"
    fi
else
    echo "Error: Failed to download image"
    exit 1
fi
