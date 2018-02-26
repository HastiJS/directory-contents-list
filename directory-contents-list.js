/*
 * Directory contents list.
 *
 * Lists directory contents.
 */

'use strict';

/*
 * Load Node.js modules.
 */
const fs = require('fs');
const path = require('path');

/*
 * Load useful dependencies.
 */
const pathResolveByParent = require('path-resolve-by-parent');

/**
 * Get directory contents.
 *
 * @param {Object} options -Object of filters you want to apply to result.
 * @param {requestCallback} callback -Callback function.
 */
module.exports = (options, callback) => {
  /*
   * Sanitize and validate `options`.
   */
  let sanitizedOptions = {
    root: null,
    depth: null,
    type: null,
    find: null
  };
  // `options`
  options = Object.assign(sanitizedOptions, options);
  // `options.root`
  if (!options.root || typeof options.root !== 'string') {
    throw new Error(`'options.root' must be a valid path.`);
  }
  options.root = pathResolveByParent(options.root);
  // `options.depth`
  if (options.depth || options.depth === 0) {
    if (!Array.isArray(options.depth)) {
      options.depth = [options.depth];
    }
    let notValidDepth = options.depth.filter((value) => {
      return !Number.isInteger(value) || value < 0;
    });
    if (notValidDepth.length > 0) {
      throw new Error(`'options.depth' must be a non-negative number or an array of such numbers.`);
    }
  }
  // `options.type`
  if (options.type) {
    if (!Array.isArray(options.type)) {
      options.type = [options.type];
    }
    let notValidType = options.type.filter((value) => {
      return typeof value !== 'string';
    });
    if (notValidType.length > 0) {
      throw new Error(`'options.type' must be a string or an array of strings.`);
    }
    options.type = options.type.map((value) => {
      return value.toLowerCase();
    });
  }
  // `options.find`
  if (options.find && !(typeof options.find === 'string' || options.find instanceof RegExp)) {
    throw new Error(`'options.find' must be a string or RegExp.`);
  }

  let contents = [];
  // Get contents of working path.
  (function getContents (workingDirectory, subDirectories) {
    // Check depth filter.
    let depthCheck = null;
    let maxDepthReached = false;
    if (options.depth) {
      options.depth.sort();
      let currentDepth = workingDirectory.replace(options.root, '').split('/').length - 1;
      if (currentDepth > options.depth[options.depth.length - 1]) {
        maxDepthReached = true;
      }
      depthCheck = options.depth.indexOf(currentDepth) > -1;
    }
    // Read the directory.
    fs.readdir(workingDirectory, (error, list) => {
      if (error) {
        return callback(error);
      }
      let count = list.length;
      if (count === 0) {
        let workingDirectoryIndex = subDirectories.indexOf(workingDirectory);
        if (workingDirectoryIndex > -1) {
          subDirectories.splice(workingDirectoryIndex, 1);
        }
        if (subDirectories.length === 0) {
          callback(null, contents);
        }
      }
      list.forEach((listItem) => {
        let listItemPath = path.resolve(workingDirectory, listItem);
        fs.lstat(listItemPath, (error, stat) => {
          if (error) {
            throw error;
          }
          // If `listItem` is a directory.
          if (stat.isDirectory()) {
            if ((!options.type || options.type.indexOf('directory') > -1) && (!options.find || listItem.search(options.find) > -1) && depthCheck !== false) {
              contents.push(listItemPath);
            }
            // Get out of current function if reach the maximume of depth.
            if (!maxDepthReached) {
              subDirectories.push(listItemPath);
              getContents(listItemPath, subDirectories);
            }
          }
          // If `listItem` is a file.
          if (stat.isFile() && (!options.type || options.type.indexOf('file') > -1) && (!options.find || listItem.search(options.find) > -1) && depthCheck !== false) {
            contents.push(listItemPath);
          }
          // If `listItem` is a symbolic link.
          if (stat.isSymbolicLink() && (!options.type || options.type.indexOf('symboliclink') > -1) && (!options.find || listItem.search(options.find) > -1) && depthCheck !== false) {
            contents.push(listItemPath);
          }
          // If `listItem` is a socket.
          if (stat.isSocket() && (!options.type || options.type.indexOf('socket') > -1) && (!options.find || listItem.search(options.find) > -1) && depthCheck !== false) {
            contents.push(listItemPath);
          }
          // If `listItem` is a FIFO.
          if (stat.isFIFO() && (!options.type || options.type.indexOf('fifo') > -1) && (!options.find || listItem.search(options.find) > -1) && depthCheck !== false) {
            contents.push(listItemPath);
          }
          // If `listItem` is a character device.
          if (stat.isCharacterDevice() && (!options.type || options.type.indexOf('characterdevice') > -1) && (!options.find || listItem.search(options.find) > -1) && depthCheck !== false) {
            contents.push(listItemPath);
          }
          // If `listItem` is a block device.
          if (stat.isBlockDevice() && (!options.type || options.type.indexOf('blockdevice') > -1) && (!options.find || listItem.search(options.find) > -1) && depthCheck !== false) {
            contents.push(listItemPath);
          }
          --count;
          if (count === 0) {
            let workingDirectoryIndex = subDirectories.indexOf(workingDirectory);
            if (workingDirectoryIndex > -1) {
              subDirectories.splice(workingDirectoryIndex, 1);
            }
            if (subDirectories.length === 0) {
              callback(null, contents);
            }
          }
        });
      });
    });
  })(options.root, []);
};
