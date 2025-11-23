# Ideas for next version of Piccadilly Animator 😛😺

## Creative Extensions

Here are some ways to expand this concept:

### 1. Multi-Frame Sequences
```javascript
// Support more than 2 frames
const frames = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'];
// Random selection from pool
```

### 2. Weighted Randomness
```javascript
// Make tongue-out appear less frequently (funnier!)
if (Math.random() > 0.3) {
  useFrameA = true; // tongue out only 30% of time
}
```

### 3. Audio Sync
```javascript
// Match beats in music
const beatTimings = [0, 0.5, 1.0, 1.5, 2.0]; // seconds
// Switch frames on beats
```

### 4. Transition Effects
```javascript
// Add crossfades between frames
const args = [
  // ... concat input ...
  '-vf', 'format=yuv420p,fade=t=in:st=0:d=0.1',
  // ...
];
```

### 5. Export Frame Timing JSON
```javascript
// Save the random sequence for reuse
fs.writeFileSync('sequence.json', JSON.stringify(sequence, null, 2));
// Later sync with audio, or create variants
```

### 6. React to Audio Amplitude
```javascript
// Analyze audio file, switch frames on loud parts
// Could use ffprobe or audio analysis library
```

### 7. Create Variations
```bash
# Generate 10 different random versions
for i in {1..10}; do
  piccadilly -o kitty-$i.avif
done
```
