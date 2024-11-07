export class GameState {
  constructor() {
    this.raceStarted = false;
    this.raceFinished = false;
    this.currentLap = 0;
    this.totalLaps = 3;
    this.raceTime = 0;
    this.position = 1;
    this.bestLapTime = Infinity;
    this.lastLapTime = 0;
  }

  startRace() {
    this.raceStarted = true;
    this.raceTime = 0;
  }

  updateRaceTime() {
    if (this.raceStarted && !this.raceFinished) {
      this.raceTime += 1/60;
    }
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }
}