# # Please note - this file is in early stages, not yet for use in production

# Build the base image
FROM node:12

RUN mkdir -p /app
WORKDIR /app

# Install the wh-wrapper library
RUN npm install -g wh-wrapper

# Expose default port
EXPOSE 3000

# Create a data directory to persist files
RUN mkdir /app/data

# Create an entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Define the default command as a placeholder
CMD ["echo", "Please provide your code and port number"]