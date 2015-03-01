"use strict";

require("babel/register");

["l-system"].map(function(file) {
    return "./" + file;
}).forEach(require);
