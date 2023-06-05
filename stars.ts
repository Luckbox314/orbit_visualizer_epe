const STAR_DENCIETY = 2000; // 1 star per 1000 square pixels

const colors = ["#8d2eff", "#feb148", , "#1facfc", "#ffffff"]

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
        const outCanvas = document.getElementById("canvas") as HTMLCanvasElement;

        for (let i = 0; i < this.canvas.height * this.canvas.width /  STAR_DENCIETY; i++) {
            const position = {x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height};
            const size = 0.5 + 3 * Math.random() ** 6;
            let  color = random_item(colors) as string
            // this.exclusionZoneFilter(position, size, color,  outCanvas)
            this.stars.push(new Star(position, size, color));
        }
    }

    private exclusionZoneFilter(position: {x: number, y: number}, size: number, color: string, targetCanvas : HTMLCanvasElement) {

        if (size < 3 && color !== "#ffffff") {
            return;
        }
        // delete big stars from exclusion zone
        const dimentions = targetCanvas.getBoundingClientRect() as DOMRect;
        
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
    }
    
}

class Star {
    private x: number;
    private y: number;
    private size: number;
    private color: string;
    constructor(position: {x: number, y: number}, size: number, color: string) {
        // generate star
        this.x = position.x;
        this.y = position.y;
        this.size = size
        this.color = color;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const whiteFilter = 0.5001;

        if (this.color == "#ffffff" && this.size > whiteFilter) {
            this.color = random_item(colors.filter(e => e !== "#ffffff")) as string;
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
    }

    private drawStarShape(ctx: CanvasRenderingContext2D) {
        this.size = 10 + 8 * Math.random() ** 16;;
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
        ctx.arc(this.x, this.y, this.size*1.8, 0, 2 * Math.PI);
        ctx.fill();

        if (this.color === "#ffffff") {
            ctx.fillStyle = "#feb148";
        } else {
            ctx.fillStyle = "#ffffff";
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    private drawRing(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
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
