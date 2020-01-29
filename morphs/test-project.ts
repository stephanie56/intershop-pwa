import { Project } from 'ts-morph';
console.log('hi');
const project = new Project({
  tsConfigFilePath: 'D:/projects/pwa-github/tsconfig.json',
});
const actionsFile = project.getSourceFile('contact.actions.ts');
actionsFile.getClasses().forEach(actionClass => {
  console.log(actionClass.getProperty('type'));
  console.log('.......................................');
});
