
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('main-chart');
    const ctx = canvas.getContext('2d');
    const themeSelect = document.getElementById('theme-select');
    const chartBtns = document.querySelectorAll('.chart-btn');
    const entryAnim = document.getElementById('entry-anim');
    const updateAnim = document.getElementById('update-anim');
    const hoverAnim = document.getElementById('hover-anim');
    
    // Set canvas size
    function resizeCanvas() {
        const container = document.querySelector('.chart-container');
        canvas.width = container.clientWidth - 40;
        canvas.height = container.clientHeight - 40;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Sample data
    const sampleData = {
        line: [
            {x: 0, y: 20},
            {x: 1, y: 35},
            {x: 2, y: 25},
            {x: 3, y: 45},
            {x: 4, y: 30},
            {x: 5, y: 50}
        ],
        bar: [
            {category: 'Jan', value: 30},
            {category: 'Feb', value: 45},
            {category: 'Mar', value: 25},
            {category: 'Apr', value: 60},
            {category: 'May', value: 40}
        ],
        pie: [
            {label: 'Red', value: 30, color: '#ff6384'},
            {label: 'Blue', value: 20, color: '#36a2eb'},
            {label: 'Yellow', value: 15, color: '#ffce56'},
            {label: 'Green', value: 35, color: '#4bc0c0'}
        ],
        scatter: [
            {x: 10, y: 20, size: 8},
            {x: 15, y: 35, size: 12},
            {x: 25, y: 15, size: 6},
            {x: 30, y: 45, size: 10},
            {x: 40, y: 30, size: 14},
            {x: 45, y: 50, size: 8}
        ]
    };
    
    let currentChartType = 'line';
    
    // Theme change handler
    themeSelect.addEventListener('change', function() {
        document.body.className = this.value + '-theme';
        drawChart();
    });
    
    // Chart type change handler
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentChartType = this.dataset.type;
            drawChart();
        });
    });
    
    // Draw chart based on current type
    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        switch(currentChartType) {
            case 'line':
                drawLineChart();
                break;
            case 'bar':
                drawBarChart();
                break;
            case 'pie':
                drawPieChart();
                break;
            case 'scatter':
                drawScatterChart();
                break;
        }
    }
    
    function drawLineChart() {
        const data = sampleData.line;
        const padding = 40;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;
        
        // Draw axes
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
        ctx.lineWidth = 2;
        
        // X axis
        ctx.beginPath();
        ctx.moveTo(padding, height + padding);
        ctx.lineTo(width + padding, height + padding);
        ctx.stroke();
        
        // Y axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height + padding);
        ctx.stroke();
        
        // Calculate scales
        const xScale = width / (data.length - 1);
        const yMax = Math.max(...data.map(d => d.y));
        const yScale = height / yMax;
        
        // Draw line
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--primary-color');
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((point, i) => {
            const x = padding + i * xScale;
            const y = padding + height - point.y * yScale;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--secondary-color');
        data.forEach((point, i) => {
            const x = padding + i * xScale;
            const y = padding + height - point.y * yScale;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    function drawBarChart() {
        const data = sampleData.bar;
        const padding = 40;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;
        const barWidth = width / data.length * 0.7;
        const gap = width / data.length * 0.3;
        
        // Draw axes
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
        ctx.lineWidth = 2;
        
        // X axis
        ctx.beginPath();
        ctx.moveTo(padding, height + padding);
        ctx.lineTo(width + padding, height + padding);
        ctx.stroke();
        
        // Y axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height + padding);
        ctx.stroke();
        
        // Calculate scale
        const yMax = Math.max(...data.map(d => d.value));
        const yScale = height / yMax;
        
        // Draw bars
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary-color');
        
        data.forEach((item, i) => {
            const x = padding + i * (barWidth + gap);
            const barHeight = item.value * yScale;
            
            ctx.fillRect(x, height + padding - barHeight, barWidth, barHeight);
            
            // Draw label
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
            ctx.textAlign = 'center';
            ctx.fillText(item.category, x + barWidth/2, height + padding + 20);
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary-color');
        });
    }
    
    function drawPieChart() {
        const data = sampleData.pie;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.4;
        let startAngle = 0;
        
        // Calculate total value
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        // Draw pie slices
        data.forEach(item => {
            const sliceAngle = (item.value / total) * Math.PI * 2;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            
            ctx.fillStyle = item.color;
            ctx.fill();
            
            startAngle += sliceAngle;
        });
        
        // Draw center circle for donut effect
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
        ctx.closePath();
        
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--panel-bg');
        ctx.fill();
    }
    
    function drawScatterChart() {
        const data = sampleData.scatter;
        const padding = 40;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;
        
        // Draw axes
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
        ctx.lineWidth = 2;
        
        // X axis
        ctx.beginPath();
        ctx.moveTo(padding, height + padding);
        ctx.lineTo(width + padding, height + padding);
        ctx.stroke();
        
        // Y axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height + padding);
        ctx.stroke();
        
        // Calculate scales
        const xMax = Math.max(...data.map(d => d.x));
        const yMax = Math.max(...data.map(d => d.y));
        const xScale = width / xMax;
        const yScale = height / yMax;
        
        // Draw points
        data.forEach(point => {
            const x = padding + point.x * xScale;
            const y = padding + height - point.y * yScale;
            
            ctx.beginPath();
            ctx.arc(x, y, point.size, 0, Math.PI * 2);
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--secondary-color');
            ctx.fill();
        });
    }
    
    // Initial draw
    drawChart();
});
