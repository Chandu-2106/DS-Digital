# MBU Data Science Learning Portal

## Start the portal (Windows)
1. Install Python 3.10+ and a JDK (17 or newer). Make sure `python`, `javac`, and `java` work in a new terminal.
2. Open a terminal in this folder.
3. Install the plotting/data libraries: `python -m pip install -r requirements.txt`
4. Start the site and code runner: `python backend.py`
5. Open http://127.0.0.1:8000

The backend runs Python and Java snippets locally. Python plotting calls such as `plt.show()` are captured and shown under the sandbox output. Seaborn plots work through Matplotlib. Additional third-party libraries need to be installed in the same Python environment.

## Features added
- Resources tab with Add Resource (URL and file attachments; browser storage limit applies).
- Circular profile photo in the navbar, opening the student ID card and editable resume.
- Removed the navbar search icon; the existing home-page search remains available.
- MBU logo image replaces the text logo.
- Python/Java sandbox selector with output and Matplotlib/Seaborn figures.

Existing modules and experiment content are retained. Code execution is local and intended for trusted educational snippets; do not expose this backend to the public internet. Arbitrary programs and all third-party packages cannot be guaranteed to run without their dependencies, and execution has a 15-second timeout.

## Start without typing a command
On Windows, double-click **Run Portal.bat** in the project folder. It starts the local backend in a separate terminal window and opens the portal in your default browser. Keep the backend window open while using the Python/Java sandbox. You do not need to type `python backend.py` manually.
