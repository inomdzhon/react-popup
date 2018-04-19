// @flow

// libs
import React, { Component } from 'react';

// storybook
import backgrounds from '@storybook/addon-backgrounds';
import { storiesOf } from '@storybook/react';
import { withKnobs, number, text, boolean, select, array } from '@storybook/addon-knobs/react';

// components
import Popup from '../Popup.jsx';

// styles
import './Popup.stories.scss';

class Tooltip extends Component<{}, { init: boolean }> {
  state = {
    init: false,
  };

  componentDidMount(): void {
    this.init();
  }

  init(): void {
    this.elemTarget.parentNode.parentNode.scrollTo(550, 550);

    this.setState({
      init: true,
    });
  }

  getRefTarget = (node: ?HTMLElement): void => {
    this.elemTarget = node;
  };

  elemTarget: ?HTMLElement;

  render(): React$Element<*> {
    return (
      <div
        ref={this.getRefTarget}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 50,
          height: 50,
          background: 'tomato',
        }}
      >
        {
          (this.state.init && this.elemTarget) && (
            <Popup
              reference={this.elemTarget}
              className="test-tooltip"
              arrowClassName="test-tooltip__arrow"
              arrow={boolean('arrow', Popup.defaultProps.arrow)}
              inner={boolean('inner', Popup.defaultProps.inner)}
              offsetX={number('offsetX', Popup.defaultProps.offsetX)}
              offsetY={number('offsetY', Popup.defaultProps.offsetY)}
              positionFixed={boolean('positionFixed', Popup.defaultProps.positionFixed)}
              flipPadding={number('flipPadding', Popup.defaultProps.flipPadding)}
              flipBehavior={select('flipBehavior', {
                flip: 'flip',
                clockwise: 'clockwise',
                counterclockwise: 'counterclockwise',
              }, Popup.defaultProps.flipBehavior)}
              flipBoundariesElement={select('flipBoundariesElement', {
                scrollParent: 'scrollParent',
                viewport: 'viewport',
                window: 'window',
              }, Popup.defaultProps.flipBoundariesElement)}
              pin={boolean('pin', Popup.defaultProps.pin)}
              pinPadding={number('pinPadding', Popup.defaultProps.pinPadding)}
              pinPriority={array('pinPriority', Popup.defaultProps.pinPriority)}
              pinBoundariesElement={select('pinBoundariesElement', {
                scrollParent: 'scrollParent',
                viewport: 'viewport',
                window: 'window',
              }, Popup.defaultProps.pinBoundariesElement)}
              placement={select('placement', {
                'auto-start': 'auto-start',
                auto: 'auto',
                'auto-end': 'auto-end',
                'top-start': 'top-start',
                top: 'top',
                'top-end': 'top-end',
                'right-start': 'right-start',
                right: 'right',
                'right-end': 'right-end',
                'bottom-end': 'bottom-end',
                bottom: 'bottom',
                'bottom-start': 'bottom-start',
                'left-end': 'left-end',
                left: 'left',
                'left-start': 'left-start',
              }, Popup.defaultProps.placement)}
            >
              <div className="test-tooltip__content">
                {text('Children', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam asperiores commodi')}
              </div>
            </Popup>
          )
        }
      </div>
    );
  }
}

storiesOf('Popup', module)
  .addDecorator(backgrounds([
    { name: 'default', value: '#eee', default: true },
  ]))
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxWidth: 400,
        maxHeight: 400,
        outline: '1px solid steelblue',
        overflow: 'scroll',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 1500,
          height: 1500,
        }}
      >
        {story()}
      </div>
    </div>
  ))
  .add('Live', () => (
    <Tooltip />
  ));
