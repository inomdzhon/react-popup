// @flow
/* eslint-disable no-use-before-define */

export type PositionType = 'top' | 'right' | 'bottom' | 'left';

export type PlacementType = 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';

export type BoundaryType = 'scrollParent' | 'viewport' | 'window';

export type BehaviorType = 'flip' | 'clockwise' | 'counterclockwise';

export type ModifierFnType = (data: DataType, options: OptionsType) => DataType;

export type BaseModifierType = {
  order?: number,
  enabled?: boolean,
  fn?: ModifierFnType,
};

export type ModifiersType = {
  shift?: BaseModifierType,
  offset?: BaseModifierType & {
    offset?: number | string,
  },
  preventOverflow?: BaseModifierType & {
    priority?: Array<PositionType>,
    padding?: number,
    boundariesElement?: BoundaryType | Element,
    escapeWithReference?: boolean
  },
  keepTogether?: BaseModifierType,
  arrow?: BaseModifierType & {
    element?: string | Element,
  },
  flip?: BaseModifierType & {
    behavior?: BehaviorType | Array<PositionType>,
    padding?: number,
    boundariesElement?: BoundaryType | Element,
  },
  inner?: BaseModifierType,
  hide?: BaseModifierType,
  applyStyle?: BaseModifierType & {
    onLoad?: () => void,
    gpuAcceleration?: boolean,
  },
  computeStyle?: BaseModifierType & {
    gpuAcceleration?: boolean,
    x?: 'bottom' | 'top',
    y?: 'left' | 'right'
  },

  [name: string]: ?BaseModifierType,
};

export type OffsetType = {
  top: number | string,
  left: number | string,
  width: number,
  height: number,
};

export type ArrowStylesType = {
  top: number | string,
  left: number | string,
};

export type StylesType = {
  top: number | string,
  left: number | string,
  position: string,
  transform?: string,
  willChange: string,
};

export type AttributesType = {
  'x-out-of-boundaries': boolean,
  'x-placement': PositionType,
};

export type DataType = {
  instance: PopperInterface,
  placement: PlacementType,
  originalPlacement: PlacementType,
  flipped: boolean,
  hide: boolean,
  arrowElement: Element,
  arrowStyles: ArrowStylesType,
  styles: StylesType,
  attributes: AttributesType,
  positionFixed: boolean,
  offsets: {
    popper: OffsetType,
    reference: OffsetType,
    arrow: ArrowStylesType,
  },
};

export type OptionsType = {
  placement?: PlacementType,
  positionFixed?: boolean,
  eventsEnabled?: boolean,
  modifiers?: ModifiersType,
  removeOnDestroy?: boolean,

  onCreate?: (data: DataType) => void,

  onUpdate?: (data: DataType) => void,
};

export type ReferenceObjectType = {
  clientHeight: number,
  clientWidth: number,

  getBoundingClientRect(): ClientRect | DOMRect,
};

export interface PopperInterface {
  // static modifiers: Array<BaseModifierType & { name: string }>,
  // static placements: Array<PlacementType>,
  // static Defaults: OptionsType,

  options: OptionsType,

  constructor(reference: Element | ReferenceObjectType, popper: Element, options?: OptionsType): void,

  destroy(): void,

  update(): void,

  scheduleUpdate(): void,

  enableEventListeners(): void,

  disableEventListeners(): void,
}
