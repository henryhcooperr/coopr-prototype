/* global React, ReactDOM, HF_ChromeIdeation */
/* app-hifi-chrome.jsx — entry point for the chrome ideation gallery.
   Renders HF_ChromeIdeation directly into root. Standalone page — does not
   load any of the surface JSX files since the variants are static mockups. */

ReactDOM.createRoot(document.getElementById('root')).render(<HF_ChromeIdeation />);
