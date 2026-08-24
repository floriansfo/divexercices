import { checkStatus } from './deposit-request';
describe('checkStatus', () => {
  it('envoie Pending quand lien valide et demande incomplete', () => {
    expect(checkStatus(new Date('2026-03-19'), null, new Date('2026-03-12'))).toBe('PENDING');
  });
  it('envoie Complete quand lien valide et demande complete', () => {
    expect(checkStatus(new Date('2026-03-19'), new Date('2026-03-12'), new Date('2026-03-12'))).toBe('COMPLETE');
  });
  it('envoie Expired quand lien expiré et demande incomplete', () => {
    expect(checkStatus(new Date('2026-03-19'), null, new Date('2026-03-20'))).toBe('EXPIRED');
  });
  it('envoie Complete quand lien expire et demande complete', () => {
    expect(checkStatus(new Date('2026-03-19'), new Date('2026-03-15'), new Date('2026-03-20'))).toBe('COMPLETE');
  });
});
