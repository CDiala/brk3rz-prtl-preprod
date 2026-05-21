import { NicePipe } from './nice.pipe';

describe('NicePipe', () => {
  let pipe: NicePipe;

  beforeEach(() => {
    pipe = new NicePipe();
  });

  it('should return the original string if x is greater than or equal to the string length', () => {
    expect(pipe.transform('hello', 5)).toBe('hello');
    expect(pipe.transform('hello', 10)).toBe('hello');
  });

  it('should return a truncated string with "..." in the middle if x is less than the string length', () => {
    expect(pipe.transform('hello', 3)).toBe('h...o');
    expect(pipe.transform('knowledge', 4)).toBe('kn...ge');
  });

  it('should return the original string if x is 0 or negative', () => {
    expect(pipe.transform('hello', 0)).toBe('hello');
    expect(pipe.transform('hello', -1)).toBe('hello');
  });

  it('should handle empty strings correctly', () => {
    expect(pipe.transform('', 3)).toBe('');
  });
});
