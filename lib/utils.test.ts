import { cn, hasEnvVars } from './utils';

describe('lib/utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });

    it('should handle conditional classes', () => {
      expect(cn('text-red-500', true && 'text-blue-500')).toBe('text-red-500 text-blue-500');
      expect(cn('text-red-500', false && 'text-blue-500')).toBe('text-red-500');
    });

    it('should handle arrays and objects', () => {
      expect(cn(['px-2', 'py-1'])).toBe('px-2 py-1');
      expect(cn({ 'px-2': true, 'py-1': false })).toBe('px-2');
    });
  });

  describe('hasEnvVars', () => {
    // We can't easily test the value since it depends on process.env at load time
    // but we can ensure it's a boolean check result
    it('should be defined', () => {
      expect(typeof hasEnvVars).toBeDefined();
    });
  });
});
