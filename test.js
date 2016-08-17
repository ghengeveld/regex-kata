import 'babel-polyfill';
import chai, { expect } from 'chai';
import match, { tokenize, matchToken } from './match';

describe('regex code kata', () => {
  describe('dot matches a char', () => {
    it('matches chars', () => {
      expect(match('.', 'a')).to.equal('a');
      expect(match('.', '.')).to.equal('.');
      expect(match('.', '1')).to.equal('1');
      expect(match('.', 'z')).to.equal('z');
      expect(match('.', ' ')).to.equal(' ');
    });

    it('partial match', () => {
      expect(match('.', 'abc')).to.equal('a');
    });

    it('does not match newline operators', () => {
      expect(match('.', '\n')).to.equal(null);
      expect(match('.', '\r')).to.equal(null);
    });

    it('matches halfway', () => {
      expect(match('abc', 'ababcab')).to.equal('abc');
    });
  });

  describe('beginning of input ^', () => {
    it('matches', () => {
      expect(match('^a', 'a')).to.equal('a');
      expect(match('^A', 'An A')).to.equal('A');
    });

    it('does not match', () => {
      expect(match('^A', 'an A')).to.equal(null);
    });
  });


  describe('end of input $', () => {
    it('matches', () => {
      expect(match('a$', 'a')).to.equal('a');
      expect(match('t$', 'eat')).to.equal('t');
    });

    it('does not match', () => {
      expect(match('t$', 'eater')).to.equal(null);
    });
  });

  describe('star operator *', () => {
    it('matches', () => {
      expect(match('a*', 'a')).to.equal('a');
    });

    it('is greedy', () => {
      expect(match('a*', 'aaaa')).to.equal('aaaa');
    });

    it('matches zero occurances', () => {
      expect(match('bo*', 'A bird warbled')).to.equal('b');
    });

    it('does not match', () => {
      expect(match('bo*', 'A goat grunter')).to.equal(null);
    });
  });
});

describe('tokenize', () => {
  it('should split a regex into groups', () => {
    expect(tokenize('.')).to.deep.equal(['.'])
    expect(tokenize('a')).to.deep.equal(['a'])
    expect(tokenize('Aa')).to.deep.equal(['A', 'a'])
    expect(tokenize('^aA')).to.deep.equal(['^a', 'A'])
    expect(tokenize('aa$')).to.deep.equal(['a', 'a$'])
    expect(tokenize('aa*')).to.deep.equal(['a', 'a*'])
  });
});

describe('matchToken', () => {
  it('should find the first match for a token starting from an offset', () => {
    expect(matchToken('a', 'aa').match).to.equal('a')
    expect(matchToken('.', 'ab').match).to.equal('a')
    expect(matchToken('.', 'ab', 1).match).to.equal('b')
    expect(matchToken('b', 'aa').match).to.equal(undefined)
    expect(matchToken('b', 'ab', 0, true)).to.deep.equal({ match: 'b', offset: 1 })
  });
});
