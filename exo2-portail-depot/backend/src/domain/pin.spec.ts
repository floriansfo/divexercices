import { validpinformat, locked } from './pin';
describe('validpinformat', () => {
  it('valide si le pin est au bon format', () => {
    expect(validpinformat('1234')).toBe(true);
  });
  it('invalide si le pin est au mauvais format', () => {
    expect(validpinformat('12345')).toBe(false);
  });
});

describe('locked', () => {
    it('valide si le compte est bloqué', () => {
        expect(locked(new Date('2024-03-19'), new Date('2024-03-15'))).toBe(true);
    });
    it('invalide si le compte n\'est pas bloqué', () => {
        expect(locked(new Date('2024-03-19'), new Date('2024-03-20'))).toBe(false);
    });
    it('si null pas verrouillé', () => {
        expect(locked(null, new Date('2024-03-20'))).toBe(false);
    });
});