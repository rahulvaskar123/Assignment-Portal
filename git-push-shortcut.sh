#!/bin/bash

# AWS Deployment Shortcut Script - Version 1.2
echo "--- GitHub Push Shortcut ---"

# Check if git is installed
if ! command -v git &> /dev/null
then
    echo "Git is not installed. Please install it first."
    exit
fi

# Check for Git Identity
if [ -z "$(git config user.email)" ]; then
    echo "Enter your Git Email:"
    read git_email
    git config --global user.email "$git_email"
fi

if [ -z "$(git config user.name)" ]; then
    echo "Enter your Git Name:"
    read git_name
    git config --global user.name "$git_name"
fi

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
fi

# Ask for the repository URL
echo "Enter your GitHub repository URL (e.g., https://github.com/yourusername/your-repo.git):"
read repo_url

if [ -z "$repo_url" ]; then
    echo "Error: Repository URL is required."
    exit 1
fi

# Set the remote
git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"

# Add all files
echo "Staging files..."
git add .

# Commit
echo "Committing changes..."
git commit -m "Initial AWS Deployment" 2>/dev/null || echo "No new changes to commit."

# Set branch to main
git branch -M main

# Push instructions
echo "---------------------------------------------------"
echo "IMPORTANT: When prompted for a password, do NOT use your GitHub password."
echo "PASTE your 'Personal Access Token' (PAT) instead."
echo "You provided one earlier: ghp_...MaIbg"
echo "---------------------------------------------------"

echo "Pushing to GitHub..."
git push -u origin main --force

echo "---------------------------"
echo "If you saw 'Success', your code is now on GitHub!"
echo "Next Step: Go to AWS Amplify Console and connect this repository."
