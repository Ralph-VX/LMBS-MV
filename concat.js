const {readFileSync, writeFileSync, mkdirSync, existsSync} = require('fs');

const Concat = require('concat-with-sourcemaps');

function concatSource(name, basedir, outdir, sourceMap){
    const order = JSON.parse(readFileSync(`./filelist.json`).toString());

    let concat = new Concat(true, `${name}`, '\n\n');

    order.forEach(fileName=>{
        const path = `${basedir}/${fileName}`;
        concat.add(path, readFileSync(path).toString());
    });

    writeFileSync(`${outdir}/${name}`, concat.content);
    if(sourceMap)writeFileSync(`${outdir}/${name}.map`, concat.sourceMap);
}

concatSource(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
