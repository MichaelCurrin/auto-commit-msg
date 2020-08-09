/**
 * Parse git status.
 * 
 * Convert short git status into elements.
 */
export enum DESCRIPTION {
  ' ' = 'unmodified',
  M = 'modified',
  A = 'added',
  D = 'deleted',
  R = 'renamed',
  C = 'copied',
  U = 'umerged',
  '?' = 'untracked',
  '!' = 'ignored'
}

export interface Status {
  x: string;
  y: string;
  to: string;
  from: string;
}

export function parseStatus(line: string): Status {
  if (line.length <= 4) {
    throw new Error(`Input string must be at least 4 characters. Got: '${line}'`);
  }

  const x = line[0];
  const y = line[1];
  const paths = line.substring(3);

  const [ to, from ] = paths.includes('->') ? paths.split(' -> ') : [ paths, '' ];

  return {
    x: x,
    y: y,
    to: to,
    from: from
  };
}

export type DescriptionStrings = keyof typeof DESCRIPTION;

export function describeCode(key: DescriptionStrings) {
  return DESCRIPTION[key];
}
