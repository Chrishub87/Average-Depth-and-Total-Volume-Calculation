// Global state for total area
let currentTotalArea = 0;
let areaCount = 0;

function addArea() {
    const areasContainer = document.getElementById('areas');
    const index = areaCount++;
    const areaDiv = document.createElement('div');
    areaDiv.className = 'area';
    const label = String.fromCharCode(65 + index); // A, B, C ...
    areaDiv.innerHTML = `
        <h2>Area ${label}</h2>
        <table>
            <tr>
                <td><label>Length (m):</label></td>
                <td><input type="number" class="lengthInput"></td>
            </tr>
            <tr>
                <td><label>Width (m):</label></td>
                <td><input type="number" class="widthInput"></td>
            </tr>
            <tr>
                <td><p>Area:</p></td>
                <td><span class="areaValue">0</span> m<sup>2</sup></td>
            </tr>
        </table>
    `;
    areasContainer.appendChild(areaDiv);

    const lengthInput = areaDiv.querySelector('.lengthInput');
    const widthInput = areaDiv.querySelector('.widthInput');
    lengthInput.addEventListener('input', calculate);
    widthInput.addEventListener('input', calculate);
}

function calculate() {
    currentTotalArea = 0;
    const areaDivs = document.querySelectorAll('#areas .area');
    areaDivs.forEach(div => {
        const length = parseFloat(div.querySelector('.lengthInput').value) || 0;
        const width = parseFloat(div.querySelector('.widthInput').value) || 0;
        const area = length * width;
        div.querySelector('.areaValue').textContent = area.toFixed(2);
        currentTotalArea += area;
    });
    document.getElementById('totalArea').textContent = currentTotalArea.toFixed(2);
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

    averageDepthOutput.innerHTML = (averageDepthMeters * 1000).toFixed(2) + ' mm';

    const totalVolume = currentTotalArea * averageDepthMeters;
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

// Premium handling
function applyPremium() {
    document.querySelectorAll('.ad-slot').forEach(el => el.style.display = 'none');
    const addAreaBtn = document.getElementById('addArea');
    addAreaBtn.style.display = 'block';
}

function checkPremium() {
    if (localStorage.getItem('premium') === 'true') {
        applyPremium();
    }
}

async function buyPremium() {
    if (window.Stripe) {
        const stripe = Stripe('pk_test_replace_with_key');
        try {
            const { error } = await stripe.redirectToCheckout({
                lineItems: [{ price: 'price_replace_with_id', quantity: 1 }],
                mode: 'payment',
                successUrl: window.location.href + '?success=true',
                cancelUrl: window.location.href
            });
            if (error) {
                console.error(error);
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        // Fallback for environments without Stripe
        simulatePremiumPurchase();
    }
}

function simulatePremiumPurchase() {
    localStorage.setItem('premium', 'true');
    applyPremium();
}

function init() {
    // check success from Stripe redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
        simulatePremiumPurchase();
    }

    checkPremium();

    addArea(); // initial area

    document.getElementById('buyConcreasy').addEventListener('click', buyPremium);
    document.getElementById('addArea').addEventListener('click', addArea);
    document.getElementById('generateDips').addEventListener('click', generateDips);
    document.getElementById('unitSelect').addEventListener('change', generateDips);
    document.getElementById('minDepthInput').addEventListener('input', generateDips);
    document.getElementById('maxDepthInput').addEventListener('input', generateDips);
}

window.addEventListener('DOMContentLoaded', init);
