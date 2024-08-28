FROM node:14-buster-slim As Stage1

ARG BUILD_ID
ENV BUILD_ID=$BUILD_ID

LABEL stage=Stage1
LABEL build=$BUILD_ID

ENV NODE_ENV=production \
    PROJECT_HOME=/usr/app/ \
    DEBUG="app:*" \
    BUILD_DEPS="git python build-essential"

# create project home
RUN mkdir -p ${PROJECT_HOME}

# switch to working directory
WORKDIR ${PROJECT_HOME}

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ${PROJECT_HOME}

# install deps
RUN apt-get update > /dev/null \
    && apt-get install -y -qq --no-install-recommends ${BUILD_DEPS} \
    vim curl > /dev/null

#npm install
RUN npm i -g npm@6 \
    && npm install --quiet

# copy source code and run the build
COPY . $PROJECT_HOME

RUN npm run build

#cleanup
RUN apt-get purge -y ${BUILD_DEPS} > /dev/null \
    && rm -rf /var/lib/apt/lists/*
#Stage 2
#######################################
FROM node:14-buster-slim

ENV NODE_ENV=production \
    PROJECT_HOME=/usr/app/ \
    DEBUG="app:*"

# create project home
RUN mkdir -p ${PROJECT_HOME}

# Set working directory to nginx resources directory
WORKDIR $PROJECT_HOME

# Copies npm related resources
COPY --from=Stage1 $PROJECT_HOME/dist ./

#Copies node modules
COPY --from=Stage1 $PROJECT_HOME/package.json ./

# Copies pm2 related resources
COPY --from=Stage1 $PROJECT_HOME/process-release.yml ./process.yml

# install deps
RUN apt-get update > /dev/null \
    && apt-get install -y -qq --no-install-recommends vim curl > /dev/null

#npm install
RUN npm i -g npm@6 \
    && npm i -g --quiet pm2 \
    && npm install --quiet

EXPOSE 80 443 8080

# start the application
CMD ["pm2-runtime","process.yml"]