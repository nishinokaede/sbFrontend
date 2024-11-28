import React, { useState, useRef, useEffect } from "react";
import {Select} from "antd";

const QuadrantChart = () => {
    const canvasRef = useRef(null);
    const [selceted, setSelceted] = useState(null);
    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setSelceted(value)
    };
    const [score, setScore] = useState({
        x: 0,
        y: 0,
        coordinates: { x: 0, y: 0 },
        clickCoords: { x: 0, y: 0 } // 用来保存点击位置
    });

    // 绘制四象限图，包括坐标轴和之前的红点
    const drawChart = (ctx) => {
        const canvas = canvasRef.current;
        const width = canvas.width;
        const height = canvas.height;
        const midX = width / 2;
        const midY = height / 2;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 画四象限线
        ctx.beginPath();
        ctx.moveTo(midX, 0);
        ctx.lineTo(midX, height); // Y轴
        ctx.moveTo(0, midY);
        ctx.lineTo(width, midY); // X轴
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 画坐标轴刻度
        ctx.font = "12px Arial";
        ctx.fillText("0", midX + 5, midY - 5); // 原点
        for (let i = 1; i <= 5; i++) {
            // X轴正方向
            ctx.fillText(i * 10, midX + i * 40, midY - 5);
            // X轴负方向
            ctx.fillText(-i * 10, midX - i * 40, midY - 5);
            // Y轴正方向
            ctx.fillText(i * 10, midX + 5, midY - i * 40);
            // Y轴负方向
            ctx.fillText(-i * 10, midX + 5, midY + i * 40);
        }

        // 画四个区域的标签
        ctx.font = "20px Arial";
        ctx.fillText("坂狗", 20, midY / 2);
        ctx.fillText("地偶吃", width - 60, midY / 2);
        ctx.fillText("聪明", midX - 60, height - 20);
        ctx.fillText("sb", midX - 30, 20);
    };

    // 处理点击事件
    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = canvas.width / 2;
        const midY = canvas.height / 2;

        // 根据点击位置计算评分四象限
        const quadrantX = x < midX ? "坂狗" : "地偶吃";
        const quadrantY = y < midY ? "sb" : "聪明";

        // 计算点击位置的坐标
        const coordinateX = (x - midX) / 40 * 10; // 每40px代表10单位
        const coordinateY = (midY - y) / 40 * 10; // 每40px代表10单位

        // 更新前端状态
        setScore({
            x: quadrantX,
            y: quadrantY,
            coordinates: { x: coordinateX, y: coordinateY },
            clickCoords: { x, y } // 存储点击位置
        });

        // 将坐标信息发送到后端
        fetch("http://localhost:8000/api/score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                score: {
                    quadrantX,
                    quadrantY,
                    coordinates: { x: coordinateX, y: coordinateY }
                },
            }),
        });
    };

    // 每次渲染后重新绘制图表，并加上红点和轴线
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // 先绘制图表
        drawChart(ctx);

        // 如果有点击，绘制红点和轴线
        if (score.clickCoords.x !== 0 && score.clickCoords.y !== 0) {
            const midX = canvas.width / 2;
            const midY = canvas.height / 2;

            // 绘制红点
            ctx.beginPath();
            ctx.arc(score.clickCoords.x, score.clickCoords.y, 5, 0, 2 * Math.PI); // 半径5的圆
            ctx.fillStyle = "red";
            ctx.fill();

            // 绘制从点击位置到X轴的线
            ctx.beginPath();
            ctx.moveTo(score.clickCoords.x, score.clickCoords.y);
            ctx.lineTo(score.clickCoords.x, midY);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();

            // 绘制从点击位置到Y轴的线
            ctx.beginPath();
            ctx.moveTo(score.clickCoords.x, score.clickCoords.y);
            ctx.lineTo(midX, score.clickCoords.y);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }, [score]);

    return (
        <div>
            <Select
                defaultValue="lucy"
                style={{ width: 120 }}
                onChange={handleChange}
                options={[
                    { value: 'jack', label: 'Jack' },
                    { value: 'lucy', label: 'Lucy' },
                    { value: 'Yiminghe', label: 'yiminghe' },
                    { value: 'disabled', label: 'Disabled', disabled: true },
                ]}
            />
            <h1>
                请选择{selceted}的傻逼四象限
            </h1>
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                onClick={handleCanvasClick}
            />
            <div>
                <h3>选中的四象限和坐标:</h3>
                <p>水平: {score.x}</p>
                <p>垂直: {score.y}</p>
                <p>坐标: (x: {score.coordinates.x}, y: {score.coordinates.y})</p>
            </div>
        </div>
    );
};

export default QuadrantChart;
