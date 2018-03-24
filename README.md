# Audio Scheduler
Accurate timing for the Web Audio Api, with realtime changes to tempo and sequence.
## Install
``npm install audio-scheduler``

## Example
```
import {AudioScheduler} from 'audio-scheduler'

const quarterNote = 1
const eightNote = 0.5 

const audioContext = new AudioContext()

const options = {
	tempo: 128,
	intervalLengths: [quarterNote, quarterNote, eightNote],
	infinite: true,
	context: audioContext,
}

const scheduler = new AudioScheduler(options)

function synth(time) {
    const osc = audioContext.createOscillator()
    osc.connect(audioContext.destination)
    osc.start(time)
    const stopTime = time + 0.05
    osc.stop(stopTime)
}

scheduler.startInterval(synth)
```

## API
### startInterval(callback: Function): number
### stopInterval(interval: number): void
### setTempo(tempo: number): void
### updateIntervals(intervalList: number[]): void
### push(newInterval: number): void
### shift(): void
### pop(): void
