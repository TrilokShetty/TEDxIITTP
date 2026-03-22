import React from 'react';
import { renderToString } from 'react-dom/server';
import PrivacyPolicy from './src/components/PrivacyPolicy.jsx';

try {
  const html = renderToString(React.createElement(PrivacyPolicy));
  console.log("Rendered successfully. No JS crash.");
} catch (e) {
  console.error("CRASH:");
  console.error(e);
}
