#! /usr/bin/env node

/**
 * @description This is Env-Manager CLI
 * It is used to manage .env files in a project
 * It can be used to encrypt, decrypt, clone, and export .env files
 */
const pkg = require('./package.json');
const { Command } = require('commander');
const Commands = require('./src/commands');

/**
 * @description These are reusable options to pass in to different programs
 */
const REUSABLE_OPTIONS = {
    all: ['-a, --all', 'runs operation on all of the objects/files'],
    //but: ['-b, --but [filenames]', 'dont use the listed files', Utils.handleCommaSeparateArgs],
    //force: ['-f, --force', 'dont stop when something fails'],
    confirm: ['-c, --confirm', 'confirm the action'],
    verbose: ['-v, --verbose', 'print more information'],
    upto: ['-u, --upto [number]', 'run migrations upto a certain file'],
    //between: ['-w, --between [range]', 'run migrations on a range', Utils.handleCommaSeparateArgs],
    extensions: ['-ext, --extensions', 'to include postgis extensions in operation']
};

const program = new Command();
program.name('emg').version(pkg.version);

/**
 * Example commands:
 * emr encrypt <PATH_TO_FILE> <IV> <KEY>
 * emr decrypt <PATH_TO_FILE> <PATH_TO_OUTPUT>  <IV> <KEY>
 * emr clone <PATH_TO_FILE> <PATH_TO_OUTPUT>
 * emr export <PATH_TO_FILE> -d DESTINATION -f FORMAT
 * emr credentials set <PASSWORD>
 * emr credentials get
 */
// const cloneCmd = program.command('clone');
const credentialsCmd = program.command('credentials').aliases(['cred', 'creds', 'c']);

program
    .command('setup')
    .aliases(['s', 'init'])
    .description('Initial setup of the env manager')
    .action(Commands.setup)
    .option(...REUSABLE_OPTIONS.verbose);

program.command('reset').description('Clean out all env manager files and stored credentials').action(Commands.reset);
program.command('edit').alias('e').action(Commands.editConfig).description('Open up the config file in VS Code');

/**
 * --------------------------------------------------------------------------------------------------
 * @description Encrypt handles the encryption of a .env file
 * We can encrypt using a iv, and key or using a password
 * --------------------------------------------------------------------------------------------------
 */
program
    .command('encrypt')
    .action(Commands.encrypt)
    .description('Encrypts a file using whatever the current active credentials are')
    .option(...REUSABLE_OPTIONS.verbose)
    .argument('<filename>', 'The name of the file to encrypt');

/**
 * --------------------------------------------------------------------------------------------------
 * @description Decrypt handles the decryption of a .env file
 * We can decrypt using a iv, and key or using a password
 * --------------------------------------------------------------------------------------------------
 */
program
    .command('decrypt')
    .action(Commands.decrypt)
    .description('Decrypts a file using whatever the current active credentials are')
    .option(...REUSABLE_OPTIONS.verbose)
    .option('-k --key <key>', 'The key to use for decryption')
    .option('-i --iv <iv>', 'The iv to use for decryption')
    .option('-a --algorithm <algorithm>', 'The algorithm to use for decryption')
    .argument('<filename>', 'The name of the file to decrypt');

/**
 * --------------------------------------------------------------------------------------------------
 * @description Clone handles the cloning of a .env file
 * --------------------------------------------------------------------------------------------------
 */
// cloneCmd;

/**
 * --------------------------------------------------------------------------------------------------
 * @description Transform handles converting a file from one format to another
 * --------------------------------------------------------------------------------------------------
 */
const transformCmd = program
    .command('transform')
    .action(Commands.transform)
    .description('Transform a file to a different format')
    .option('-d --destination [destination]', 'The destination to save transformed the file to')
    .option('-f --outputFormat <format>', 'The format to transform the file to')
    .option('-i --inputFormat [format]', 'The format of the file being transformed - defaults to the file extension')
    .option(
        '-w --useActiveCredentialsDirectory',
        'Use the working directory of the active credentials instead of the current directory'
    )
    .argument('<filename>', 'The name of the file to transform');

transformCmd.command('formats').description('List all available transformers').action(Commands.listTransformers);

/**
 * --------------------------------------------------------------------------------------------------
 * @description Credentials handles the setting and getting of credentials
 * We can set a password and get the password
 * --------------------------------------------------------------------------------------------------
 */
credentialsCmd
    .description('Set and get credentials')
    .command('generate')
    .aliases(['g', 'gen'])
    .action(Commands.generateCredentials)
    .addHelpText('before', 'Generate new credentials - password or (key and iv), defaults to password.')
    .option('-t --type [password|key]', 'Type of credentials to generate', 'password')
    .option(
        '-s --save [name]',
        'Save the newly generated credentials in the config credentials file, if name is provided it will save it under that name'
    );

credentialsCmd
    .command('list')
    .aliases(['ls', 'l'])
    .description('List all saved credentials')
    .action(Commands.listCredentials)
    .option('-u --unsafe', 'Print sensitive information like the password/key - defaults to false')
    .option(...REUSABLE_OPTIONS.verbose);

credentialsCmd
    .command('current')
    .aliases(['c', 'active'])
    .description('Get the current active credentials')
    .action(Commands.getActiveCredential)
    .option(...REUSABLE_OPTIONS.verbose);

credentialsCmd
    .command('set')
    .aliases(['s'])
    .description('Set the active credentials to use')
    .action(Commands.setActiveCredential)
    .argument('<name>', 'The name of the credential to set as active');

credentialsCmd
    .command('remove')
    .aliases(['rm', 'r', 'delete', 'del'])
    .description('Remove a saved credential')
    .action(Commands.removeCredential)
    .argument('<name>', 'The name of the credential to remove');

const credentialPathCmd = credentialsCmd
    .command('path')
    .aliases(['p'])
    .description('Set the working path for the relevant credentials');

credentialPathCmd
    .command('set')
    .description(
        'Set the working path for the provided credentials - if no credentials are provided, it will use the active credentials'
    )
    .action(Commands.setWorkingPath)
    .option(
        '-c --credential [credential]',
        'The name of the credential - if not provided, it will use the active credential'
    )
    .option('-p --path [path]', 'The path to set as the working path')
    .option('-w --useWorkingDirectory', 'Whether to use the working directory, if set to true, "path" is ignored');

/** ---------------------------------------------------------------------------------------------- */
// after all commands are added we parse the arguments
program.parse();
