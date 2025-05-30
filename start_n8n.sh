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

#n8n start --tunnel
n8n start
