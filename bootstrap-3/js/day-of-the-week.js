function scheduleHighlight() {
    var d = new Date();
    var n = d.getDay();
    
    if (n === 1) {
        document.getElementById("schedule-this-monday").className = "panel panel-primary";
    }
    else if (n === 2) {
        document.getElementById("schedule-this-tuesday").className = "panel panel-primary";
    }
    else if (n === 3) {
        document.getElementById("schedule-this-wednesday").className = "panel panel-primary";
    } 
    else if (n === 4) {
        document.getElementById("schedule-this-thursday").className = "panel panel-primary";
    }
    else if (n === 5) {
       document.getElementById("schedule-this-friday").className = "panel panel-primary";
    }
    else {
    }
}
window.onload = scheduleHighlight;
