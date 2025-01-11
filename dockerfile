FROM node



COPY package.json package.json
COPY index.js index.js
RUN npm install
RUN mkdir user
RUN cd user

RUN apt-get update && apt-get install -y \
    # Install Python and pip
    python3 python3-pip \
    # Install Java (default-jdk)
    default-jdk \
    # Install GCC and G++
    build-essential \
    # Install Git
    git \
    # Install other useful tools
    curl wget


# Add Node.js global packages
RUN npm install -g typescript

ENTRYPOINT [ "node", "index.js" ]