export class Stroke {

    constructor({ctx,color,size}) {
        this.ctx = ctx;
        this.color = color;
        this.points = [];
        this.size = size;

    }
    addPoint(aPoint){
        this.points.push(aPoint);
    }
    draw(){ //deve impostare che il colore sia quella definito
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.beginPath();
        if(this.points.length > 1){
            this.ctx.moveTo(this.points[0].x,this.points[0].y);
            for(let i = 1; i< this.points.length; i++)
                this.ctx.lineTo(this.points[i].x,this.points[i].y)
        }
        this.ctx.stroke();
    }
}