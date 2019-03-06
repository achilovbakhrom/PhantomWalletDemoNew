/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';


const __normailzeDerivePath = (path) => {
  let result = path.toLowerCase();
  if (result.startsWith("m/0'")) {
      return result;
  } else if (result.startsWith("m/0")) {
      const left = result.substring(0, 3);
      const hardened = "'";
      const right = result.substring(3)
      return left + hardened + right;
  }
}

it ('substring', () => {
  const normalized = __normailzeDerivePath('M/0/3')
  expect(normalized).toEqual("m/0'/2");
})