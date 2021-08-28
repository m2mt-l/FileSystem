# File System
Recursion Project6 File System

## URL
https://m2mt-l.github.io/FileSystem/

## Description
This is a web application for Recursion(https://recursionist.io).<br>

## Feature
This is a web file system that you can use command line. <br>
You can use the following commands. The function is almost the same as Linux, but there are some limitations. If you put option "--help" after each command, you can see the usage details.<br>
```
touch
mkdir
ls
cd
pwd
print
setContent
rm
mv
cp
```


## Limitation
- Options cannot be used such as -ra(-ar) or -r -a. Please specify them as below.
    ```
    ls -a
    la -r
    ```
- Options cannot be put after filename or folder name. Please specify before them.
    ```
    ls -a FILE or DIR
    ```
- Absolute and relative paths should be as below. Unable to use ./xxx/xxx or ../xxx/xxx.
    ```
    Absolute path: /xxx/xxx
    Relative path: xxx/xxx
    ```
- rm command will delete both file and folder.

## Future Enhancement
TBD

## Installation
```
$ git clone https://github.com/m2mt-l/FileSystem.git 
$ cd FileSystem
```