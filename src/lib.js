
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

var genColorFromName = function (name){
    var hash = name.hashCode();
    var h = ((hash % 256 + 256) % 256) / 256.;
    var rgb = HSVtoRGB(h, 1, 1);

    return "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
};

var parseDistribution = function (txt){
    var name = txt.split("::")[0];
    var dists = txt.split("::")[1].split(";");
    var mu = [];
    var sig = {vec:[], eig:[]};
    for (var i=0; i < dists.length; i++){
        if (dists[i] === ""){
            continue;
        }
        mu.push(parseFloat(dists[i].split(':')[0]));
        var row = Array.apply(null, new Array(dists.length)).map(Number.prototype.valueOf, 0);
        row[i] = 1;
        sig.eig.push(Math.pow(parseFloat(dists[i].split(':')[1]), 2));
        sig.vec.push(row);
    }
    return {
        mu: mu,
        sig: sig,
        name: name,
        color: genColorFromName(name)
    };
};

var formatDistribution = function(track){
    var str = track.name + "::";
    for (var i=0; i < track.mu.length; i++){
        str += track.mu[i] + ':' + Math.sqrt(track.sig.eig[i]) + ';';
    }
    return str;
};

var formatAxis = function (axis){
    return axis.name + "::" + axis.min + "::" + axis.max;
}

var parseAxis = function (txt){
    var parts = txt.split('::');
    return {
        name: parts[0],
        min: parseFloat(parts[1]),
        max: parseFloat(parts[2])
    } 
};

module.exports = {
    genColorFromName: genColorFromName,
    parseDistribution: parseDistribution,
    parseAxis: parseAxis,
    formatDistribution: formatDistribution,
    formatAxis: formatAxis
};
