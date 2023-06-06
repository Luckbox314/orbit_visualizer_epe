const STAR_DENCIETY = 2000; // 1 star per 1000 square pixels

const colors = ["#8d2eff", "#feb148", , "#1facfc"]

class StarDrawer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private stars: Star[] = [];
    constructor() { 
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = "-1";
        this.drawStars();
    }

    public drawStars() {
        this.generateStars();
        this.stars.forEach(star => {
            star.draw(this.ctx);
        });
    }

    public resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.stars = [];
        this.drawStars();
    }

    private generateStars() {
        const outCanvas = document.getElementById("canvas") as HTMLElement;
        const parameters = document.getElementsByClassName("input-bar");
        const ancorTags = document.getElementsByTagName("a");

        for (let i = 0; i < this.canvas.height * this.canvas.width /  STAR_DENCIETY; i++) {
            const position = {x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height};
            // const size = 0.5 + 3 * (Math.random() ** 6);
            const size = 0.8 + 1/(100 * ((Math.random() + 0.01) ** 2));
            let  color = random_item(colors) as string

            const star = new Star(position, size, color);
            if (size > 9) {
                star.color = "#ffffff";
            }
            if (this.exclusionZoneFilter(star,  outCanvas)) {
                continue;
            }
            if (this.exclusionZoneFilter(star,  parameters, {x:-0.1, y:0}, {x:0, y: 20})) {
                continue;
            }

            if (this.exclusionZoneFilter(star,  ancorTags, {x:-0.5, y:-0.9}, {x:0, y: -8})) {
                continue;
            }

            this.stars.push(star);
        }
    }

    private exclusionZoneFilter(star: Star, targetElement : HTMLElement | HTMLCollection,  padding: {x: number, y:number} = {x:0.25, y:0.3}, offset: {x: number, y: number} = {x:0, y:0}) {
        if (targetElement instanceof HTMLCollection) {
            for (let i = 0; i < targetElement.length; i++) {
                if (this.exclusionZoneFilter(star, targetElement[i] as HTMLElement, padding, offset)) {
                    return true;
                }
            }
            return false;
        }
        if (star.size < 3 && star.color !== "#ffffff") {
            return;
        }
        // delete big stars from exclusion zone
        const dimentions = targetElement.getBoundingClientRect() as DOMRect;
        dimentions.x += offset.x;
        dimentions.y += offset.y;
        const computedPadding = {x: dimentions.width * padding.x, y: dimentions.height * padding.y};
        
        // draw exclusion zone for debug
        // this.ctx.beginPath();
        // this.ctx.strokeStyle = "#ff0000";
        // this.ctx.rect(dimentions.x + computedPadding.x, dimentions.y + computedPadding.y, dimentions.width - 2 * computedPadding.x, dimentions.height - 2 * computedPadding.y);
        // this.ctx.stroke();

        if (star.position.x > dimentions.x + computedPadding.x && 
            star.position.x < dimentions.x + dimentions.width - computedPadding.x &&
            star.position.y > dimentions.y + computedPadding.y &&
            star.position.y < dimentions.y + dimentions.height - computedPadding.y) {
            // this.ctx.beginPath();
            // this.ctx.strokeStyle = "#00ff00";
            // this.ctx.rect(star.position.x -10, star.position.y - 10, 20, 20);
            // this.ctx.stroke();
            return true;
        }
        return false;
    }
    
}

class Star {
    private x: number;
    private y: number;
    public size: number;
    public color: string;
    constructor(position: {x: number, y: number}, size: number, color: string) {
        // generate star
        this.x = position.x;
        this.y = position.y;
        this.size = size
        this.color = color;
    }

    public draw(ctx: CanvasRenderingContext2D) {      
        if (this.color == "#ffffff") {
            this.drawStarShape(ctx);
        }
        else if (this.size > 3) {
            this.drawDoubleRing(ctx);
        }
        else {
            this.drawRing(ctx);
        }
    }

    public get position() {
        return {x: this.x, y: this.y};
    }

    private drawStarShape(ctx: CanvasRenderingContext2D) {
        this.size = 15 + 8 * Math.random() ** 16;;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x - this.size/2, this.y - this.size/2, this.size/2, 0 * Math.PI, 0.5 * Math.PI);
        ctx.arc(this.x - this.size/2, this.y + this.size/2, this.size/2, 1.5* Math.PI, 2 * Math.PI);
        ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size/2, 1* Math.PI, 1.5 * Math.PI,);
        ctx.arc(this.x + this.size/2, this.y - this.size/2, this.size/2, 0.5* Math.PI, 1 * Math.PI,)
        ctx.fill();
        ctx.stroke();
    }

    private drawDoubleRing(ctx : CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();

        if (this.color === "#ffffff") {
            ctx.fillStyle = "#feb148";
        } else {
            ctx.fillStyle = "#ffffff";
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, 2 * Math.PI);
        ctx.fill();
    }

    private drawRing(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }


}

const starDrawer = new StarDrawer();
let width = window.innerWidth;

window.onload = () => {
    starDrawer.resize();
}

window.onresize = () => {
    if (width == window.innerWidth) return;
    width = window.innerWidth;
    starDrawer.resize()
}

function random_item(items)
{
return items[Math.floor(Math.random()*items.length)];    
}
