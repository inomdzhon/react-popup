// @flow

// libs
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { isEqual } from 'lodash';
/*
 * popper.js by FezVrasta
 *
 * repository: https://github.com/FezVrasta/popper.js
 * documentation: https://popper.js.org/popper-documentation.html
 */
import PopperJS from 'popper.js';

// feature types
import type {
  DataType,
  OptionsType,
  PopperInterface,
  ArrowStylesType,
  PositionType,
  PlacementType,
  BehaviorType,
  BoundaryType,
  StylesType,
  ReferenceObjectType,
} from './typing/types.js';

// lib config
// Disable positioning by 'transform' for resolve animation conflicts
PopperJS.Defaults.modifiers.computeStyle.gpuAcceleration = false;

type PropsType = {
  reference: HTMLElement | ReferenceObjectType,
  // not required
  children?: React$Element<*>,
  className?: string | (placement: PlacementType) => string,
  arrowClassName?: string | (placement: PlacementType) => string,
  arrow: boolean,
  inner: boolean,
  offsetX: number,
  offsetY: number,
  positionFixed: boolean,
  flipPadding: number;
  flipBehavior: BehaviorType | Array<PositionType>;
  flipBoundariesElement: BoundaryType | HTMLElement;
  pin: boolean,
  pinPadding: number,
  pinPriority: Array<PositionType>,
  pinBoundariesElement: BoundaryType | HTMLElement;
  placement: PlacementType,
  renderContainer: HTMLElement | string,
};

type StateType = {
  placement: PlacementType,
  arrowStyles: ArrowStylesType,
  styles: StylesType,
};

export default class Popup extends Component<PropsType, StateType> {
  static defaultProps = {
    arrow: false,
    inner: false,
    offsetX: 0,
    offsetY: 0,
    positionFixed: false,
    flipPadding: 5,
    flipBehavior: 'flip',
    flipBoundariesElement: 'scrollParent',
    pin: true,
    pinPadding: 5,
    pinPriority: ['left', 'right', 'top', 'bottom'],
    pinBoundariesElement: 'scrollParent',
    placement: 'bottom',
    renderContainer: document.body || 'body',
  };

  constructor(props: PropsType): void {
    super(props);

    this.state = {
      placement: props.placement,
      arrowStyles: {
        top: 0,
        left: 0,
      },
      styles: {
        position: 'absolute',
        top: 0,
        left: 0,
        willChange: 'top, left',
      },
    };
  }

  state: StateType;

  componentDidMount(): void {
    this.createPopper();
  }

  componentDidUpdate(prevProps: PropsType): void {
    if (
      prevProps.reference !== this.props.reference ||
      prevProps.arrow !== this.props.arrow ||
      prevProps.inner !== this.props.inner ||
      prevProps.offsetX !== this.props.offsetX ||
      prevProps.offsetY !== this.props.offsetY ||
      prevProps.positionFixed !== this.props.positionFixed ||
      prevProps.pin !== this.props.pin ||
      prevProps.flipPadding !== this.props.flipPadding ||
      prevProps.flipBehavior !== this.props.flipBehavior ||
      prevProps.flipBoundariesElement !== this.props.flipBoundariesElement ||
      prevProps.pinPadding !== this.props.pinPadding ||
      prevProps.pinPriority !== this.props.pinPriority ||
      prevProps.pinBoundariesElement !== this.props.pinBoundariesElement ||
      prevProps.placement !== this.props.placement ||
      prevProps.renderContainer !== this.props.renderContainer
    ) {
      this.destroyPopper();
      this.createPopper();
    } else if (prevProps.children !== this.props.children) {
      this.scheduleUpdatePopper();
    }
  }

  componentWillUnmount(): void {
    this.destroyPopper();
  }

  getRenderContainer(): HTMLElement {
    const { renderContainer } = this.props;

    if (renderContainer instanceof HTMLElement) {
      return renderContainer;
    }

    // TODO стоит ли выбрасывать Exception, если не найден DOM?
    return document.querySelector(renderContainer) || document.createElement('div');
  }

  getPopperOptions(): OptionsType {
    const {
      arrow,
      inner,
      placement,
      positionFixed,
      offsetX,
      offsetY,
      flipPadding,
      flipBehavior,
      flipBoundariesElement,
      pin,
      pinPadding,
      pinPriority,
      pinBoundariesElement,
    } = this.props;
    const options: OptionsType = {
      placement,
      positionFixed,
      eventsEnabled: true,
      removeOnDestroy: false,
      modifiers: {
        applyStyle: {
          enabled: false,
        },
        applyReactStyle: {
          enabled: true,
          order: 900,
          fn: this.handlePopperApplyStyle,
        },
        offset: {
          offset: `${offsetX}, ${offsetY}`,
        },
        inner: {
          enabled: inner,
        },
        flip: {
          padding: flipPadding,
          behavior: flipBehavior,
          boundariesElement: flipBoundariesElement,
        },
        preventOverflow: {
          padding: pinPadding,
          priority: pinPriority,
          boundariesElement: pinBoundariesElement,
          escapeWithReference: !pin,
        },
      },
      onCreate: (): void => {
        // Without `scheduleUpdate`, the popper will not position properly on creation
        this.scheduleUpdatePopper();
      },
    };

    if (arrow && this.elemArrow && options.modifiers) {
      options.modifiers.arrow = {
        enabled: arrow,
        element: this.elemArrow,
      };
    }

    return options;
  }

  createPopper(): void {
    this.popperInstance = new PopperJS(
      this.props.reference,
      this.elemPopup,
      this.getPopperOptions(),
    );
  }

  scheduleUpdatePopper(): void {
    if (this.popperInstance) {
      this.popperInstance.scheduleUpdate();
    }
  }

  destroyPopper(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }
  }

  handlePopperApplyStyle = (data: DataType): DataType => {
    this.setState((prevState: StateType): ?StateType => {
      const nextState: StateType = {
        placement: data.placement,
        styles: data.styles,
        arrowStyles: data.arrowStyles,
      };

      return isEqual(prevState, nextState) ? null : nextState;
    });

    return data;
  }

  handleRefOfArrow = (node: ?HTMLElement): void => {
    this.elemArrow = node;
  };

  handleRefOfPopup = (node: ?HTMLElement): void => {
    this.elemPopup = node;
  };

  elemArrow: ?HTMLElement;
  elemPopup: ?HTMLElement;
  popperInstance: PopperInterface;

  render(): React$Portal {
    const {
      className,
      arrow,
      arrowClassName,
      children,
    } = this.props;
    const { styles, arrowStyles, placement } = this.state;

    return createPortal(
      <div
        ref={this.handleRefOfPopup}
        className={typeof className === 'function' ? className(placement) : className}
        data-placement={placement}
        style={styles}
      >
        {
          arrow
            ? (
              <span
                ref={this.handleRefOfArrow}
                className={typeof arrowClassName === 'function' ? arrowClassName(placement) : arrowClassName}
                style={arrowStyles}
              />
            ) : null
        }
        {children}
      </div>,
      this.getRenderContainer(),
    );
  }
}
