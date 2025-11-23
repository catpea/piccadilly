#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Piccadilly Animator
 * Creates an animated AVIF with random frame durations
 */

/**
 * Check if ffmpeg is installed
 */
function checkFfmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

class PiccadillyAnimator {
  constructor(options = {}) {
    this.frames = options.frames || ['a.jpg', 'b.jpg'];
    this.outputFile = options.output || 'animation.avif';
    this.totalDuration = options.duration || 15; // seconds
    this.maxFrameDuration = options.maxFrameDuration || 2; // seconds
    this.minFrameDuration = options.minFrameDuration || 0.1; // seconds
  }

  /**
   * Generate random duration between min and max
   */
  randomDuration() {
    const range = this.maxFrameDuration - this.minFrameDuration;
    return this.minFrameDuration + Math.random() * range;
  }

  /**
   * Generate sequence of random frame durations that total to target duration
   */
  generateSequence() {
    const sequence = [];
    let currentTime = 0;
    let frameIndex = Math.floor(Math.random() * this.frames.length); // Start randomly

    while (currentTime < this.totalDuration) {
      const remaining = this.totalDuration - currentTime;
      let duration;

      if (remaining <= this.maxFrameDuration) {
        // Last frame - use exactly remaining time
        duration = remaining;
      } else {
        // Random duration up to max
        duration = this.randomDuration();
        // Ensure we don't go way over
        if (currentTime + duration > this.totalDuration) {
          duration = this.totalDuration - currentTime;
        }
      }

      const currentFrame = this.frames[frameIndex];
      sequence.push({
        frame: currentFrame,
        duration: duration,
        type: `frame-${frameIndex + 1}`
      });

      currentTime += duration;
      frameIndex = (frameIndex + 1) % this.frames.length; // Cycle through all frames
    }

    return sequence;
  }

  /**
   * Create ffmpeg concat file
   */
  createConcatFile(sequence) {
    const concatPath = '/tmp/animation-concat.txt';
    let content = '';

    for (const item of sequence) {
      content += `file '${path.resolve(item.frame)}'\n`;
      content += `duration ${item.duration.toFixed(3)}\n`;
    }

    // Add the last frame again (ffmpeg concat quirk)
    const lastFrame = sequence[sequence.length - 1];
    content += `file '${path.resolve(lastFrame.frame)}'\n`;

    fs.writeFileSync(concatPath, content);
    return concatPath;
  }

  /**
   * Run ffmpeg to create the animation
   */
  async animate() {
    console.log('🐱 Piccadilly Animator');
    console.log('========================\n');

    // Check if input files exist
    console.log(`📁 Input files (${this.frames.length}):`);
    for (const frame of this.frames) {
      if (!fs.existsSync(frame)) {
        throw new Error(`Frame not found: ${frame}`);
      }
      console.log(`   ✓ ${frame}`);
    }
    console.log('');

    // Generate random sequence
    const sequence = this.generateSequence();

    console.log(`📊 Animation Plan (${this.totalDuration}s total):`);
    console.log('─'.repeat(50));
    const emojis = ['😺', '😛', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
    sequence.forEach((item, i) => {
      const frameNum = parseInt(item.type.split('-')[1]) - 1;
      const emoji = emojis[frameNum % emojis.length];
      console.log(`  ${i + 1}. ${emoji} ${item.type.padEnd(12)} ${item.duration.toFixed(3)}s`);
    });
    console.log('─'.repeat(50));
    console.log(`   Total frames: ${sequence.length}\n`);

    // Create concat file
    const concatFile = this.createConcatFile(sequence);

    // Build ffmpeg command
    const args = [
      '-f', 'concat',
      '-safe', '0',
      '-i', concatFile,
      '-vf', 'format=yuv420p',
      '-c:v', 'libaom-av1',
      '-still-picture', '0',  // Enable animation
      '-loop', '0',            // Loop forever
      '-cpu-used', '8',        // Faster encoding (lower quality, but fine for this)
      '-y',                    // Overwrite output
      this.outputFile
    ];

    console.log('🎬 Starting ffmpeg encoding...\n');

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', args);

      let stderr = '';

      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
        // Show progress
        if (data.toString().includes('frame=')) {
          process.stdout.write('.');
        }
      });

      ffmpeg.on('close', (code) => {
        console.log('\n');
        if (code === 0) {
          const stats = fs.statSync(this.outputFile);
          const sizeKB = (stats.size / 1024).toFixed(2);
          console.log('✅ Animation created successfully!');
          console.log(`📦 Output: ${this.outputFile} (${sizeKB} KB)`);
          console.log(`⏱️  Duration: ${this.totalDuration}s`);

          // Cleanup
          fs.unlinkSync(concatFile);
          resolve();
        } else {
          console.error('❌ ffmpeg failed:');
          console.error(stderr);
          reject(new Error('ffmpeg encoding failed'));
        }
      });

      ffmpeg.on('error', (err) => {
        reject(err);
      });
    });
  }
}

// CLI interface
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  // Check for ffmpeg
  if (!checkFfmpeg()) {
    console.error('❌ Error: ffmpeg not found!');
    console.error('\nPiccadilly requires ffmpeg to be installed.');
    console.error('\nTo install ffmpeg:');
    console.error('  • Ubuntu/Debian: sudo apt install ffmpeg');
    console.error('  • Fedora: sudo dnf install ffmpeg');
    console.error('  • Arch: sudo pacman -S ffmpeg');
    console.error('  • macOS: brew install ffmpeg');
    console.error('\nVisit https://ffmpeg.org for more information.\n');
    process.exit(1);
  }

  const args = process.argv.slice(2);

  const options = {
    frames: [],
    output: 'animation.avif',
    duration: 15,
    maxFrameDuration: 2,
    minFrameDuration: 0.1
  };

  // Parse arguments
  const inputFiles = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--duration' || args[i] === '-d') {
      options.duration = parseFloat(args[++i]);
    } else if (args[i] === '--max' || args[i] === '-m') {
      options.maxFrameDuration = parseFloat(args[++i]);
    } else if (args[i] === '--output' || args[i] === '-o') {
      options.output = args[++i];
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Piccadilly Animator
============================

Create animated AVIF files with random frame durations.

Usage: piccadilly [options] <files...>

Options:
  -d, --duration <seconds>   Total animation duration (default: 15)
  -m, --max <seconds>        Max duration per frame (default: 2)
  -o, --output <file>        Output filename (default: animation.avif)
  -h, --help                 Show this help

Arguments:
  <files...>                 Input image files (defaults to a.jpg b.jpg)

Examples:
  piccadilly -o my-silly-cat.avif samples/wink*.jpg
  piccadilly --duration 30 --max 3 frame1.png frame2.png frame3.png
  piccadilly image1.jpg image2.jpg
      `);
      process.exit(0);
    } else if (!args[i].startsWith('-')) {
      // Non-flag argument - treat as input file
      inputFiles.push(args[i]);
    }
  }

  // Use provided files or default to a.jpg and b.jpg
  options.frames = inputFiles.length > 0 ? inputFiles : ['a.jpg', 'b.jpg'];

  const animator = new PiccadillyAnimator(options);

  animator.animate()
    .then(() => {
      console.log('\n🎉 All done! Your animation is ready to derp!');
    })
    .catch((err) => {
      console.error('\n💥 Error:', err.message);
      process.exit(1);
    });
}

export default PiccadillyAnimator;
