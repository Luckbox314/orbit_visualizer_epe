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
        for (let i = 0; i < this.canvas.height * this.canvas.width /  STAR_DENCIETY; i++) {
            this.stars.push(new Star());
        }
    }
    
}

class Star {
    private x: number;
    private y: number;
    private size: number;
    private color: string;
    constructor() {
        // generate star
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = 1 + Math.random() * 1;
        this.color = random_item(colors) as string;
    }

    public draw(ctx: CanvasRenderingContext2D) {
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
