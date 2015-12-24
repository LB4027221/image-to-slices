
var fs = require('fs');
var Path = require('path');
var should = require('should');
var ImageToSlices = require('../lib/index');
var utils = require('../lib/utils');

var pngImagePath = './example/building.png';
var exportDir = './example/';
var deleteTempFile = true;

var lineXArray;
var lineYArray;

describe('image-to-slices', function() {
  it('saveToDir works', function(done) {
    lineXArray = [100, 200];
    lineYArray = [100, 200];

    ImageToSlices(pngImagePath, lineXArray, lineYArray, {
      saveToDir: exportDir
    }, function() {
      fs.existsSync(exportDir + 'section-1.png').should.equal(true);
      deleteTempFile && deleteAllFile(exportDir);
      done();
    });
  });

  it('middleBoundaryMode works', function(done) {
    lineXArray = [100, 200];
    lineYArray = [100, 200, 250];

    ImageToSlices(pngImagePath, lineXArray, lineYArray, {
      saveToDir: exportDir,
      middleBoundaryMode: true
    }, function() {
      fs.existsSync(exportDir + 'section-1.png').should.equal(true);
      deleteTempFile && deleteAllFile(exportDir);
      done();
    });
  });

  it('clipperOptions works', function(done) {
    lineXArray = [100, 200];
    lineYArray = [100, 200, 250];

    ImageToSlices(pngImagePath, lineXArray, lineYArray, {
      saveToDir: exportDir,
      middleBoundaryMode: true,
      clipperOptions: {
        quality: 20
      }
    }, function() {
      fs.existsSync(exportDir + 'section-1.png').should.equal(true);
      deleteTempFile && deleteAllFile(exportDir);
      done();
    });
  });

  it('throws when save directory not specified', function(done) {
    try {
      ImageToSlices(pngImagePath, lineXArray, lineYArray, {
        saveToDir: null
      }, function() {
        true.should.equal(false);
        done();
      });
    } catch(e) {
      e.message.should.equal('Save directory must be specified');
      done();
    }
  });

  it('throws when lineXArray and lineYArray is empty', function(done) {
    lineXArray = [];
    lineYArray = [];

    try {
      ImageToSlices(pngImagePath, lineXArray, lineYArray, {
        saveToDir: exportDir,
        middleBoundaryMode: true,
        clipperOptions: {
          quality: 20
        }
      }, function() {
        true.should.equal(false);
        done();
      });
    } catch(e) {
      e.message.should.equal('At least one reference line');
      done();
    }
  });
});

describe('utils', function() {
  it('sortAndUnique() works', function() {
    var arr = [223, 1, 8863, 223, 1, 9];
    should(utils.sortAndUnique(arr)).eql([1, 9, 223, 8863]);

    arr = [87, 0, 2, 13, 87, 9, 1, 9, 10];
    should(utils.sortAndUnique(arr)).eql([0, 1, 2, 9, 10, 13, 87]);
  });
});


function deleteAllFile(dir) {
  fs.readdir(dir, function(err, files) {
    files.forEach(function(fileName) {
      var filePath = Path.join(dir, fileName);
      if (/^section/.test(fileName)) {
        deleteFile(filePath);
      }
    });
  });
}
function deleteAllFile2(dir, num) {
  for (var i = 1; i <= num; i++) {
    deleteFile(dir + 'section-' + i + '.png');
  }
}

function deleteFile(path) {
  fs.unlink(path, function(err) {
    if (err) throw err;
  });
}