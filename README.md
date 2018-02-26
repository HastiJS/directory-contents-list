# Directory Contents List

> Get contents of a directory synchronously

Useful when you want to get contents of a directory.

## Install

```
$ npm install directory-contents-list --save
```

## Know more

`/home/hastijs` contents are listed below:

```
/home/hastijs/
|_ dir1/
|  |_ dir11/
|  |  |_file1
|  |_ dir12/
|_ dir2/
   |_ file2
```

We can get `/home/hastijs` contents by `directory-contents-list` module easily:

```js
const options = {root: '/home/hastijs'};
console.log(require('directory-contents-list')(options));
/*
=> [ '/home/hastijs/dir1',
     '/home/hastijs/dir2',
     '/home/hastijs/dir1/dir11',
     '/home/hastijs/dir1/dir12',
     '/home/hastijs/dir2/file2',
     '/home/hastijs/dir1/dir11/file1' ]
*/
```

## Usage

In all examples bellow the `/home/hastijs` directory is the same directory shown in **Know more** (previous) section.

### Filter directory contents by depth

```js
const options = {
  root: '/home/hastijs',
  depth: 2
};
console.log(require('directory-contents-list')(options));
// => [ '/home/hastijs/dir1/dir11/file1' ]
```

### Filter directory contents by depth and type

```js
const options = {
  root: '/home/hastijs',
  depth: [0, 1],
  type: 'directory'
};
console.log(require('directory-contents-list')(options));
/*
=> [ '/home/hastijs/dir1',
     '/home/hastijs/dir2',
     '/home/hastijs/dir1/dir11',
     '/home/hastijs/dir1/dir12' ]
*/
```

### Search in directory contents and filter by type

```js
const options = {
  root: '/home/hastijs',
  type: ['file', 'symbolicLink'],
  find: /1$/
};
console.log(require('directory-contents-list')(options));
// => [ '/home/hastijs/dir1/dir11/file1' ]
```

## API

### directoryContentsList(options)

#### options

Type: `object`

Options to filter the result.

Available keys for `options` are `root`, `depth`, `type` and `find`.

##### options.root

Type: `string`

Path of directory you want get its contents.

##### options.depth

Type: `number` | `array`

Depth of contents as a number or array of numbers.

##### options.type

Type: `string` | `array`

Type of contents as a string or array of strings.

Availble values are `file`, `directory`, `symbolicLink`, `socket`, `FIFO`, `characterDevice`, and `blockDevice` (case insensitive).

##### options.find

Type: `string` | `object` (RegExp)

Search the contents using a string or a RegExp.

## Contributing

Everyone is very welcome to contribute to Directory Contents List project. Directory Contents List is a HastiJS project so please see [HastiJS contributing guidelines](https://github.com/HastiJS/contributing) before contributing.

## License

MIT © [HastiJS](https://github.com/HastiJS)
