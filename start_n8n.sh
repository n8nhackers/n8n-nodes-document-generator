export N8N_LOG_LEVEL=debug
export N8N_LOG_FILE_LOCATION=n8n.log

if [ ! -d "$HOME/.n8n/custom" ]; then
    mkdir -p "$HOME/.n8n/custom"
fi

if [ ! -d "$HOME/.n8n/custom/node_modules" ]; then
    mkdir -p "$HOME/.n8n/custom/node_modules"
fi

if [ ! -d "$HOME/.n8n/custom/node_modules/n8n-nodes-document-generator" ]; then
    yarn build && npm link
    cd "$HOME/.n8n/custom/node_modules" || exit
    npm link n8n-nodes-document-generator
fi

if ! command -v npm &> /dev/null; then
    echo "npm command not found. Please install with nvm following https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating"
    exit 1
fi

#exists n8n binary?
if ! command -v n8n &> /dev/null; then
    echo "n8n command not found. Please install n8n globally using 'npm install -g n8n'."
    exit 1
fi

#n8n start --tunnel
n8n start
