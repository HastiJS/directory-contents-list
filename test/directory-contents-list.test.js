/*
 * Directory contents list test.
 */

'use strict';

const path = require('path');
const assert = require('assert');
const direcctoryContentsList = require('../.');

/*
 * Start testing.
 */
describe('directory-contents-list', () => {
  it('Should return all directory contents', (done) => {
    direcctoryContentsList({root: '../example'}, (error, list) => {
      assert.equal(error, null);
      assert.equal(list.length, 10);
      assert.equal(list[0], path.resolve(__dirname, '../example/dir1'));
      assert.equal(list[1], path.resolve(__dirname, '../example/dir2'));
      assert.equal(list[2], path.resolve(__dirname, '../example/file1'));
      assert.equal(list[3], path.resolve(__dirname, '../example/dir1/dir11'));
      assert.equal(list[4], path.resolve(__dirname, '../example/dir1/file1'));
      assert.equal(list[5], path.resolve(__dirname, '../example/dir2/file01'));
      assert.equal(list[6], path.resolve(__dirname, '../example/dir2/file02'));
      assert.equal(list[7], path.resolve(__dirname, '../example/dir1/dir11/dir111'));
      assert.equal(list[8], path.resolve(__dirname, '../example/dir1/dir11/file01'));
      assert.equal(list[9], path.resolve(__dirname, '../example/dir1/dir11/dir111/file02'));
      done();
    });
  });
  it('Should return all subdirectories', (done) => {
    direcctoryContentsList({root: '../example', type: 'directory'}, (error, list) => {
      assert.equal(error, null);
      assert.equal(list.length, 4);
      assert.equal(list[0], path.resolve(__dirname, '../example/dir1'));
      assert.equal(list[1], path.resolve(__dirname, '../example/dir2'));
      assert.equal(list[2], path.resolve(__dirname, '../example/dir1/dir11'));
      assert.equal(list[3], path.resolve(__dirname, '../example/dir1/dir11/dir111'));
      done();
    });
  });
  it('Should return all files and simbolic links', (done) => {
    direcctoryContentsList({root: '../example', type: ['file', 'symbolicLink']}, (error, list) => {
      assert.equal(error, null);
      assert.equal(list.length, 6);
      assert.equal(list[0], path.resolve(__dirname, '../example/file1'));
      assert.equal(list[1], path.resolve(__dirname, '../example/dir1/file1'));
      assert.equal(list[2], path.resolve(__dirname, '../example/dir2/file01'));
      assert.equal(list[3], path.resolve(__dirname, '../example/dir2/file02'));
      assert.equal(list[4], path.resolve(__dirname, '../example/dir1/dir11/file01'));
      assert.equal(list[5], path.resolve(__dirname, '../example/dir1/dir11/dir111/file02'));
      done();
    });
  });
  it('Should return all symbolic links in depth of 0 or 3', (done) => {
    direcctoryContentsList({root: '../example', depth: [1, 3], type: ['symboliclink']}, (error, list) => {
      assert.equal(error, null);
      assert.equal(list.length, 2);
      assert.equal(list[0], path.resolve(__dirname, '../example/dir1/file1'));
      assert.equal(list[1], path.resolve(__dirname, '../example/dir1/dir11/dir111/file02'));
      done();
    });
  });
  it(`Should return all files with names end up with '1'`, (done) => {
    direcctoryContentsList({root: '../example', find: /1$/, type: ['file']}, (error, list) => {
      assert.equal(error, null);
      assert.equal(list.length, 2);
      assert.equal(list[0], path.resolve(__dirname, '../example/file1'));
      assert.equal(list[1], path.resolve(__dirname, '../example/dir2/file01'));
      done();
    });
  });
  it(`Should return all files with names containing '01' or '02'`, (done) => {
    direcctoryContentsList({root: '../example', find: /01|02/, type: ['file']}, (error, list) => {
      assert.equal(error, null);
      assert.equal(list.length, 2);
      assert.equal(list[0], path.resolve(__dirname, '../example/dir2/file01'));
      assert.equal(list[1], path.resolve(__dirname, '../example/dir2/file02'));
      done();
    });
  });
});
