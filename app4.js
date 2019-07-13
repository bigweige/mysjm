/**
 * Created by wgw on 2015/3/16.
 */
/*完全自己的想法实现*/
var stage =new createjs.Stage("gameView");
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick",stage);

var gameView=new createjs.Container();
stage.addChild(gameView);
gameView.x=30;
gameView.y=30;
/*数组定义方法*/
var circleArr=[[],[],[],[],[],[],[],[],[],[],[]];
var maze=[
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, -1, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ]
];
var currentCat;

function getMoveDir(cat){

}
function circleClicked(event){
    if(event.target.getCircleType()==Circle.TYPE_UNSELECTED){

    }
    if(currentCat.indexX==0||currentCat.indexX==8||currentCat.indexY==0||currentCat.indexY==8){
        alert("游戏结束！");
        return ;
    }

}
//left upleft upright right downright downleft shunshizhen
var moveDirectionOdd=[[-1,0],[-1,-1],[0,-1],[1,0],[0,1],[-1,1]];
var moveDirectionEven=[[-1,0],[0,-1],[1,-1],[1,0],[1,1],[0,1]];
var moveDirectionOdd2=[[1,0],[1,1],[0,1],[-1,0],[0,-1],[1,-1]];
var moveDirectionEven2=[[1,0],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]];
//sx sy ex ey 是坐标系中的坐标，而不是数组中哪一行哪一列
function findPath(maze, sx, sy,ex,ey) {
    var cells=createMaze(maze); // 创建化迷宫
    var q=[]; // 构造队列
    var startCell = cells[sx][sy]; // 起点
    var endCell = cells[ex][ey]; // 终点
    if(!isValidWayCell(endCell)){
        alert(" end 非法");
        return;
    }
    q.push(startCell); // 入队
    startCell.c=8;
    while (q.length>0) {
        var  current = q.shift();
        if (current == endCell) { // 路径找到
            var x=current.x;
            var y=current.y;
            var cellPath=[];
            var direction=current.c;
            //当direction不是起点时
            while (direction!=8) {
                cellPath.push(current);
                var d=direction-2;
                if(y%2==0){
                    x=x+moveDirectionOdd2[d][0];
                    y=y+moveDirectionOdd2[d][1];
                }
                else{
                    x=x+moveDirectionEven2[d][0];
                    y=y+moveDirectionEven2[d][1];
                }
                current=cells[x][y];
                direction=current.c;
            }
            cellPath.push(startCell);
            return cellPath;
        } else { // 如果当前位置不是终点
            for(var i=0;i<6;i++){
                var x=0;
                var y=0;
                if(current.y%2==0){
                     x=current.x+moveDirectionEven[i][0];
                     y=current.y+moveDirectionEven[i][1];
                }
                else{
                     x=current.x+moveDirectionOdd[i][0];
                     y=current.y+moveDirectionOdd[i][1];
                }
                if(isValidWayCell(cells[x][y])){
                    q.push(cells[x][y]);
                    cells[x][y].c=i+2;
                }
            }
        }// end of if
    }// end of while
    return null;
}

function isValidWayCell(cell) {
    //还要判断是否越界
    return cell.c == 0;
}

function createMaze(maze) {
    var cells=[[],[],[],[],[],[],[],[],[],[],[]];
    for (var x = 0; x < 11; x++) {
        for (var y = 0; y < 11; y++)
            cells[x][y] = new Cell(x, y, maze[x][y]);
    }
    return cells;
}
function addCircles(){
    for(var indexY=1;indexY<10;indexY++){
        for(var indexX=1;indexX<10;indexX++){
            var c=new Circle();
            gameView.addChild(c);
            circleArr[indexX][indexY]=c;
            c.indexX=indexX;
            c.indexY=indexY;
            c.x=((indexY-1)%2) ?(indexX-1)*55+25:(indexX-1)*55;
            c.y=(indexY-1)*55;
            //c.setCircleType(maze[indexY][indexX]);
            if(indexX==5&&indexY==5){
                c.setCircleType(Circle.TYPE_CAT);
                currentCat=c;
            }
            else if(Math.random()<0.1){
                c.setCircleType(Circle.TYPE_SELECTED);
                maze[c.indexY][c.indexX]=1;
            }
            c.addEventListener("click",circleClicked);
        }
    }
    var cellPath=findPath(maze,5,5,1,1);
    if(cellPath==null){
        alert("kong");
    }
    else{
        alert(cellPath.length);
        for(var i=0;i<cellPath.length;i++){
            circleArr[cellPath[i].x][cellPath[i].y].setCircleType(-2);
        }
    }

}
addCircles();
