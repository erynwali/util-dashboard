#!/bin/bash

# Shell script to move files from 'util dashboard' to root for Vercel deployment

# Ensure we're in the correct directory
SOURCE_DIR="util dashboard"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: '$SOURCE_DIR' directory not found. Make sure you're running this script from the project root."
  exit 1
fi

echo "Copying files from '$SOURCE_DIR' to the root directory..."

# Find all files and directories in 'util dashboard'
find "$SOURCE_DIR" -type d | while read -r dir; do
  # Create the target directory (skipping the source root directory)
  if [ "$dir" != "$SOURCE_DIR" ]; then
    target_dir="${dir#"$SOURCE_DIR/"}"
    mkdir -p "$target_dir"
    echo "Created directory: $target_dir"
  fi
done

# Copy all files
find "$SOURCE_DIR" -type f | while read -r file; do
  # Calculate target path by removing source dir prefix
  target_file="${file#"$SOURCE_DIR/"}"
  # Ensure target directory exists
  target_dir=$(dirname "$target_file")
  mkdir -p "$target_dir"
  # Copy the file
  cp "$file" "$target_file"
  echo "Copied file: $file -> $target_file"
done

# Remove the vercel.json from the util dashboard directory if it exists
if [ -f "$SOURCE_DIR/vercel.json" ]; then
  rm "$SOURCE_DIR/vercel.json"
  echo "Removed $SOURCE_DIR/vercel.json"
fi

echo ""
echo "Project restructured for Vercel deployment."
echo "You can now deploy from the root directory."
echo ""
echo "Important: After successful deployment, you can delete these copied files if you want to keep your original project structure." 