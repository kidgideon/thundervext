"use client";
import { useEffect, useRef, useState } from "react";
import "../styles/aichart.css";

const tradingTerms = [
  "Buy Signal",
  "Sell Signal",
  "Resistance Break",
  "Stop Loss",
  "Take Profit",
];

const Aichart = () => {
  const canvasRef = useRef(null);
  const [labels, setLabels] = useState([]);
  const data = useRef({
    profit: [],
    loss: [],
    blue: [],
    yellow: [],
    maxPoints: 50,
    profitVal: 100,
    lossVal: 40,
    blueVal: 80,
    yellowVal: 60,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    function resizeCanvas() {
      width = canvas.parentElement.offsetWidth;
      height = 300;
      canvas.width = width;
      canvas.height = height;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function generateNextValues() {
      // Profit line
      data.current.profitVal += Math.random() * 15 - 5;
      if (data.current.profitVal < 50) data.current.profitVal = 50;

      // Loss line
      data.current.lossVal += Math.random() * 10 - 3;
      if (data.current.lossVal < 10) data.current.lossVal = 10;

      // Blue line
      data.current.blueVal += Math.random() * 8 - 4;
      if (data.current.blueVal < 20) data.current.blueVal = 20;

      // Yellow line
      data.current.yellowVal += Math.random() * 5 - 2.5;
      if (data.current.yellowVal < 15) data.current.yellowVal = 15;

      // Push
      data.current.profit.push(data.current.profitVal);
      data.current.loss.push(data.current.lossVal);
      data.current.blue.push(data.current.blueVal);
      data.current.yellow.push(data.current.yellowVal);

      // Reset when full
      if (data.current.profit.length > data.current.maxPoints) {
        data.current.profit = [];
        data.current.loss = [];
        data.current.blue = [];
        data.current.yellow = [];
      }
    }

    function drawChart() {
      ctx.clearRect(0, 0, width, height);

      const margin = 40;
      const graphWidth = width - margin * 2;
      const graphHeight = height - margin * 2;

      const maxVal = Math.max(
        ...data.current.profit,
        ...data.current.loss,
        ...data.current.blue,
        ...data.current.yellow,
        150
      );
      const minVal = Math.min(
        ...data.current.profit,
        ...data.current.loss,
        ...data.current.blue,
        ...data.current.yellow,
        0
      );

      function scaleY(val) {
        return (
          margin +
          graphHeight -
          ((val - minVal) / (maxVal - minVal)) * graphHeight
        );
      }
      function scaleX(i) {
        return margin + (i / data.current.maxPoints) * graphWidth;
      }

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin, margin);
      ctx.lineTo(margin, height - margin);
      ctx.lineTo(width - margin, height - margin);
      ctx.stroke();

      // Y labels
      ctx.fillStyle = "#aaa";
      ctx.font = "10px monospace";
      for (let i = 0; i <= 5; i++) {
        const val = minVal + ((maxVal - minVal) / 5) * i;
        const y = scaleY(val);
        ctx.fillText(val.toFixed(0), 5, y + 3);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
      }

      // X labels
      for (let i = 0; i < data.current.maxPoints; i += 10) {
        const x = scaleX(i);
        ctx.fillText(`${i}s`, x, height - margin + 12);
      }

      // Draw line helper
      function drawLine(points, color) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        points.forEach((p, i) => {
          const x = scaleX(i);
          const y = scaleY(p);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      drawLine(data.current.profit, "#00ff55");
      drawLine(data.current.loss, "#ff3333");
      drawLine(data.current.blue, "#3399ff");
      drawLine(data.current.yellow, "#ffcc33");

      // === EVENT GENERATION ===
      const lastIndex = data.current.profit.length - 1;
      if (lastIndex > 0) {
        const x = scaleX(lastIndex);

        // Always generate one event at profit line (AI always active)
        const y = scaleY(data.current.profit[lastIndex]);
        setLabels((prev) => [
          ...prev.filter((l) => Date.now() - l.id < 4000),
          {
            x,
            y,
            term: tradingTerms[Math.floor(Math.random() * tradingTerms.length)],
            profitVal: `+$${(Math.random() * 3000 + 500).toFixed(0)}`,
            id: Date.now(),
          },
        ]);

        // Check for line collisions (extra labels if they meet)
        const lines = [
          { arr: data.current.profit },
          { arr: data.current.loss },
          { arr: data.current.blue },
          { arr: data.current.yellow },
        ];

        for (let i = 0; i < lines.length; i++) {
          for (let j = i + 1; j < lines.length; j++) {
            const diff = Math.abs(
              lines[i].arr[lastIndex] - lines[j].arr[lastIndex]
            );
            if (diff < 3) {
              const y2 = scaleY(lines[i].arr[lastIndex]);
              setLabels((prev) => [
                ...prev,
                {
                  x,
                  y: y2,
                  term: tradingTerms[Math.floor(Math.random() * tradingTerms.length)],
                  profitVal: `+$${(Math.random() * 3000 + 500).toFixed(0)}`,
                  id: Date.now() + Math.random(), // unique
                },
              ]);
            }
          }
        }
      }
    }

    const interval = setInterval(() => {
      generateNextValues();
      drawChart();
    }, 1200);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="chart-interface-x13">
      <canvas ref={canvasRef} className="chart-movement-x13"></canvas>

      {labels.map((label) => (
        <div
          key={label.id}
          className="floating-label"
          style={{
            left: label.x,
            top: label.y,
          }}
        >
          <div className="term">{label.term}</div>
          <div className="profit">{label.profitVal}</div>
        </div>
      ))}
    </div>
  );
};

export default Aichart;
