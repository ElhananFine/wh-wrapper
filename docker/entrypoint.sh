# # Please note - this file is in early stages, not yet for use in production

#!/bin/bash

# Set the exposed port
PORT=${PORT:-3000}

# Check if user provided code files
if [ -d "/code" ]; then
    # Copy user code to the app directory
    cp -r /code/. /app/

    # Install any dependencies from user code
    npm install

    # Run the user code with the specified port
    node /app/index.js $PORT
else
    echo "No code provided. Please mount your code files to the /code directory."
fi