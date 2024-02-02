npx genversion --esm --semi src/version.ts 
npm run format
git add package.json package-lock.json src/version.ts
git commit --amend --no-edit
