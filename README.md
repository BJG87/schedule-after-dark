# Schedule After Dark

Schedule After Dark is a Chrome extension that disables the Gmail send button between specified on and off times.

## Features

- Disables the Gmail send button between specified on and off times.
- Allows manual override to enable or disable the send button.
- Displays the current status (SENDING BLOCKED or SENDING ALLOWED) with visual indicators.
- Uses Chrome storage to save on time, off time, and manual override settings.
- Automatically sets default on time to 5:00 PM and off time to 9:00 AM upon installation.

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd schedule-after-dark
   ```

3. Load the src folder from the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click on "Load unpacked" and select the `schedule-after-dark/src` directory.

## Usage

Once the extension is loaded, it will automatically disable the Gmail send button between the specified on and off times. You can customize the on and off times and manual override settings in the extension's options page.

## License

This project is licensed under the MIT License.
