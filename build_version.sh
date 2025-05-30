#!/usr/bin/env bash

#check if lint is ok
yarn run lint
if [ $? -ne 0 ]; then
		echo "Linting failed. Please fix the issues before proceeding."
		exit 1
fi

#check if test is ok
yarn run test
if [ $? -ne 0 ]; then
		echo "Tests failed. Please fix the issues before proceeding."
		exit 1
fi

# build
yarn run build
if [ $? -ne 0 ]; then
		echo "Build failed. Please fix the issues before proceeding."
		exit 1
fi

npm version patch
#check if version is ok
if [ $? -ne 0 ]; then
		echo "Versioning failed. Please fix the issues before proceeding."
		exit 1
fi

git push --tags && git push
if [ $? -ne 0 ]; then
		echo "Git push failed. Please fix the issues before proceeding."
		exit 1
fi

#publish to npm
npm publish --access public
if [ $? -ne 0 ]; then
		echo "Publishing failed. Please fix the issues before proceeding."
		exit 1
fi
echo "Build and publish completed successfully."
