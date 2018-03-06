import { MomentDate } from './moment-date';

describe('Mement Date pipe', () => {
  let pipe = new MomentDate();

  it('transforms "2018-02-12T13:27:08.643Z" to "12.02.2018"', () => {
    expect(pipe.transform('2018-02-12T13:27:08.643Z')).toBe('12.02.2018');
  });
  it('transforms "Not a Date" to "Invalid date"', () => {
    expect(pipe.transform('Not a Date')).toBe('Invalid date');
  });
});
