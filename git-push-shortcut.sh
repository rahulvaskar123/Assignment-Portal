#!/bin/bash

# AWS Deployment Shortcut Script
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
echo "Enter commit message (default: 'Deploy to AWS Amplify'):"
read commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Deploy to AWS Amplify"
fi
git commit -m "$commit_msg"

# Set branch to main
git branch -M main

# Push
echo "Pushing to GitHub..."
echo "Note: You may be asked for your GitHub username and Personal Access Token (PAT)."
git push -u origin main

echo "---------------------------"
echo "Done! Now go to AWS Amplify Console to connect this repository."
