var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "yargs", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const yargs_1 = __importDefault(require("yargs"));
    const fs_1 = __importDefault(require("fs"));
    let yargsConfig = yargs_1.default
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
        .alias('help', 'h');
    const argv = yargsConfig.argv;
    if (!argv._.includes('convert')) {
        yargsConfig.showHelp();
        process.exit();
    }
    const inputFile = argv.inputFile || 'input.json';
    const outputFile = argv.outputFile || 'output.csv';
    const encoding = argv.encoding || 'utf8';
    const tracesFile = JSON.parse(fs_1.default.readFileSync(inputFile, encoding));
    const output = tracesFile
        .flat()
        .map(trace => `"${(trace.traceId)}","${(trace.name || '')}","${(trace.timestamp)}","${(trace.duration)}"\n`)
        .reduce((previousValue, currentValue) => previousValue + currentValue);
    fs_1.default.writeFile(outputFile, output, err => {
        if (err) {
            return console.error(err);
        }
        console.log(`File saved as ${outputFile}!`);
    });
});
