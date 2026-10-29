/**
 * The MTS mark, traced from Phillip's logo artwork (coordinates measured from the 562x201 reference).
 * Every diagonal uses one slope (0.85, about 40°) so neighbouring cuts are parallel and the gaps
 * between pieces stay an even width. All pieces share one coordinate space.
 */
export const LOGO_VIEWBOX = '33 41 470 152';

export type LogoTone = 'ink' | 'brand';

export interface LogoPiece {
  id: string;
  d: string;
  tone: LogoTone;
  /** Where the piece starts before it assembles into place. */
  from: string;
  delayMs: number;
}

export const LOGO_PIECES: LogoPiece[] = [
  // M
  {
    id: 'm-stem-left',
    tone: 'ink',
    d: 'M39 95.2L75 125.8V159.8L43 187H39Z',
    from: 'translate(-18%, 30%) rotate(-12deg)',
    delayMs: 0,
  },
  {
    id: 'm-right',
    tone: 'ink',
    d: 'M206 47V187H174V112.2L116.5 161L94.2 142Z',
    from: 'translate(-6%, -45%) rotate(8deg)',
    delayMs: 90,
  },
  {
    id: 'm-chevron',
    tone: 'brand',
    d: 'M39 47L116.6 113L94.3 132L39 85Z',
    from: 'translate(-22%, -40%) rotate(-20deg)',
    delayMs: 300,
  },
  // T
  {
    id: 't-bar',
    tone: 'brand',
    d: 'M214 47H374L335.2 80H214Z',
    from: 'translate(0, -55%)',
    delayMs: 380,
  },
  {
    id: 't-stem',
    tone: 'brand',
    d: 'M261 87H293V163L264.8 187H261Z',
    from: 'translate(0, 55%)',
    delayMs: 460,
  },
  // S
  {
    id: 's',
    tone: 'ink',
    d: 'M387 47H494L455.2 80H380V101H462A35 35 0 0 1 497 136V152A35 35 0 0 1 462 187H312L353.2 152H462V133H375A30 30 0 0 1 345 103V82.7Z',
    from: 'translate(22%, 12%) rotate(10deg)',
    delayMs: 180,
  },
];
