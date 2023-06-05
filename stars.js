var STAR_DENCIETY = 2000; // 1 star per 1000 square pixels
var colors = ["#8d2eff", "#feb148", , "#1facfc", "#ffffff"];
var StarDrawer = /** @class */ (function () {
    function StarDrawer() {
        this.stars = [];
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = "-1";
        this.drawStars();
    }
    StarDrawer.prototype.drawStars = function () {
        var _this = this;
        this.generateStars();
        this.stars.forEach(function (star) {
            star.draw(_this.ctx);
        });
    };
    StarDrawer.prototype.resize = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.stars = [];
        this.drawStars();
    };
    StarDrawer.prototype.generateStars = function () {
        var outCanvas = document.getElementById("canvas");
        for (var i = 0; i < this.canvas.height * this.canvas.width / STAR_DENCIETY; i++) {
            var position = { x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height };
            var size = 0.5 + 3 * Math.pow(Math.random(), 6);
            var color = random_item(colors);
            // this.exclusionZoneFilter(position, size, color,  outCanvas)
            this.stars.push(new Star(position, size, color));
        }
    };
    StarDrawer.prototype.exclusionZoneFilter = function (position, size, color, targetCanvas) {
        if (size < 3 && color !== "#ffffff") {
            return;
        }
        // delete big stars from exclusion zone
        var dimentions = targetCanvas.getBoundingClientRect();
        // draw exclusion zone for debug
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.rect(dimentions.x, dimentions.y, dimentions.width, dimentions.height);
        this.ctx.stroke();
        if (position.x > dimentions.x && position.x < dimentions.x + dimentions.width && position.y > dimentions.y && position.y < dimentions.y + dimentions.height) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#0000ff";
            this.ctx.rect(position.x - 20, position.y - 20, 40, 40);
            this.ctx.stroke();
        }
    };
    return StarDrawer;
}());
var Star = /** @class */ (function () {
    function Star(position, size, color) {
        // generate star
        this.x = position.x;
        this.y = position.y;
        this.size = size;
        this.color = color;
    }
    Star.prototype.draw = function (ctx) {
        var whiteFilter = 0.5001;
        if (this.color == "#ffffff" && this.size > whiteFilter) {
            this.color = random_item(colors.filter(function (e) { return e !== "#ffffff"; }));
        }
        if (this.color == "#ffffff") {
            this.drawStarShape(ctx);
        }
        else if (this.size > 3) {
            this.drawDoubleRing(ctx);
        }
        else {
            this.drawRing(ctx);
        }
    };
    Star.prototype.drawStarShape = function (ctx) {
        this.size = 10 + 8 * Math.pow(Math.random(), 16);
        ;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x - this.size / 2, this.y - this.size / 2, this.size / 2, 0 * Math.PI, 0.5 * Math.PI);
        ctx.arc(this.x - this.size / 2, this.y + this.size / 2, this.size / 2, 1.5 * Math.PI, 2 * Math.PI);
        ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, 1 * Math.PI, 1.5 * Math.PI);
        ctx.arc(this.x + this.size / 2, this.y - this.size / 2, this.size / 2, 0.5 * Math.PI, 1 * Math.PI);
        ctx.fill();
        ctx.stroke();
    };
    Star.prototype.drawDoubleRing = function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size * 1.8, 0, 2 * Math.PI);
        ctx.fill();
        if (this.color === "#ffffff") {
            ctx.fillStyle = "#feb148";
        }
        else {
            ctx.fillStyle = "#ffffff";
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    };
    Star.prototype.drawRing = function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    };
    return Star;
}());
var starDrawer = new StarDrawer();
var width = window.innerWidth;
window.onload = function () {
    starDrawer.resize();
};
window.onresize = function () {
    if (width == window.innerWidth)
        return;
    width = window.innerWidth;
    starDrawer.resize();
};
function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}
//# sourceMappingURL=stars.js.map