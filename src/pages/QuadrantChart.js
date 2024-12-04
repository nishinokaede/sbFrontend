import React, {useState, useRef, useEffect} from "react";
import {Button, Select, Splitter, Table} from "antd";

const HOST_NAME = 'https://api.densu.xyz';

const QuadrantChart = () => {
    const canvasRef = useRef(null);
    const [selected, setSelected] = useState("石榴");
    const [data, setData] = useState();

    const handleChange = (value) => {
        setSelected(value);
    };
    const [score, setScore] = useState({
        x: 0,
        y: 0,
        coordinates: {x: 0, y: 0},
        clickCoords: {x: 0, y: 0}, // 用来保存点击位置
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
            coordinates: {x: coordinateX, y: coordinateY},
            clickCoords: {x, y}, // 存储点击位置
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
            ctx.fillStyle = "black";
            ctx.fill();

            // 绘制从点击位置到X轴的线
            ctx.beginPath();
            ctx.moveTo(score.clickCoords.x, score.clickCoords.y);
            ctx.lineTo(score.clickCoords.x, midY);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();

            // 绘制从点击位置到Y轴的线
            ctx.beginPath();
            ctx.moveTo(score.clickCoords.x, score.clickCoords.y);
            ctx.lineTo(midX, score.clickCoords.y);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }, [score]);

    const [average, setAverage] = useState({name: "", x: 0, y: 0});

    useEffect(() => {
        console.log("Fetching data for:", selected); // Debugging
        // 获取后端数据并渲染平均值
        fetch(HOST_NAME + "/api/submissions")
            .then((response) => response.json())
            .then((data) => {
                setData(data.data);
                console.log(data.data);
                const userData = data.data.find((user) => user.name === selected);
                if (userData) {
                    setAverage({
                        x: userData.average_x,
                        y: userData.average_y,
                        name: userData.name,
                    });
                }
            })
            .catch((error) => {
                console.error("Failed to fetch submissions:", error);
            });
    }, [selected]);

    return (
        <>
            <Splitter style={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                <Splitter.Panel defaultSize="40%" min="20%" max="70%">
                    <div>
                        <Select
                            defaultValue="石榴"
                            style={{width: 120}}
                            onChange={handleChange}
                            options={[
                                {value: "石榴", label: "石榴"},
                                {value: "岳岳", label: "岳岳"},
                                {value: "糖糖", label: "糖糖"},
                                {value: "出生", label: "出生"},
                                {value: "柯基", label: "柯基"},
                                {value: "圆圆", label: "圆圆"},
                                {value: "鸽子", label: "鸽子"},
                                {value: "米神", label: "米神"},
                                {value: "赵哥", label: "赵哥"},
                                {value: "路易", label: "路易"},
                                {value: "zoo", label: "zoo"},
                                {value: "獭子", label: "獭子"},
                                {value: "陀螺", label: "陀螺"},
                                {value: "李叔叔", label: "李叔叔"},
                                {value: "橘子", label: "橘子"},
                                {value: "小康", label: "小康"},
                            ]}
                        />
                        <h1>
                            {average.name}的分数是
                            {average.x > 0 ? "地偶吃" : "坂狗"}
                            {Math.abs(average.x).toFixed(2)}
                            {average.y > 0 ? "傻逼" : "坂狗"}
                            {Math.abs(average.y).toFixed(2)}
                        </h1>
                        <h1>请选择{selected}的傻逼四象限</h1>
                        <Button
                            type={"primary"}
                            onClick={() => {
                                fetch(HOST_NAME + "/api/score", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        name: selected,
                                        score: {
                                            quadrantX: score.x,
                                            quadrantY: score.y,
                                            coordinates: score.coordinates,
                                        },
                                    }),
                                })
                                    .then((response) => response.json())
                                    .then((data) => {
                                        console.log(data);
                                        if (data.average) {
                                            setAverage({x: data.average.x, y: data.average.y, name: selected});
                                        }
                                    })
                                    .catch((error) => {
                                        console.error("Failed to fetch submissions:", error);
                                    });
                            }}
                        >
                            提交
                        </Button>
                        <br/>
                        <div>
                            <h2>
                                您给{selected}评价的 {score.x}{Math.abs(score.coordinates.x)}分, {score.y}{" "}
                                {Math.abs(score.coordinates.y)}分
                            </h2>
                        </div>
                        <div
                            style={{
                                border: "3px solid black",
                                height: "500px",
                                width: "500px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <canvas
                                ref={canvasRef}
                                width={500}
                                height={500}
                                onClick={handleCanvasClick}
                            />
                        </div>
                    </div>
                </Splitter.Panel>
                <Splitter.Panel>
                    <Table
                        dataSource={data}
                        columns={[
                            {
                                title: '群友',
                                dataIndex: 'name',
                                width: '20%',
                                key: 'name',
                            }, {
                                title: '地偶吃程度',
                                dataIndex: 'average_x',
                                sorter: (a, b) => a.average_x - b.average_x,
                                key: 'average_x',
                                render: (num) => parseFloat(num.toFixed(2)),
                            }, {
                                title: 'sb程度',
                                key: 'sb',
                                dataIndex: 'average_y',
                                render: (num) => parseFloat(num.toFixed(2)),
                                sorter: (a, b) => a.average_y - b.average_y,
                            },
                        ]}
                    />
                </Splitter.Panel>
            </Splitter>
        </>

    );
};

export default QuadrantChart;
