function calculate() {
    const lengthInput = document.getElementById("lengthInput");
    const widthInput = document.getElementById("widthInput");

    const lengthMetres = parseFloat(lengthInput.value);
    const widthMetres = parseFloat(widthInput.value);

    const areaMetres = lengthMetres * widthMetres;

    const areaOutput = document.getElementById("area");
    areaOutput.innerHTML = areaMetres.toFixed(2);

    calculateTotalVolume();
}

function calculateTotalVolume() {
    const depthRows = document.querySelectorAll(".depthRow");
    let totalDepth = 0;
    let depthCount = 0;

    for (let i = 0; i < depthRows.length; i++) {
        const depthInput = parseFloat(depthRows[i].children[1].textContent);
        if (!isNaN(depthInput)) {
            totalDepth += depthInput;
            depthCount++;
        }
    }

    const averageDepth = totalDepth / depthCount;

    console.log("Total Depth:", totalDepth);
    console.log("Depth Count:", depthCount);
    console.log("Average Depth:", averageDepth);

    const averageDepthOutput = document.getElementById("averageDepth");
    const totalVolumeOutput = document.getElementById("totalVolume");
    const areaOutput = document.getElementById("area");

    // Display the average depth in millimeters (mm)
    averageDepthOutput.innerHTML = (averageDepth * 1000).toFixed(2) + " mm";

    // Calculate and display the total volume in cubic meters (m³)
    const totalArea = parseFloat(areaOutput.innerHTML);
    const totalVolume = totalArea * (averageDepth * 0.1); // Convert averageDepth from mm to meters
    totalVolumeOutput.innerHTML = totalVolume.toFixed(2) + " m³";
}


function changeDepth(button, increment) {
    const depthSpan = button.parentElement.parentElement.children[1];
    let currentDepth = parseFloat(depthSpan.textContent);
    if (!isNaN(currentDepth)) {
        currentDepth += increment;
        if (currentDepth < 0) {
            currentDepth = 0;
        }
        depthSpan.textContent = currentDepth.toFixed(2);
        calculateTotalVolume();
    }
}

calculate();

document.getElementById("lengthInput").addEventListener("input", calculate);
document.getElementById("widthInput").addEventListener("input", calculate);
