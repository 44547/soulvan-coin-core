#!/usr/bin/env bash
set -euo pipefail

if ! command -v gradle >/dev/null 2>&1; then
  if command -v apt >/dev/null 2>&1; then
    echo "Installing gradle via apt (requires sudo)..."
    sudo apt-get update -y
    sudo apt-get install -y gradle
  else
    echo "Gradle not found. Please install Gradle and re-run."
    exit 1
  fi
fi

GRADLE_VERSION="${GRADLE_VERSION:-8.9}"
echo "Generating Gradle wrapper $GRADLE_VERSION ..."
gradle wrapper --gradle-version "$GRADLE_VERSION"
echo "Wrapper generated."
