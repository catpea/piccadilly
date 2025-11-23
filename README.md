# Piccadilly Animator 😛😺

A delightfully silly Node.js CLI that creates random-duration animations from multiple frames using ffmpeg. Perfect for creating those pre-AI video marvels!

## What It Does

Takes any number of images and creates an animated AVIF where each frame randomly plays for 0.1 to 2 seconds. The total duration is precisely controlled, making it perfect for later syncing with audio or just making the world smile!

piccadilly samples/lick-*

![sample](example.avif)

## Installation

```bash
# Install globally via npm
npm install -g piccadilly

# Or use with npx (no installation needed)
npx piccadilly -o my-silly-cat.avif samples/wink*.jpg
```

## Requirements

- **Node.js** (>= 14.0.0)
- **ffmpeg** with libaom-av1 support (for AVIF encoding)

### Installing ffmpeg

Piccadilly will check for ffmpeg and provide installation instructions if it's missing.

```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch
sudo pacman -S ffmpeg

# macOS
brew install ffmpeg
```

## Quick Start

```bash
# Basic usage with default files (creates 15-second animation)
piccadilly

# Use multiple images with glob patterns
piccadilly -o my-silly-cat.avif samples/wink*.jpg

# Specify individual files
piccadilly frame1.png frame2.png frame3.png

# Custom duration and max frame time
piccadilly --duration 30 --max 3 image1.jpg image2.jpg image3.jpg

# All together now!
piccadilly -d 20 -m 2.5 -o cat-derp.avif pics/*.png
```

## Usage

```
piccadilly [options] <files...>

Options:
  -d, --duration <seconds>   Total animation duration (default: 15)
  -m, --max <seconds>        Max duration per frame (default: 2)
  -o, --output <file>        Output filename (default: kitty-animation.avif)
  -h, --help                 Show this help

Arguments:
  <files...>                 Input image files (defaults to a.jpg b.jpg)

Examples:
  piccadilly -o my-silly-cat.avif samples/wink*.jpg
  piccadilly --duration 30 --max 3 frame1.png frame2.png frame3.png
  piccadilly image1.jpg image2.jpg
```

## How It Works

1. **Random Sequence Generation**: Creates a sequence of alternating frames with random durations that precisely total your target duration
2. **ffmpeg Concat**: Uses ffmpeg's concat demuxer to stitch frames together with exact timing
3. **AVIF Output**: Encodes as animated AVIF (like a modern, efficient GIF)

## The Beauty of Pre-AI

You're absolutely right about the charm of pixel art! There's something magical about:
- **Constraints breeding creativity**: Limited tools = infinite ingenuity
- **Intentional design**: Every pixel placed with purpose
- **Timeless appeal**: Rick Dangerous, Toki, Street Fighter - still beautiful!

This script embraces that philosophy: simple tools, creative use, memorable results.

## Why AVIF?

- **Tiny file sizes**: 50-60KB for 15 seconds
- **Modern browsers**: Wide support
- **Animated**: Works like GIF but way better compression
- **Quality**: Better than GIF at any file size

## Converting to Other Formats

### To MP4 (for audio sync)
```bash
ffmpeg -i kitty-animation.avif -c:v libx264 -pix_fmt yuv420p kitty.mp4
```

### To animated WebP
```bash
ffmpeg -i kitty-animation.avif -c:v libwebp -loop 0 kitty.webp
```

### To GIF (if you must!)
```bash
ffmpeg -i kitty-animation.avif -vf "fps=10,scale=400:-1:flags=lanczos" \
  -loop 0 kitty.gif
```

## Adding Audio Later

```bash
# Add audio track (must match duration)
ffmpeg -i kitty-animation.avif -i soundtrack.mp3 -c:v copy -c:a aac \
  -shortest kitty-with-sound.mp4
```

## Tips

1. **Inline AVIF**: Modern browsers support it directly
```html
<img src="kitty-animation.avif" alt="Silly kitty">
```

2. **With Fallback**:
```html
<picture>
  <source srcset="kitty-animation.avif" type="image/avif">
  <source srcset="kitty-animation.webp" type="image/webp">
  <img src="kitty-animation.gif" alt="Silly kitty">
</picture>
```

3. **Lazy Loading**:
```html
<img src="kitty-animation.avif" loading="lazy" alt="Silly kitty">
```

## Philosophy

Before the world of AI video generation, we have these wonderful, simple tools. Like the pixel art masters of the C64 and Amiga era, we can create memorable, delightful moments with constraints and creativity.

Sometimes the tongue sticking out for 0.258 seconds followed by normal face for 1.624 seconds creates a funnier, more memorable moment than any AI could predict!
