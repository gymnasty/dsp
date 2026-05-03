#!/bin/bash
set -e

echo "🚀 Starting setup for Dyson Sphere Program Item Manager..."

# 1. Homebrew check
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install Homebrew first: https://brew.sh/"
    exit 1
fi

# 2. anyenv / nodenv setup
echo "🍺 Ensuring anyenv is installed..."
if ! command -v anyenv &> /dev/null; then
    brew install anyenv
    # We don't run init --force here if it already exists to avoid prompts
    if [ ! -d "$HOME/.anyenv" ]; then
        anyenv install --init --force
    fi
fi

# Initialize anyenv in the current script context
eval "$(anyenv init -)"

# Check if nodenv is already in anyenv's envs directory instead of using 'anyenv environments'
if [ ! -d "$HOME/.anyenv/envs/nodenv" ]; then
    echo "📦 Installing nodenv via anyenv..."
    anyenv install nodenv
    eval "$(anyenv init -)"
else
    echo "✅ nodenv is already installed."
fi

NODE_VERSION=$(cat .node-version)
echo "📦 Checking Node.js $NODE_VERSION via nodenv..."
if ! nodenv versions --bare | grep -q "^$NODE_VERSION$"; then
    echo "📦 Installing Node.js $NODE_VERSION..."
    nodenv install "$NODE_VERSION"
fi

nodenv local "$NODE_VERSION"
nodenv rehash

# 3. Node.js version check
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed despite setup efforts."
    exit 1
fi

# 2. Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

echo "✅ Setup complete! You can now run 'make dev' to start the development server."
