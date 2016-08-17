export default function match(regex, value) {
  const tokens = tokenize(regex)
  return loop(tokens, value) || null
}

function loop(tokens, value) {
  let acc = ''
  let position = 0
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const { match, offset = 0 } = matchToken(token, value, position, i === 0)
    if (match !== undefined) {
      acc += match
      position += match.length + offset
    } else if (tokens[0].startsWith('^')) {
      return ''
    } else if (value.length > 1) {
      return loop(tokens, value.substr(1))
    }
  }
  return acc
}

export function tokenize(regex, groups = []) {
  const [head, ...tail] = regex
  if (head === '.') {
    return tokenize(tail, [...groups, head])
  }
  if (head === '^') {
    const [two, ...rest] = tail
    return tokenize(rest, [...groups, head + two])
  }
  if (head === '$') {
    const prev = groups.pop()
    return tokenize(tail, [...groups, prev + head])
  }
  if (head === '*') {
    const prev = groups.pop()
    return tokenize(tail, [...groups, prev + head])
  }
  if (head) {
    return tokenize(tail, [...groups, head])
  }
  return groups
}

export function matchToken(token, value, offset = 0, firstToken = false) {
  const str = value.substr(offset)
  const chars = str.split('')

  if (!token || str === '\n' || str === '\r')
    return {}

  if (token === '.' || token === str.charAt(0))
    return { match: str.charAt(0), offset: 0 }

  if (token.startsWith('^')) {
    if (offset === 0) {
      const res = matchToken(token.slice(1), value, offset)
      if (res.offset === 0) return res
    }
    return {}
  }

  if (token.endsWith('$')) {
    return matchTokenRight(token.slice(0, -1), value, offset)
  }

  if (token.endsWith('*')) {
    let result = ''
    let position = 0
    let res
    while ((res = matchToken(token.slice(0, -1), value, offset)) && res.match && position < str.length) {
      result += res.match
      position += res.match.length + res.offset
    }
    return { match: result, offset: 0 }
  }

  if (firstToken) {
    const tokenIndex = chars.indexOf(token)
    if (tokenIndex >= 0)
      return {
        match: str.charAt(tokenIndex),
        offset: tokenIndex
      }
  }

  return {}
}

function matchTokenRight(token, value, offset) {
  const str = value.substr(offset)

  if (!token || str === '\n' || str === '\r')
    return {}

  if (token === '.' || token === str.charAt(str.length - 1))
    return { match: str.charAt(str.length - 1), offset: 0 }

  return {}
}
