export function makeWavePath({
height,
amplitude,
frequency,
phase,
x = 56,
step = 6
}: {
height: number
amplitude: number
frequency: number
phase: number
x?: number
step?: number
}) {
const h = Math.max(0, height)
const pts: string[] = []
for (let y = 0; y <= h; y += step) {
const dx = amplitude * Math.sin(frequency * y + phase)
const px = x + dx
pts.push(`${y === 0 ? 'M' : 'L'} ${px.toFixed(2)} ${y.toFixed(2)}`)
}
if (h % step !== 0) {
const y = h
const dx = amplitude * Math.sin(frequency * y + phase)
const px = x + dx
pts.push(`L ${px.toFixed(2)} ${y.toFixed(2)}`)
}
return pts.join(' ')
}
