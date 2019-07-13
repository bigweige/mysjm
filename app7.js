/**
 * Created by wgw on 2015/3/16.
 */
/*完全自己的想法实现*/
//相对于app5.js解决了点击最中间位置坐标不对的bug，即currentCat=circleArr[nextCatPosition.x][nextCatPosition.y];
//currentCat是重新赋值，而不是改变indexX，indexY。
var stage =new createjs.Stage("gameView");
createjs.Ticker.setFPS(60);
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
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1 ],
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ]
];
var currentCat;

function circleClicked(event){
    if(currentCat.indexX==1||currentCat.indexX==9||currentCat.indexY==1||currentCat.indexY==9){
        alert("游戏结束！请刷新页面重新开始！！");
        return ;
    }
    var clickedCircle=event.target;
    if(clickedCircle.getCircleType()==Circle.TYPE_UNSELECTED){
        //设circle type为已选择同时设maze为1
        clickedCircle.setCircleType(Circle.TYPE_SELECTED);
        maze[clickedCircle.indexX][clickedCircle.indexY]=1;
        //alert("clickecd"+clickedCircle.indexX+clickedCircle.indexY);
        var cellPath=getLowestCostAndDirection();
        //alert(cellPath.length);
        //若能找到一条最短路径
        if(cellPath!=null){
            var nextCatPosition=cellPath[cellPath.length-2];
            //alert("nextcat"+nextCatPosition.x+nextCatPosition.y);
            /*重置猫老位置和新位置的颜色*/
            circleArr[currentCat.indexX][currentCat.indexY].setCircleType(Circle.TYPE_UNSELECTED);
            maze[currentCat.indexX][currentCat.indexY]=0;

            currentCat=circleArr[nextCatPosition.x][nextCatPosition.y];
            currentCat.setCircleType(Circle.TYPE_CAT);
            maze[currentCat.indexX][currentCat.indexY]=-1;
        }
        else{
            //alert(cellPath);
            //alert(undefined!=null);  fasle
            //alert(undefined==null);  true
            //alert("被包围了");
            //对于六个方向，哪个方向能走就走
            //alert(clickedCircle.indexX+""+clickedCircle.indexY+maze[clickedCircle.indexX][clickedCircle.indexY]);
            var canRun=false;
            for(var i=0;i<6;i++){
                var x=0;
                var y=0;
                if(currentCat.indexY%2==0){
                    x=currentCat.indexX+moveDirectionEven[i][0];
                    y=currentCat.indexY+moveDirectionEven[i][1];
                }
                else{
                    x=currentCat.indexX+moveDirectionOdd[i][0];
                    y=currentCat.indexY+moveDirectionOdd[i][1];
                }
                //alert("x="+x+"y="+y);
                if(maze[x][y]==0){
                    /*重置猫老位置和新位置的颜色*/
                    circleArr[currentCat.indexX][currentCat.indexY].setCircleType(Circle.TYPE_UNSELECTED);
                    maze[currentCat.indexX][currentCat.indexY]=0;
                    currentCat=circleArr[x][y];
                    currentCat.setCircleType(Circle.TYPE_CAT_SURROUNDED);
                    maze[currentCat.indexX][currentCat.indexY]=-2;
                    //alert("chenggong x="+x+"y="+y);
                   canRun=true;
                    break;
                }
            }
            if(canRun==false){
                alert("你赢了，请刷新页面重新开始！");
            }
            //如果六个方向都不能走了，则输出恭喜您赢了。
        }
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

function getNoSelectedBorderCells(){
    var borderCells=[];
    var i=0;
    for(var x=1;x<=9;x++){
        if(maze[x][1]==0){
            borderCells[i]=new Cell(x,1,maze[x][1]);
            i++;
        }
    }
    for(var y=2;y<=9;y++){
        if(maze[9][y]==0){
            borderCells[i]=new Cell(9,y,maze[9][y]);
            i++;
        }
    }
    for(var x=8;x>=1;x--){
        if(maze[x][9]==0){
            borderCells[i]=new Cell(x,9,maze[x][9]);
            i++;
        }
    }
    for(var y=8;y>=2;y--){
        if(maze[1][y]==0){
            borderCells[i]=new Cell(1,y,maze[1][y]);
            i++;
        }
    }
    return borderCells;
}
function getLowestCostAndDirection(){
    var lowestCost=1000;
    var borderCells=getNoSelectedBorderCells();
    var shortestCellPath;
    var nextCell;
    for(var i=0;i<borderCells.length;i++){
        var cellPath=findPath(maze,currentCat.indexX,currentCat.indexY,borderCells[i].x,borderCells[i].y);
        if(cellPath!=null){
            if(cellPath.length<lowestCost){
                lowestCost=cellPath.length;
                nextCell=cellPath[cellPath.length-2];
                shortestCellPath=cellPath;
            }
        }
    }
    //return nextCell;
    return shortestCellPath;
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
                maze[5][5]=-1;
                currentCat=c;
            }
            else if(Math.random()<0.2){
                c.setCircleType(Circle.TYPE_SELECTED);
                maze[c.indexX][c.indexY]=1;
            }
            c.addEventListener("click",circleClicked);
        }
    }


}
addCircles();
