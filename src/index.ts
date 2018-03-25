import { first, last } from "./util";

export interface AudioSchedulerOptions {
  tempo: number;
  intervalLengths: number[];
  context?: AudioContext;
  infinite: boolean;
  schedulAheadTime?: number;
  intervalTime?: number;
}

enum ScheduleMode {
  Infinite,
  Finite
}

export class AudioScheduler {
  private scheduleAheadTime: number;
  private tempo: number;
  private msTempo: number;
  private context: AudioContext;
  private initialIntervals: number[] = [];
  private setIntervalReference: number;
  private mode: ScheduleMode;
  private lastIntervalStartedAt: number;
  private intervalList: number[] = [];
  private intervalTime: number;
  private callback: Function;

  constructor(options: AudioSchedulerOptions) {
    this.mode = options.infinite ? ScheduleMode.Infinite : ScheduleMode.Finite;

    this.initialIntervals = options.intervalLengths;
    this.scheduleAheadTime = options.schedulAheadTime || 0.1;
    this.intervalTime = options.intervalTime || 50;

    this.tempo = options.tempo;
    this.context = options.context || new AudioContext();
  }

  _init() {
    this.msTempo = 60000 / this.tempo;
    this.intervalList = this.initialIntervals;
  }

  _intervalLengthInMs() {
    return this.msTempo / 1000;
  }

  setTempo(newTempo) {
    this.tempo = newTempo;
    this.msTempo = 60000 / this.tempo;
  }

  _scheduler(currentTime, cb) {
    if (!last(this.intervalList)) {
      if (this.mode === ScheduleMode.Finite) {
        this.stopInterval(this.setIntervalReference);
      } else {
        this.intervalList = this.initialIntervals;
      }
      return;
    }

    const next = this._calculateNext(first(this.intervalList));
    const shouldBeScheduled = currentTime + this.scheduleAheadTime;

    if (next < shouldBeScheduled) {
      this._runCallback(next, cb);
    }
  }

  _calculateNext(intervalLength) {
    return (
      (this.lastIntervalStartedAt || 0) +
      intervalLength * this._intervalLengthInMs()
    );
  }

  _runCallback(time, cb) {
    this.intervalList = this.intervalList.slice(1, this.intervalList.length);
    this.lastIntervalStartedAt = time;
    cb(time);
  }

  startInterval(cb: Function) {
    if (!this.callback)
      this.callback = cb;
    
    this._init();

    this._runCallback(this.context.currentTime, cb);

    const interval = setInterval(
      _ => this._scheduler(this.context.currentTime, cb),
      this.intervalTime
    );

    this.setIntervalReference = interval;
    return interval;
  }

  stopInterval(interval) {
    clearInterval(interval);
  }

  updateIntervals(intervalList: number[]) {
    this.intervalList = intervalList;
    this.initialIntervals = intervalList;
  }
  push(newInterval: number) {
    this.intervalList = [...this.intervalList, newInterval];
    this.initialIntervals = [...this.initialIntervals, newInterval];
  }
  shift() {
    const [_, ...intervals] = this.intervalList;
    const [__, ...initialIntervals] = this.initialIntervals;
    this.intervalList = intervals;
    this.initialIntervals = initialIntervals;
  }
  pop() {
    const intervalList = [...this.intervalList];
    intervalList.pop();
    this.intervalList = intervalList;

    const initialIntervals = [...this.initialIntervals];
    initialIntervals.pop();
    this.initialIntervals = initialIntervals;
  }
  pause() {
    this.stopInterval(this.setIntervalReference);
    this.context.suspend();
  }
  unpause() {
    this.context.resume()
    this.setIntervalReference = this.startInterval(this.callback)
  }
}
