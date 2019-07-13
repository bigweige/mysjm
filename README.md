# mysjm
自己写的“围住神经猫”的小游戏，浏览器打开MyCat.html即可运行。

# 游戏说明：
1. 游戏初始化时神经猫处于最中间，位置为绿色，随机产生的围墙为橙色。
没有被围住的区域为灰色，游戏就是点击灰色区域产生围墙（灰色变橙色），
从而把神经猫包围在围墙中，若围墙包围不了神经猫，则神经猫逃走。
2. 神经猫处于能逃跑状态时为绿色，神经猫被包围时（处于一个圈内）时为红色。
3. 神经猫每次逃跑的方向都是从当前位置找最短路径的方向。
4. 画布采用EaselJS。
5. 以后有时间时会考虑像真实的神经猫游戏那样为神经猫加上动画效果。
