interface Trace {
    traceId: string,
    parentId?: string,
    id?: string,
    kind?: string,
    name?: string,
    timestamp: number,
    duration: number,
    localEndpoint?: {
        serviceName?: string,
        ipv4?: string
    },
    tags?: {
        "http.method"?: string,
        "http.path"?: string
    }
}

type Spans = Trace[];
type TracesFile = Spans[];

import yargs from 'yargs';
import fs from 'fs';


let yargsConfig = yargs
    .option('inputFile', {
        alias: 'i',
        description: 'Input file to parse',
        type: "string"
    })
    .option('outputFile', {
        alias: 'o',
        description: 'Output file to write to',
        type: "string"
    })
    .option('encoding', {
        alias: 'c',
        description: 'Encoding of input file',
        type: "string"
    })
    .command('convert', 'Converts json traces to csv traces')
    .help()
    .alias('help', 'h')

const argv = yargsConfig.argv

if (!argv._.includes('convert')) {
    yargsConfig.showHelp();
    process.exit();
}

const inputFile = argv.inputFile || 'input.json';
const outputFile = argv.outputFile || 'output.csv';
const encoding: string = argv.encoding || 'utf8';

const tracesFile: TracesFile = JSON.parse(fs.readFileSync(inputFile, encoding));

const output = tracesFile
    .flat()
    .map(trace => `"${(trace.traceId)}","${(trace.name || '')}","${(trace.timestamp)}","${(trace.duration)}"\n`)
    .reduce((previousValue, currentValue) => previousValue + currentValue)

fs.writeFile(outputFile, output, err => {
    if (err) {
        return console.error(err);
    }
    console.log(`File saved as ${outputFile}!`);
});

