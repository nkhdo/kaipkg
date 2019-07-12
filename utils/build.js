const ora = require('ora');
const childProcesss = require('child_process');

const timeout = 1000 * 60 * 2;
const buildCommand = 'yarn build';

const build = (packageAlias, packagePath) => {
  const spinner = ora({
    text: `Building "${packageAlias}"`,
    spinner: { interval: 0, frames: ['…'] },
  }).start();

  try {
    childProcesss.execSync(buildCommand, { timeout, cwd: packagePath });
  } catch (error) {
    spinner.fail(`Could not finish building "${packageAlias}" library`);
    process.exit();
  }
  spinner.succeed(`Finished building "${packageAlias}"`);
};

module.exports = build;
