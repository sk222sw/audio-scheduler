export interface AudioSchedulerOptions {
    tempo: number;
    intervalLengths: number[];
    context?: AudioContext;
    infinite: boolean;
    schedulAheadTime?: number;
    intervalTime?: number;
}
export declare class AudioScheduler {
    private scheduleAheadTime;
    private tempo;
    private msTempo;
    private context;
    private initialIntervals;
    private setIntervalReference;
    private mode;
    private lastIntervalStartedAt;
    private intervalList;
    private intervalTime;
    constructor(options: AudioSchedulerOptions);
    _init(): void;
    _intervalLengthInMs(): number;
    setTempo(newTempo: any): void;
    _scheduler(currentTime: any, cb: any): void;
    _calculateNext(intervalLength: any): number;
    _runCallback(time: any, cb: any): void;
    startInterval(cb: Function): number;
    stopInterval(interval: any): void;
    updateIntervals(intervalList: number[]): void;
    push(newInterval: number): void;
    shift(): void;
    pop(): void;
}
