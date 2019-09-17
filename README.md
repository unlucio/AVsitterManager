# AVsitterManager
import-export utility for avsitter notecards


### Importing (from notecard to  directory tree):
Importing an AVpos notecard will generate a directory tree rappresenting it:
- all the menu and sub menues will be translated into directories and sub directories
- all the animation definition will be translated into json files with all the needed informations.
- in case of sync animations the generated json file will contain `a` and `b` variants for such an animation

```shell
$ cd parser
$ node reader.js /path/to/AVpos
```

### Exporting (from directories to notecard):
Exporting will assamble the directory tree into a valid `AVpos` string you can paste in your notecard.

```shell
$ cd generator
$ node index.js /path/to/directory
```

In case you need to have definitions for multiple agents the genrator accepts an "how many" parameter:
```shell
$ cd generator
$ node index.js /path/to/directory 4
```
