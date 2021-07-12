// Allowed keys are strictly mean to be from ACTION constant, plus also 'rename' (Git considers
// rename and move the same thing but it is useful to differeniate here). Keep it flexible - don't
// bother to validate the key here as this is used internally and from the user nd tests can handle
// it.
export type CountResult = { [key: string]: number; };
