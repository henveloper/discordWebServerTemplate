# What is this?

Template of a simple ts koa rest api server with a discord connection, extracted from a private project.

# Environments

To run the application, you need the following ENV

- NODE_ENV=development
- PORT=8080
- MONGO_URI=YOUR_MONGO_URI
- DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN

You also need to change some [configs](./src/configs/index.ts).

To get the ci-cd to GAE working, please refer to the github workflow.

## pricing of GCP

This application should not incur GAE charges, however, storage for the docker images does incur charge of around 1 HKD
per month for me.
