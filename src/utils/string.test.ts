import { prettifyString } from './string';

describe('prettifyString', () => {
  const validOutput = 'Item, another item and final item';
  
  it('Should pretiffy the PascalCase string', () => {
    expect(prettifyString('PascalCase')).toBe('Pascal case');
  });

  it('Should pretiffy the PascalCase words to a sentance', () => {
    expect(prettifyString('Item, AnotherItem, FinalItem')).toBe(validOutput);
  });

  it('Should pretiffy the comma saperated words to a sentance adding and', () => {
    expect(prettifyString('Item, AnotherItem, FinalItem')).toBe(validOutput);
  });

  it('Should trim extra spaces in comma saperated words', () => {
    expect(prettifyString('Item,      AnotherItem,        FinalItem')).toBe(validOutput);
  });

  it('Should trim extra spaces around comma saperated words', () => {
    expect(prettifyString('       Item,      AnotherItem,        FinalItem     ')).toBe(validOutput);
  });
});