version ="1.5.3";
document.write("<title>CubeOS</title><meta name='apple-mobile-web-app-status-bar-style' content='black'><meta name='apple-mobile-web-app-capable' content='yes'><body style='color: #0f0; font-family: monospace; background-color: black;'>CubeOS Version <b>"+version+"</b><br/><span id='path'></span><input type='text' id='input' style='background-color: black; color: #0f0; font-family: monospace;'/><!--<button onclick='execute()' style='border: 1px solid #0f0; background-color: black; color: #0f0; font-family: monospace;'>Run</button>--><br/><br><div id='output'></div></body>");
fileSystem = {"MAIN":{"password.key":"1337"}, "MSG":""}
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter'&&document.getElementById('editor')==null) {
    let params = document.getElementById("input").value.split("&");
    execute(params);
  }
});

const searchParams = new URLSearchParams(window.location.search);
if (searchParams.has('command')) {
  
  execute(searchParams.get('command').split("/"));
  

} 
else {
  log("Welcome! Type HELP or ABOUT for more help.")
}


path = document.getElementById("path");
path.innerHTML = "(MAIN)/ $"
realPath = ["(MAIN)/"]


function execute(params) {
  
  switch (params[0].toLowerCase()) {
    case "format": {
      log("Formatting "+params[1]+"...");
      break;
    }
    case "run": {
      if(params[1].endsWith(".js")){
        log(eval(fileSystem["MAIN"][params[1]]));
        break;
      }
      else {
        error("Not a .js file");
        break;
      }
    }
    case "pm": {
      if (params[1] === "remove") {
        if (params[2] === "internet") {
          log("Removing internet...");
          setTimeout(function() {
            error("Network connection not found. Rebooting...");
            setTimeout(function() {location.reload()}, 3000);
          }, 5000);
        }
      
        else {
          error("Package not found");
        }
      }

      else if (params[1] === "install") {
          error("You cannot install any packages yet.");
      }
      else {
        error("Invalid option")
      }
      break;
   }


   case "edit": {
      if (params[1].endsWith('.int')){
        error("Not available for .int files");
        break;
      }


      log("<div id='editorLog'>Use ° to save<br><textarea id='editor' style='background-color: black; color: #0f0; font-family: monospace; height: 20em; width: 100%; border: 1px solid #0f0; border-radius: 0;'>"+fileSystem["MAIN"][params[1]]+"</textarea></div>");
      document.getElementById('editor').addEventListener('keydown', function(event){
        if (event.key === "°") {
          fileSystem["MAIN"][params[1]] = document.getElementById('editor').value;
          document.getElementById('editorLog').innerHTML = "Edited "+params[1];
        }
      
      });
      break;
    }
    case "sysinfo": {
      txt = "CubeOS Version "+version+"<br><br>Client information<br>------------------"
      txt += "<p>Browser CodeName: " + navigator.appCodeName + "</p>";
      txt+= "<p>Browser Name: " + navigator.appName + "</p>";
      txt+= "<p>Browser Version: " + navigator.appVersion + "</p>";
      txt+= "<p>Cookies Enabled: " + navigator.cookieEnabled + "</p>";
      txt+= "<p>Platform: " + navigator.platform + "</p>";
      txt+= "<p>User-agent header: " + navigator.userAgent + "</p>";
      log(txt);
      break;
    }
    case "cd": {
        error("Out of order")
        break;
        let targetPath = params[1];
        let fullPath = targetPath.split('.'); 
        let currentDir = fileSystem["MAIN"];

        for (let i = 0; i < fullPath.length; i++) {
          if (fullPath[i] === "..") {
            currentDir = fileSystem["MAIN"];
            realPath.pop(); // Go up one directory
            for (let j = 0; j < realPath.length; j++) {
              currentDir = currentDir[realPath[j]];
            }
          } else {
            if(currentDir[fullPath[i]] && currentDir[fullPath[i]].hasOwnProperty('.dir')) {
              currentDir = currentDir[fullPath[i]];
              realPath.push(fullPath[i]);
            } else {
              error("Directory does not exist");
              return;
            }
          }
        }

        path.innerHTML = "(" + realPath.join("/") + ")/ $"; // update the path
        break;
      }
    case "view": {

      log(fileSystem["MAIN"][params[1]].replace("<", "&lt;").replace(">", "&gt;").replace("\n","<br>"));
      break;
    }
    case "rm": {
      delete fileSystem["MAIN"][params[1]];
      log("Deleted "+params[1]);
      break;
    }
    case "create": {
      if(params[1].endsWith(".int")) {
        fileSystem["MAIN"][params[1]] = 0;
        log("Created "+params[1]);
        break;
      }
      fileSystem["MAIN"][params[1]] = "";
      log("Created "+params[1]);
      break;
    }
    case "easteregg": {
      if(params[1] === "1337"){
        log("Easteregg!");
      }
    
      else {
        error("Wrong password");
      }
      break;
    }
    case "shutdown": {
      log("Shutting down...");
      setTimeout(function() {document.documentElement.innerHTML="CubeOS was shut down."}, 1000);
      break;
    }
    case "write": {
      if(params[2].endsWith(".int")) {
        error("Cannot write text to .int file. Use INT command.");
        break;
      }
      switch(params[1]) {
        case "a": {
          fileSystem["MAIN"][params[2]] += params[3];
          break;
        }
        case "w": {
          fileSystem["MAIN"][params[2]] = params[3];
          break;
        }
        default: {
          error("Invalid write mode");
          return;
        }
      }
      log("Wrote to "+params[2]);
      break;
    }
    case "int": { // INT mode file number
      if(params[2].endsWith(".int")) {
        if(!Number.isInteger(Number(params[3]))) {
          error("Not a number");
          break;
        }
        switch(params[1]) {
          case "+": {
            fileSystem["MAIN"][params[2]]+=parseInt(params[3]);
            log("Increased "+params[2]+" by "+params[3]);
            break;
          }
          case "-": {
            fileSystem["MAIN"][params[2]]-=parseInt(params[3]);
            log("Decreased "+params[2]+" by "+params[3]);
            break;
          }
          case "set": {
            fileSystem["MAIN"][params[2]]=parseInt(params[3]);
            log("Set "+params[2]+" to "+params[3]);
            break;
          }
          default: {
            error("Invalid mode")
          }
        }
        break;
      }
      else {
        error("Not a .int file. Use WRITE command.");
        break;
      }
    }
    case "fs": {
      switch(params[1]) {
        case "save": {
          localStorage.setItem("cubeOSfs"+params[2], JSON.stringify(fileSystem));
          log("Saved file system "+params[2])
          break;
        }
        case "load": {
          fileSystem = JSON.parse(localStorage.getItem("cubeOSfs"+params[2]));
          log("Loaded file system "+params[2]+"<br><b>"+fileSystem["MSG"])+"</b>";
          
          break;
        }
        case "view": {
          log(JSON.stringify(fileSystem));
          break;
        }
        default: {
          error("Invalid option");
        }
      }
      break;
    }
    case "reboot": {
      log("Rebooting...")
      setTimeout(function() {
        location.reload()
      }, 2000);
      break;
    }
    case "msg": {
      switch(params[1]) {
        case "set": {
          fileSystem["MSG"] = params[2];
          log("Set message");
          break;
        }
        case "clear": {
          fileSystem["MSG"] = "";
          log("Cleared message");
          break;
        }
        case "view": {
          log(fileSystem["MSG"]);
          break;
        }
        default: {
          error("Invalid option")
        }
      }
      break;
    }
    case "browse": {
      window.location.href=params[1];
      log("<iframe src='"+params[1]+"'></iframe>");  
      break;
    }
    case "ls": {
      text="<table>"
      for(let i in fileSystem["MAIN"]){
        text+="<tr><td>"+i+"</td><td>"+fileSystem["MAIN"][i].length+"</td></tr>"
      }
      text+="</table>"
      log(text);
      break;
    }
    case "echo": {
      log(params[1]);
      break;
    }
    case "exec": {
      log(eval(params[1]));
      break;
    }
    case "color": {
      switch(params[1]) {
        case "a": {
          document.body.style.color = "#0f0";
          document.getElementById("input").style.color = "#0f0";
          break;
        }
        case "b": {
          document.body.style.color = "#f00";
          document.getElementById("input").style.color = "red";
          break;
        }
        case "f": {
          document.body.style.color = "white";
          document.getElementById("input").style.color = "white";
          break;
        }
        default: {
          error("Invalid option");
        }
      }
      break;
    }
    case "cls": {
      document.getElementById("output").innerHTML = "";
      break;
    }
    case "about": {
      log("Welcome to CubeOS!<br>This is a computer simuation. You can create files with CREATE, edit them with WRITE, delete them with RM or view them with VIEW. You can also save the file system in localStorage with the FS command.<br>For more help use HELP or HELP command.<br><br>Here are some special features of CubeOS:<br>- You seperate command parameters with & (e.g. echo&Hello World!)<br>- There are .int files that can only store integers. To edit them use the INT command.<br>- CubeOS doesn't have directories.<br>- You can create .js files and execute them with RUN<br><br>100% made with JavaScript.")
      break;
    }
    case "help": {
      if(params.length == 1) {
      log("Available commands:<br>- ECHO text<br>- FORMAT drive<br>- HELP<br>- HELP command<br>- EXEC jscode<br>- LS<br>- SHUTDOWN<br>- EASTEREGG<br>- CREATE filename<br>- WRITE { A | W } file text<br>- FS { LOAD | SAVE } id<br>- FS VIEW<br>- MSG SET message<br>- MSG { CLEAR | VIEW }<br>- RM filename<br>- SYSINFO<br>- RUN jsfile<br>- COLOR color<br>- REBOOT<br>- INT { + | - | SET } file number<br>- CLS-<br>- EDIT file<br>- PM { INSTALL | REMOVE } package<br><br>Seperate parameters with &");
      }
      else {
        log(helps[params[1].toLowerCase()]);
      }
      break;
    }
    default: {
      error("Unknown command: "+params[0])
    }

  }
  document.getElementById("input").value = ""
}
function log(text) {
  document.getElementById("output").innerHTML = text+"<br/>-----<br>"+ document.getElementById("output").innerHTML;
}
function error(text) {
  log("<div style='color: #f00;'>Error: "+text+"</div>")
}
function warn(text) {
  log("<div style='color: #ff0;'>Warning: "+text+"</div>");
}

const helps = {"echo":"Usage: ECHO text<br>Outputs <i>text</i>",
               "format":"Usage: FORMAT drive<br>Formats <i>drive</i>",
               "help":"Usage: HELP command, HELP<br>Lists all available commands or shows help to <i>command</i> if given",
               "exec":"Usage: EXEC jscode<br>Executes <i>jscode</i>",
               "ls":"Usage: LS<br>Shows all files",
               "shutdown":"Usage: SHUTDOWN<br>Shuts down CubeOS",
               "easteregg":"You have to find that out by yourself! ;-)",
               "create":"Usage: CREATE filename<br>Creates the file <i>filename</i> in (MAIN)/",
               "write":"Usage: WRITE A filename text<br>WRITE W file text<br>Writes <i>text</i> into <i>filename</i>. If mode is W, file content gets overrided. Not supported for .int files."
               
              }

