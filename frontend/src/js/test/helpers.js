import React from 'react';
import TestUtils from 'react-addons-test-utils';

export function setupShallowRender(props, Component) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<Component {...props} />);
  const output = renderer.getRenderOutput();

  return output;
}

export function setupRender(props, Component) {
  return TestUtils.renderIntoDocument(<Component {...props} />);
}
