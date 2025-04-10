# time.bipul.in

## Overview
`time.bipul.in` is a web-based application that allows users to view and compare time across different time zones. It provides an intuitive interface for selecting time zones and displays real-time clocks for the selected zones. The application also calculates the time difference between two selected time zones.

## Features
- Real-time clocks for multiple time zones.
- Dropdown menus to select and compare time zones.
- Automatic detection of the user's current time zone.
- URL parameters to save and share selected time zones.
- Daylight Saving Time (DST) adjustments.

## Files
- **index.html**: The main HTML file for the application.
- **script.js**: Contains the JavaScript logic for time zone handling, clock updates, and URL parameter management.
- **styles.css**: Defines the styling for the application.
- **CNAME**: Used for custom domain configuration.
- **README.md**: Documentation for the project.

## How to Use
1. Open the application in a web browser.
2. Use the dropdown menus to select time zones.
3. View the real-time clocks and the time difference between the selected zones.
4. Share the URL to save or share your selected time zones.

## Development
### Prerequisites
- A modern web browser.
- Basic knowledge of HTML, CSS, and JavaScript for development.

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/time.bipul.in.git
   ```
2. Open the `index.html` file in a browser to view the application.

### Customization
- Modify `script.js` to add or update time zones in the `tzMap` object.
- Update `styles.css` to change the appearance of the application.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Inspired by the need for a simple and effective time zone comparison tool.
- Uses the JavaScript `Intl.DateTimeFormat` API for time zone detection and formatting.