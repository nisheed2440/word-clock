import type { TMappedData } from "./constants";

export class WordClock {
  /** hours data mapped from input data */
  private _hoursData: Record<string | number, number[]>;
  /** minutes data mapped from input data */
  private _minutesData: Record<string | number, number[][]>;
  /** input data */
  private _data: Record<string | number, number[]>;
  /** input matrix */
  private _inputMatrix: {
    active: boolean;
    letter: string;
  }[][];
  /** original hour from input date*/
  ogHour = 0;
  /** original minutes from input date*/
  ogMinutes = 0;
  /** rounded hour from input date*/
  roundedHour = 0;
  /** rounded minutes from input date*/
  roundedMinutes = 0;

  constructor(inputMatrix: string[][], data: TMappedData) {
    this._hoursData = {
      0: data[0],
      1: data[1],
      2: data[2],
      3: data[3],
      4: data[4],
      5: data.FIVE,
      6: data[6],
      7: data[7],
      8: data[8],
      9: data[9],
      10: data.TEN,
      11: data[11],
      12: data[12],
      13: data[1],
      14: data[2],
      15: data[3],
      16: data[4],
      17: data.FIVE,
      18: data[6],
      19: data[7],
      20: data[8],
      21: data[9],
      22: data.TEN,
      23: data[11],
    };

    this._minutesData = {
      0: [],
      5: [data[5]],
      10: [data[10]],
      15: [data.QUARTER],
      20: [data.TWENTY],
      25: [data.TWENTY, data[5]],
      30: [data.HALF],
      35: [data.TWENTY, data[5]],
      40: [data.TWENTY],
      45: [data.QUARTER],
      50: [data[10]],
      55: [data[5]],
    };

    this._data = data;
    this._inputMatrix = inputMatrix.map((row) =>
      row.map((col) => {
        if (col === " ") {
          return {
            letter: this._generateRandomLetter(),
            active: false,
          };
        }
        return {
          letter: col,
          active: false,
        };
      })
    );
  }

  private _isPostHalfHour() {
    return this.ogMinutes >= 35;
  }

  private _setMinutesToEvaluate() {
    this.roundedMinutes = Math.floor(this.ogMinutes / 5) * 5;
  }

  private _setHourToEvaluate() {
    this.roundedHour = this._isPostHalfHour() ? this.ogHour + 1 : this.ogHour;
    this.roundedHour = this.roundedHour % 24;
  }

  private _checkQuarter() {
    return this.roundedMinutes > 0 && this.roundedMinutes % 15 === 0;
  }

  private _getHourPhrase() {
    return this._hoursData[this.roundedHour];
  }

  private _getMinutesPhrase() {
    if (this.ogMinutes === 0) {
      return [];
    }
    if (this.ogMinutes < 5) {
      return [this._data.JUST, this._data.AFTER];
    }
    if (this.ogMinutes > 55) {
      return [this._data.ALMOST];
    }

    const suffix = this._checkQuarter() ? [] : [this._data.MINUTES];

    if (this._isPostHalfHour()) {
      suffix.push(this._data.TO);
    } else {
      suffix.push(this._data.PAST);
    }

    return [...this._minutesData[this.roundedMinutes], ...suffix].filter(
      Boolean
    ) as number[][];
  }

  private _getOfTheClock() {
    // Handle midnight and more than half past 11
    if (
      this.roundedHour === 0 ||
      this.roundedHour === 12 ||
      (this.roundedHour === 23 && this.ogMinutes >= 35)
    ) {
      return "";
    }

    // Handle quarters
    if (this._checkQuarter()) {
      return "";
    }

    // Default
    return this._data["O'CLOCK"];
  }

  private _generateRandomLetter() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[Math.floor(Math.random() * letters.length)];
  }

  /**
   * Get the time phrase for a given timestamp
   * @param timestamp The timestamp to evaluate
   * @returns an 2d array of numbers representing the position of the words in the word clock
   */
  getTimePhrase(timestamp: string | number | Date) {
    const date = new Date(timestamp);
    this.ogHour = date.getHours();
    this.ogMinutes = date.getMinutes();

    this._setMinutesToEvaluate();
    this._setHourToEvaluate();

    return [
      this._data.IT,
      this._data.IS,
      ...this._getMinutesPhrase(),
      this._getHourPhrase(),
      this._getOfTheClock(),
    ].filter(Boolean) as number[][];
  }

  /**
   * Get the time phrase grid for a given timestamp
   * @param timestamp The timestamp to evaluate
   * @returns a new grid with the time phrase set to true
   */
  getTimePhraseGrid(timestamp: string | number | Date) {
    const timePhrases = this.getTimePhrase(timestamp);
    // create new grid with all false values
    const newGrid = this._inputMatrix.map((row) =>
      row.map((col) => ({
        ...col,
        active: false,
      }))
    );
    // loop through timePhrases and set grid values to true
    timePhrases.forEach((phrase) => {
      for (let i = phrase[1]; i <= phrase[2]; i++) {
        newGrid[phrase[0]][i].active = true;
      }
    });
    return newGrid;
  }

  /**
   * Debugging function to get human readable time
   * @param input The out put from getTimePhrase
   * @returns human readable time as an array of strings
   */
  debugTime(input: number[][] = []) {
    const mappedData = Object.keys(this._data).reduce((acc, curr) => {
      acc[this._data[curr as keyof typeof this._data].join("_")] = curr;
      return acc;
    }, {} as Record<string, string>);
    return input.map((i) => mappedData[i.join("_")]);
  }
}
