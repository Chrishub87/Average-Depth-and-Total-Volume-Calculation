function calculate() {
    const lengthInput = document.getElementById("lengthInput");
    const widthInput = document.getElementById("widthInput");

    const lengthMetres = parseFloat(lengthInput.value) || 0;
    const widthMetres = parseFloat(widthInput.value) || 0;

    const areaMetres = lengthMetres * widthMetres;

    const areaOutput = document.getElementById("area");
    areaOutput.innerHTML = areaMetres.toFixed(2);

    calculateTotalVolume();
}

function generateDips() {
    const unit = document.getElementById('unitSelect').value;
    const minDepth = parseFloat(document.getElementById('minDepthInput').value);
    const maxDepth = parseFloat(document.getElementById('maxDepthInput').value);

    if (isNaN(minDepth) || isNaN(maxDepth) || minDepth > maxDepth) {
        return;
    }

    const depthTable = document.getElementById('depthTable');
    depthTable.querySelectorAll('.depthRow').forEach(row => row.remove());

    const step = 5; // step between dips in selected units
    const unitToMeters = { mm: 0.001, cm: 0.01, in: 0.0254 };

    for (let depth = minDepth; depth <= maxDepth; depth += step) {
        const depthMeters = depth * unitToMeters[unit];
        const row = document.createElement('tr');
        row.className = 'depthRow';
        row.dataset.depthMeters = depthMeters;

        const depthCell = document.createElement('td');
        depthCell.textContent = depth + ' ' + unit;
        row.appendChild(depthCell);

        const countCell = document.createElement('td');
        countCell.className = 'depthValue';
        countCell.textContent = '0';
        row.appendChild(countCell);

        const plusCell = document.createElement('td');
        const plusButton = document.createElement('button');
        plusButton.className = 'plusButton';
        plusButton.textContent = '+';
        plusButton.addEventListener('click', () => changeDepth(plusButton, 1));
        plusCell.appendChild(plusButton);
        row.appendChild(plusCell);

        const minusCell = document.createElement('td');
        const minusButton = document.createElement('button');
        minusButton.className = 'minusButton';
        minusButton.textContent = '-';
        minusButton.addEventListener('click', () => changeDepth(minusButton, -1));
        minusCell.appendChild(minusButton);
        row.appendChild(minusCell);

        depthTable.appendChild(row);
    }

    calculateTotalVolume();
}

function calculateTotalVolume() {
    const depthRows = document.querySelectorAll('.depthRow');
    let totalDepth = 0; // in meters
    let depthCount = 0;

    depthRows.forEach(row => {
        const depthMeters = parseFloat(row.dataset.depthMeters);
        const count = parseFloat(row.querySelector('.depthValue').textContent);
        if (!isNaN(depthMeters) && !isNaN(count)) {
            totalDepth += depthMeters * count;
            depthCount += count;
        }
    });

    const averageDepthMeters = depthCount ? totalDepth / depthCount : 0;

    const averageDepthOutput = document.getElementById('averageDepth');
    const totalVolumeOutput = document.getElementById('totalVolume');
    const areaOutput = document.getElementById('area');

    averageDepthOutput.innerHTML = (averageDepthMeters * 1000).toFixed(2) + ' mm';

    const totalArea = parseFloat(areaOutput.innerHTML);
    const totalVolume = totalArea * averageDepthMeters;
    totalVolumeOutput.innerHTML = totalVolume.toFixed(2);
}

function changeDepth(button, increment) {
    const depthSpan = button.parentElement.parentElement.children[1];
    let current = parseFloat(depthSpan.textContent);
    if (!isNaN(current)) {
        current += increment;
        if (current < 0) current = 0;
        depthSpan.textContent = current.toFixed(0);
        calculateTotalVolume();
    }
}

calculate();

document.getElementById('lengthInput').addEventListener('input', calculate);
document.getElementById('widthInput').addEventListener('input', calculate);
document.getElementById('generateDips').addEventListener('click', generateDips);
document.getElementById('unitSelect').addEventListener('change', generateDips);
document.getElementById('minDepthInput').addEventListener('input', generateDips);
document.getElementById('maxDepthInput').addEventListener('input', generateDips);
