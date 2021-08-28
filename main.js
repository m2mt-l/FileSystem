class Node{
    constructor(data, name, type, parent){
        this.data = data;
        this.next = null;
        this.prev = null;
        this.name = name;
        this.date = new Date();
        this.type = type;
        this.parent = parent;
        this.list = new LinkedListChild();
    }

    copyNode(){
        let newNode = new Node(this.date, this.name, this.type, this.parent);
        if(this.list.head == null) return newNode;
        let iterator = this.list.head;
        while(iterator != null){
            newNode.list.enqueueFront(iterator);
            iterator = iterator.next;
        }
        return newNode;
    }
}

class historyNode{
    constructor(data){
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class LinkedListChild{
    constructor(){
        this.head = null;
        this.tail = null;
    }

    enqueueFront(node){
        if(this.head == null){
            this.head = node;
            this.tail = this.head;
        }
        else{
            this.head.prev = node;
            node.next = this.head;
            this.head = node;
        }
    }

    enqueueBack(node){
        if(this.head == null){
            this.head = node;
            this.tail = this.head;
        }
        else{
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
    }

    dequeueFront(){
        if(this.head == null) return null;
        let iterator = this.head;
        this.head = this.head.next;
        if(this.head != null) this.head.prev = null;
        else this.tail = null;
        return iterator.data;
    }

    dequeueBack(){
        if(this.tail == null) return null;
        let iterator = this.tail;
        this.tail = this.tail.prev;
        if(this.tail != null) this.tail.next = null;
        else this.head = null;
        return iterator.data;
    }

    deleteNode(node){
        if(node.name == this.head.name) return this.dequeueFront();
        else if(node.name == this.tail.name) return this.dequeueBack();
        else{
        node.prev.next = node.next;
        node.next.prev = node.prev;
        }
    }

    findNode(key){
        let iterator = this.head;
        while(iterator != null){
            if(iterator.name == key) return iterator;
            iterator = iterator.next;
        }
        return null;
    }

    walkNodeFromHeadSecret(){
        let iterator = this.head;
        let result = "";
        if(iterator == null) return result;
        while(iterator != null){
            result += iterator.name + ' ';
            iterator = iterator.next
        }
        return result;
    }

    walkNodeFromHeadNormal(){
        let iterator = this.head;
        let result = "";
        if(iterator == null) return result;
        while(iterator != null){
            if(iterator.name[0] != '.') result += iterator.name + ' ';
            iterator = iterator.next
        }
        return result;
    }

    walkNodeFromTailSecret(){
        let iterator = this.tail;
        let result = "";
        if(iterator == null) return result;
        while(iterator != null){
            result += iterator.name + ' ';
            iterator = iterator.prev;
        }
        return result;
    }

    walkNodeFromTailNormal(){
        let iterator = this.tail;
        let result = "";
        if(iterator == null) return result;
        while(iterator != null){
            if(iterator.name[0] != '.') result += iterator.name + ' ';
            iterator = iterator.prev;
        }
        return result;
    }
}

class HistoryStack{
    constructor(){
        this.head = null;
    }

    push(data){
        let temp = this.head;
        this.head = new historyNode(data);
        this.head.next = temp;
    }

    peek(){
        if(this.head == null) return null;
        return this.head.data;
    }

    pop(){
        let temp = this.head;
        this.head = this.head.next;
        return temp.data;
    }
}

class FileSystem{
    constructor(){
        this.root = new Node(null, '/', "dir", null);
        this.currentDir = this.root;
        this.rmConfirm = false;
        this.rmArgument = "";
    }
    
    addFileOrDirCurrentPath(fileOrDirName, touchOrMkDir){
        if(this.currentDir.list.findNode(fileOrDirName) == null){
            let newFile = touchOrMkDir == "touch" ? new Node(null, fileOrDirName, "file", this.currentDir) : new Node(null, fileOrDirName, "dir", this.currentDir);
            this.currentDir.list.enqueueBack(newFile);
            return touchOrMkDir == "touch" ? `File: "${fileOrDirName}" created` : `Dir: "${fileOrDirName}" created`;
        }
        else if(this.currentDir.list.findNode(fileOrDirName).name == fileOrDirName){
            let newFile = touchOrMkDir == "touch" ? new Node(null, fileOrDirName, "file", this.currentDir) : new Node(null, fileOrDirName, "dir", this.currentDir);
            this.currentDir.list.deleteNode(newFile);
            this.currentDir.list.enqueueBack(newFile);
            return touchOrMkDir == "touch" ? `File: "${fileOrDirName}" overwritten` : `Dir: "${fileOrDirName}" overwritten`;
        }            
    }

    addFileOrDirAbsoluteAndRelativePath(path, allPath, filePath, fileName, dirInfo, touchOrMkDir){
        if(allPath.length == 1){
            let newFile = touchOrMkDir == "touch" ? new Node(null, fileName, "file", dirInfo) : new Node(null, fileName, "dir", dirInfo);
            dirInfo.list.enqueueBack(newFile)
            return touchOrMkDir == "touch" ? `File: "${path}" created` : `Dir: "${path}" created`
        }
        else{
            let parentDir = this.searchDirectoryPath(dirInfo, filePath);
            let newFile = touchOrMkDir == "touch" ? new Node(null, fileName, "file", parentDir) : new Node(null, fileName, "dir", parentDir)
            parentDir.list.enqueueBack(newFile);
            return touchOrMkDir == "touch" ? `File: "${path}" created` : `Dir: "${path}" created`
        }
    }

    touch(path){
        let allPath = path.split("/").filter(dirName=>dirName!='');
        let fileName = allPath[allPath.length-1];
        let filePath = allPath.length == 1 ? allPath : allPath.slice(0, allPath.length-1);
        //help
        if(path == "--help"){
            return Help.outputHelp("touch");
        }
        //absolute path
        if(this.isAbsolute(path)){
            return this.addFileOrDirAbsoluteAndRelativePath(path, allPath, filePath, fileName, this.root, "touch");
        }
        //current path
        else if(allPath.length == 1){
            return this.addFileOrDirCurrentPath(path, "touch")
        }
        //relative path
        else{
            return this.addFileOrDirAbsoluteAndRelativePath(path, allPath, filePath, fileName, this.currentDir, "touch");
        }
    }

    mkdir(path){
        let allPath = path.split("/").filter(dirName=>dirName!='');
        let fileName = allPath[allPath.length-1];
        let filePath = allPath.length == 1 ? allPath : allPath.slice(0, allPath.length-1);
        //help
        if(path == "--help"){
            return Help.outputHelp("mkdir");
        }
        //absolut path
        if(this.isAbsolute(path)){
            return this.addFileOrDirAbsoluteAndRelativePath(path, allPath, filePath, fileName, this.root, "mkdir");
        }
        //current path
        else if(allPath.length == 1){
            return this.addFileOrDirCurrentPath(path, "mkdir")
        }
        //relative path
        else{
            return this.addFileOrDirAbsoluteAndRelativePath(path, allPath, filePath, fileName, this.currentDir, "mkdir");
        }
    }

    /*
        displayLsOutputAbsoluteAndRelativePath
        Output function for ls command
    */
    displayLsOutputAbsoluteAndRelativePath(argument, allPath, dirInfo, reversed, isSecret){
        if(this.searchDirectoryPath(dirInfo, allPath) == null){
            return `no such file or directory: ${argument}`;
        }
        else{
            let searchDir = this.searchDirectoryPath(dirInfo, allPath);
            if(searchDir.type == "dir"){
                let walkList = searchDir.list;
                if(reversed){
                    return walkList.walkNodeFromTailNormal()
                }
                else return isSecret ? walkList.walkNodeFromHeadSecret() : walkList.walkNodeFromHeadNormal();
            } 
            else if(searchDir.type == "file"){
                return `${argument}`;
            }
        }
    }

    ls(argument1, argument2){
        //help
        if(argument1 == "--help"){
            return Help.outputHelp("ls");
        }

        //no argument
        if(argument1 == undefined) return this.currentDir.list.walkNodeFromHeadNormal();
        let allPath = argument2 == undefined ? argument1.split("/").filter(dirName=>dirName!='') : argument2.split("/").filter(dirName=>dirName!='') ;

        if(argument1 == undefined) return this.currentDir.list.walkNodeFromHeadNormal();
        if(argument1 == "-r"){
            //absolute path
            if(this.isAbsolute(argument2)){
                return this.displayLsOutputAbsoluteAndRelativePath(argument2, allPath, this.root, true, false);                
            }
            //current path
            else if(allPath.length == 1){
                return this.currentDir.list.walkNodeFromTailNormal();
            }
            //relateiv path
            else{
                return this.displayLsOutputAbsoluteAndRelativePath(argument2, allPath, this.currentDir, true, false);                
            }
        }
        if(argument1 == "-a"){
            //absolute path
            if(this.isAbsolute(argument2)){
                return this.displayLsOutputAbsoluteAndRelativePath(argument2, allPath, this.root, false, true);
            }
            //current path
            else if(allPath.length == 1){
                return this.currentDir.list.walkNodeFromHeadSecret();
            }
            //relateiv path
            else{
                return this.displayLsOutputAbsoluteAndRelativePath(argument2, allPath, this.currentDir, false, true);                
            }
        }

        //no option
        //absolute path
        if(this.isAbsolute(argument1)){
            return this.displayLsOutputAbsoluteAndRelativePath(argument1, allPath, this.root, false, false);                
        }
        //current path
        else if(allPath.length == 1){
            let target = this.currentDir.list.findNode(argument1);
            if(target == null) return `Invalid file name`;
            else if(target.name == argument1 && target.type == "dir"){
                let walkList = target.list;
                return walkList.walkNodeFromHeadNormal();
            } 
            else if(target.name == argument1 && target.type == "file"){
                return `${argument1}`;
            } 
        }
        //relative path
        else{
            return this.displayLsOutputAbsoluteAndRelativePath(argument1, allPath, this.currentDir, false, false);                
        }
    }

    cd(argument){
        let pathList = argument.split("/").filter(dirName=>dirName!='');
        //help
        if(argument == "--help"){
            return Help.outputHelp("cd");
        }

        if(argument == ".."){
            if(this.currentDir.parent == null) return;
            else{
                this.currentDir = this.currentDir.parent;
                return `Change directory`
            }
        }
        //absolute path
        else if(this.isAbsolute(argument)){
            if(this.searchDirectoryPath(this.root, pathList) == null){
                return `no such file or directory: ${argument}`;
            }
            this.currentDir = this.searchDirectoryPath(this.root, pathList);
            return `Change directory: "${argument}"`
        }

        //current path
        else if(pathList.length == 1){
            let target = this.currentDir.list.findNode(argument);
            if(target == null) return `Invalid argument`;
            else if(target.type == "dir"){
                this.currentDir = this.currentDir.list.findNode(argument);
                return `Change directory: "${argument}"`
            }
            else if(target.type == "file"){
                return `not a directory: ${target.name}`;
            }
            else console.log("Unexpected error: filesystem cd");
        }
        //relative path
        else{
            if(this.searchDirectoryPath(this.currentDir, pathList) == null){
                return `no such file or directory: ${argument}`;
            }
            this.currentDir = this.searchDirectoryPath(this.currentDir, pathList);
            return `Change directory: "${argument}"`
        }
    }

    pwd(argument){
        //help
        if(argument == "--help"){
            return Help.outputHelp("pwd");
        }
        else if(argument != undefined){
            return `Invalid argument`
        }
        else{
            let current = this.currentDir;
            let path = "";
            while(current.parent != null){
                path = current.name + '/' + path;
                current = current.parent;
            }
            return '/' + path;
        }
    }

    print(argument){
        let pathList = argument.split("/").filter(dirName=>dirName!='');
        //help
        if(argument == "--help"){
            return Help.outputHelp("print");
        }
        //absolute path
        if(this.isAbsolute(argument)){
            if(this.searchDirectoryPath(this.root, pathList) == null){
                return `no such file or directory: ${argument}`;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.root, pathList);
                if(searchDir.type == "dir") return `This is a directory`
                else if(searchDir.data == null) return `File: "${argument}" No data`;
                else return `${searchDir.data}`
            }
        }
        //current path
        else if(pathList.length == 1){
            let target = this.currentDir.list.findNode(argument);
            if(target == null) return `Invalid file name`;
            if(target.type == "dir") return `This is a directory`
            else if(target.data == null) return `File: "${argument}" No data`;
            else return `${target.data}`    
        }
        //relative path
        else{
            if(this.searchDirectoryPath(this.currentDir, pathList) == null){
                return `no such file or directory: ${argument}`;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.currentDir, pathList);
                if(searchDir.type == "dir") return `This is a directory`
                else if(searchDir.data == null) return `File: "${argument}" No data`;
                else return `${searchDir.data}`
            }

        }

    }
    
    setContent(argument, data){
        let allPath = argument.split("/").filter(dirName=>dirName!='');
        let fileName = allPath[allPath.length-1];
        let filePath = allPath.length == 1 ? allPath : allPath.slice(0, allPath.length-1);
        //help
        if(argument == "--help"){
            return Help.outputHelp("setContent");
        }
        //absolute path
        if(this.isAbsolute(argument)){
            if(this.searchDirectoryPath(this.root, filePath) == null){
                return `no such file or directory: ${argument}`;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.root, filePath);
                let target = searchDir.list.findNode(fileName);
                if(target.type == "dir") return `This is a directory`
                else{
                    target.data = data;
                    return `File: ${target.name}, data "${data}" added`;        
                }
            }
        }
        //current path
        else if(filePath.length == 1){
            let target = this.currentDir.list.findNode(argument);
            if(target == null) return `Invalid file name`;
            if(target.type == "dir") return `This is a directory`
            else{
                target.data = data;
                return `File: ${target.name}, data "${data}" added`;    
            } 
        }
        //relative path
        else{
            if(this.searchDirectoryPath(this.currentDir, filePath) == null){
                return `no such file or directory: ${argument}`;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.currentDir, filePath);
                let target = searchDir.list.findNode(fileName);
                if(target.type == "dir") return `This is a directory`
                else{
                    target.data = data;
                    return `File: ${target.name}, data "${data}" added`;                            
                }
            }
        }
    }

    rm(argument1, argument2){
        //help
        if(argument1 == "--help"){
            return Help.outputHelp("rm");
        }

        if(argument1 == "-i"){
            this.rmConfirm = true;
            this.rmArgument = argument2
            return `are you sure? yes/no`  
        }
        if(argument1 == "no"){
            return `rm cancel`
        }
        let allPath = this.rmConfirm ? this.rmArgument.split("/").filter(dirName=>dirName!='') : argument1.split("/").filter(dirName=>dirName!='');
        let fileName = allPath[allPath.length-1];
        let filePath = allPath.length == 1 ? allPath : allPath.slice(0, allPath.length-1);

        //absolute path
        if(this.isAbsolute(filePath[0])){
            if(this.searchDirectoryPath(this.root, filePath) == null){
                return `no such file or directory: ${argument}`;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.root, filePath);
                let target = searchDir.list.findNode(fileName);
                if(target == null) return `No such file or directory`;
                else{
                    let type = target.type.charAt(0).toUpperCase() + target.type.slice(1);
                    searchDir.list.deleteNode(target);
                    return `${type}: "${target.name}" deleted`
                }   
            }
        }
        //current path
        else if(filePath.length == 1){
            let target = this.currentDir.list.findNode(argument1);
            let type = target.type.charAt(0).toUpperCase() + target.type.slice(1);
            if(target == null) return `No such file or directory`;
            else{
                this.currentDir.list.deleteNode(target);
                return `${type}: "${target.name}" deleted`
            }   
        }
        //relative path
        else{
            if(this.searchDirectoryPath(this.currentDir, filePath) == null){
                return `no such file or directory: ${argument}`;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.currentDir, filePath);
                let target = searchDir.list.findNode(fileName);
                if(target == null) return `No such file or directory`;
                else{
                    let type = target.type.charAt(0).toUpperCase() + target.type.slice(1);
                    searchDir.list.deleteNode(target);
                    return `${type}: "${target.name}" deleted`
                }   
            }

        }
    }

    mv(argument1, argument2){
        let allPath1 = argument1.split("/").filter(dirName=>dirName!='');
        let fileName1 = allPath1[allPath1.length-1];
        let filePath1 = allPath1.length == 1 ? allPath1 : allPath1.slice(0, allPath1.length-1);
        //help
        if(argument1 == "--help"){
            return Help.outputHelp("mv");
        }

        
        //absolute path
        if(this.isAbsolute(argument1)){
            if(this.searchDirectoryPath(this.root, filePath1) == null){
                return `No such file or directory`;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.root, filePath1);
                let target = searchDir.list.findNode(fileName1);
                if(target == null) return `No such file or directory`;
                else{
                    if(this.mvAndCpSecondArgumentValid(argument2)){
                        return this.excuteMoveNode(argument1, argument2, searchDir, target);
                    }
                    else return `No such file or directory`;
                }
            }

        }
        //current path => change file name
        else if(allPath1.length == 1){
            let source = this.currentDir.list.findNode(argument1);
            let destination = this.currentDir.list.findNode(argument2)
            if(source == null) return `No such file or directory`;
            else if(destination != null) return `${argument2} already exists`
            else{
                source.name = argument2;
                return `Rename ${argument1} to ${argument2}`;
            }   
        }
        //relative path
        else{
            if(this.searchDirectoryPath(this.currentDir, filePath1) == null){
                return `No such file or directory`;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.currentDir, filePath1);
                let target = searchDir.list.findNode(fileName1);
                if(target == null) return `No such file or directory`;
                else{
                    if(this.mvAndCpSecondArgumentValid(argument2)){
                        return this.excuteMoveNode(argument1, argument2, searchDir, target);
                    }
                    else return `No such file or directory`;
                }
            }
        }      
    }

    excuteMoveNode(argument1 ,argument2, searchDir, target){
        let allPath = argument2.split("/").filter(dirName=>dirName!='');
        let filePath = allPath.length == 1 ? allPath : allPath.slice(0, allPath.length-1);
        let movePath = this.searchDirectoryPath(this.root, filePath);
        target.parent = movePath;
        movePath.list.enqueueBack(target);
        searchDir.list.deleteNode(target);
        return `Move ${argument1} to ${argument2}`;
    }


    cp(argument1, argument2){
        let allPath1 = argument1.split("/").filter(dirName=>dirName!='');
        let fileName1 = allPath1[allPath1.length-1];
        let filePath1 = allPath1.length == 1 ? allPath1 : allPath1.slice(0, allPath1.length-1);
        //help
        if(argument1 == "--help"){
            return Help.outputHelp("cp");
        }
        
        //absolute path
        if(this.isAbsolute(argument1)){
            if(this.searchDirectoryPath(this.root, filePath1) == null){
                return `No such file or directory`;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.root, filePath1);
                let target = searchDir.list.findNode(fileName1);
                if(target == null) return `No such file or directory`;
                else{
                    if(this.mvAndCpSecondArgumentValid(argument2)){
                        return this.excuteCopyNode(argument1, argument2, target);
                    }
                    else return `No such file or directory`;
                }
            }

        }
        //current path => change file name
        else if(allPath1.length == 1){
            return `Unable to copy in the same directory`;
        }
        //relative path
        else{
            if(this.searchDirectoryPath(this.currentDir, filePath1) == null){
                return `No such file or directory`;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.currentDir, filePath1);
                let target = searchDir.list.findNode(fileName1);
                if(target == null) return `No such file or directory`;
                else{
                    if(this.mvAndCpSecondArgumentValid(argument2)){
                        return this.excuteCopyNode(argument1, argument2, target);
                    }
                    else return `No such file or directory`;
                }
            }
        }
    }

    excuteCopyNode(argument1 ,argument2, target){
        let allPath = argument2.split("/").filter(dirName=>dirName!='');
        let filePath = allPath.length == 1 ? allPath : allPath.slice(0, allPath.length-1);
        let movePath = this.searchDirectoryPath(this.root, filePath);

        let copyNode = target.copyNode(movePath)
        movePath.list.enqueueBack(copyNode);
        return `Copy ${argument1} to ${argument2}`;
    }

    mvAndCpSecondArgumentValid(argument){
        let allPath = argument.split("/").filter(dirName=>dirName!='');
        let fileName = allPath[allPath.length-1];
        let filePath = allPath.length == 1 ? allPath : allPath.slice(0, allPath.length-1);

        if(argument == "/") return true;
        //absolute path
        if(this.isAbsolute(argument)){
            if(this.searchDirectoryPath(this.root, filePath) == null){
                return false;
            }
            else if(allPath.length == 1){
                let target = this.root.list.findNode(fileName);
                return target != null;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.root, filePath);
                let target = searchDir.list.findNode(fileName);
                return target != null;
            }
        }
        //current path
        else if(allPath.length == 1){
            let target = this.currentDir.list.findNode(argument);
            return target != null;          
        }
        //relative path
        else{
            if(this.searchDirectoryPath(this.currentDir, filePath) == null){
                return false;
            }
            else{
                let searchDir = this.searchDirectoryPath(this.currentDir, filePath);
                let target = searchDir.list.findNode(fileName);
                return target != null;
            }
        }    
    }

    isAbsolute(argument){
        return (argument[0] == '/');
    }

    /*
        SearchDirectoryPath
        change the argument path to list and search each directry
        If one of the paths does not match in the directory, return null. If all of the paths match in the directory, return directory on the last path.
    */
    searchDirectoryPath(directory, pathList){
    let iterator = directory;
    for(let i = 0; i < pathList.length; i++){
        let target = iterator.list.findNode(pathList[i])
        if(target == null) return null;
        iterator = target;
        }
    return iterator;
    }
}



class Controller
{

    static commandLineParser(CLIInputString)
    {
        let parsedStringInputArray = CLIInputString.trim().split(" ");
        return parsedStringInputArray;
    }

    static parsedArrayValidator(filesystem, parsedStringInputArray)
    {
        // First, check rules that applies all commands.
        let validatorResponse = Controller.universalValidator(filesystem, parsedStringInputArray);
        if (!validatorResponse['isValid']) return validatorResponse;

        // Second check after inputs passes the first validator,   
        let parsedStringInputArrayLength = parsedStringInputArray.length;
        // Check the command without arguments.
        if(parsedStringInputArrayLength == 1){
            validatorResponse = Controller.commandArgumentsValidator(filesystem, parsedStringInputArray);
            if (!validatorResponse['isValid']) return validatorResponse;
        }
        // Check the command with arguments.
        else{
            validatorResponse = Controller.commandArgumentsValidator(filesystem, parsedStringInputArray);
            if (!validatorResponse['isValid']) return validatorResponse;
        }
        return {'isValid': true, 'errorMessage':''}
    }

    /*
        universalValidator
        input: StringArray parsedStringInputArray 
        return {'isValid': <Boolean>, 'errorMessage': <String>}   

            - input must start with [touch, mkdir, ls, cd, pwd, print, setcontent, rm]
            - command line inputs must be within 2 elements
    */
    static universalValidator(filesystem, parsedStringInputArray)
    {
        let validCommandList = ["touch", "mkdir", "ls", "cd", "pwd", "print", "setContent", "rm", "mv", "cp"];        
        if (!filesystem.rmConfirm && parsedStringInputArray.length >= 4){
            return {'isValid': false, 'errorMessage': `Invalid arguments`};
        }
        if (!filesystem.rmConfirm && validCommandList.indexOf(parsedStringInputArray[0]) == -1){
            return {'isValid': false, 'errorMessage': `Only supports the following commands: ${validCommandList.join(",")}`};
        }
        /*
        if(validCommandList.indexOf(argsArray[0]) == -1){
            return {'isValid': false, 'errorMessage': `command not found: ${commandName}`};
        }*/
        return {'isValid': true, 'errorMessage': ''}
    }
    /*
        commandArgumentsValidator
        input: StringArray parsedStringInputArray 
        return {'isValid': <Boolean>, 'errorMessage': <String>}
        
        Check the number of arguments according to the commands and call validator.
    */
    static commandArgumentsValidator(filesystem, commandArgsArray)
    {
        let argsArray = commandArgsArray.slice(1,2);

        if (filesystem.rmConfirm || commandArgsArray[0] == "pwd" || commandArgsArray[0] == "ls"){
            return Controller.noArgValidator(filesystem, commandArgsArray[0]);
        }
        else{
            return Controller.singleArgValidator(commandArgsArray[0], argsArray);
        }
    }

    //The command has been validated, so this should return only 'isValid':true.
    static noArgValidator(filesystem, commandName){
        if(!filesystem.rmConfirm && commandName != "pwd" && commandName != "ls") return {'isValid': false, 'errorMessage': `command not found: ${commandName}`}
        else if(filesystem.rmConfirm && commandName != "yes" && commandName != "no"){
            filesystem.rmConfirm = false;
            return {'isValid': false, 'errorMessage': `only allowed 'yes' or 'no'`}
        }
        return {'isValid': true, 'errorMessage': ''};
    }

    /*
        singleArgValidator
        - only allows one argument
        - check supports arguments.
    */
    static singleArgValidator(commandName, argsArray){
        let validCommandList = ["touch", "mkdir", "ls", "cd", "print", "setContent", "rm", "mv", "cp"];
        if(validCommandList.indexOf(commandName) == -1)
            return {'isValid': false, 'errorMessage': `command not found: ${commandName}`}

        return {'isValid': true, 'errorMessage': ''}
    }


    static appendEchoParagraph(parentDiv, filesystem)
    {
        parentDiv.innerHTML+=
            `<p class="m-0">
                <span style='color:green'>root</span>
                <span style='color:magenta'>@</span>
                <span style='color:blue'>recursionist</span>
                ${filesystem.pwd()}: ${CLITextInput.value}
            </p>`;

        return;
    }
    static appendResultParagraph(parentDiv, isValid, message)
    {
        let promptName = "";
        let promptColor = "";
        if (isValid){
            promptName = "FileSystem";
            promptColor = "turquoise";
        }
        else{
            promptName = "FileSystemError";
            promptColor = "red";
        }
        parentDiv.innerHTML+=
                `<p class="m-0">
                    : ${message}
                </p>`;
        return;
    }

    static evaluatedResultsStringFromParsedCLIArray(filesystem, PCA){
        let result = "";

        switch(PCA[0]){
            case "touch":
                result = filesystem.touch(PCA[1]);
                break;
            case "mkdir":
                result = filesystem.mkdir(PCA[1]);
                break;
            case "ls":
                result = filesystem.ls(PCA[1], PCA[2]);
                break;
            case "cd":
                result = filesystem.cd(PCA[1]);
                break;
            case "pwd":
                result = filesystem.pwd(PCA[1]);
                break;
            case "print":
                result = filesystem.print(PCA[1]);
                break;
            case "setContent":
                result = filesystem.setContent(PCA[1], PCA[2]);
                break;
            case "rm":
                result = filesystem.rm(PCA[1], PCA[2]);
                break;
            case "yes":
                result = filesystem.rm(PCA[0]);
                filesystem.rmConfirm = false;
                break
            case "no":
                result = filesystem.rm(PCA[0]);
                filesystem.rmConfirm = false;
                break;
            case "mv":
                result = filesystem.mv(PCA[1], PCA[2]);
                break;
            case "cp":
                result = filesystem.cp(PCA[1], PCA[2]);
                break;    
            default:
                console.log("invalid command name");                
        }

        return result;
    }
}

class Help{
    static outputHelp(command){
        switch(command){
            case "touch":
                return `Usage: touch FILE...<br>
                &nbsp Update the access and modification times of each FILE to the current time.
                A FILE argument that does not exist is created empty.`
            case "mkdir":
                return `Usage: mkdir DIRECTORY...<br>
                &nbsp Create the DIRECTORY, if they do not already exist.`
            case "ls":
                return `Usage: ls [OPTION]... [FILE]...<br>
                &nbsp List information about the FILEs (the current directory by default).<br>
                &nbsp OPTION<br>
                &nbsp -a            &nbsp do not ignore entries starting with .<br>
                &nbsp -r             &nbsp reverse order while sorting`
            case "cd":
                return `Usage: cd [dir]<br>
                &nbsp Change the shell working directory.<br>
                &nbsp Change the current directory to DIR.  The default DIR is the value of the
                HOME shell variable.`
            
            case "pwd":
                return `Usage: pwd<br>
                &nbsp Print the name of the current working directory.`
            
            case "print":
                return `Usage: print FILE<br>
                &nbsp Print out file data.`
            case "setContent":
                return `Usage: setContent FILE<br>
                &nbsp Set data to FILE.`
            case "rm":
                return `Usage: rm [OPTION]... [FILE]...<br>
                &nbsp Remove (unlink) the FILE(s).<br>
                &nbsp -i                  &nbsp prompt before every removal`
            case "mv":
                return `Usage: SOURCE DEST<br>
                &nbsp or:  mv [OPTION]... SOURCE... DIRECTORY<br>
                &nbsp move SOURCE(s) to DIRECTORY.`
            case "cp":
                return `Usage: cp SOURCE DEST<br>
                &nbsp Copy SOURCE to DEST.`

        }
    }
}

const config = {
    CLIOutputDivID: "CLIOutputDiv",
    CLITextInputID: "CLITextInput",
}

let CLITextInput = document.getElementById(config.CLITextInputID);
let CLIOutputDiv = document.getElementById(config.CLIOutputDivID);
let filesystem = new FileSystem();
let history = new HistoryStack();
let tempLog = [];
let count = 0;

CLITextInput.addEventListener("keyup", (event)=>submitSearch(filesystem, event, history));

function submitSearch(filesystem, event, history){
    if (event.key =="Enter"){
        if(CLITextInput.value != ''){
            let parsedCLIArray = Controller.commandLineParser(CLITextInput.value);
            if(parsedCLIArray.length != 0) history.push(CLITextInput.value);
            Controller.appendEchoParagraph(CLIOutputDiv, filesystem);
            CLITextInput.value = '';
            
            let validatorResponse = Controller.parsedArrayValidator(filesystem, parsedCLIArray);
            if(validatorResponse['isValid'] == false) Controller.appendResultParagraph(CLIOutputDiv, false, validatorResponse['errorMessage']);

            else Controller.appendResultParagraph(CLIOutputDiv, true, Controller.evaluatedResultsStringFromParsedCLIArray(filesystem, parsedCLIArray));
            CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;
        }
        else{
            Controller.appendEchoParagraph(CLIOutputDiv, filesystem);
            CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;
        }
    }
    else if(event.key == "ArrowUp"){
        let iterator = history.head;
        if(iterator != null){
            CLITextInput.value = iterator.data;
            if(history.head.next != null){
                tempLog.push(history.pop());
                count++;
            }
        }
    }
    else if(event.key == "ArrowDown"){
        if(tempLog.length != 0) history.push(tempLog.pop())
        let iterator = history.head;
        if(iterator != null){
            if(count != 0){
                CLITextInput.value = iterator.data;
                count--;
            }
            else CLITextInput.value = '';
        }

    }
}

