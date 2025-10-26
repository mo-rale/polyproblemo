//Global Variables and Constants
//---------------------------
//---------------------------
let currentOperation = 'add';
let lastInputs = { poly1: '', poly2: '' };

const quizQuestions = [
    // Addition questions
    { q: "What is (3x² + 2y) + (x² + 5y)?", choices: ["4x² + 7y", "3x² + x² + 10y", "2x² + 7y", "4x² + 5y"], answer: "4x² + 7y" },
    { q: "What is (5x² - 3y + 2) - (2x² + y - 4)?", choices: ["3x² - 4y + 6", "7x² - 4y + 6", "3x² - 2y - 2", "5x² - 2y + 6"], answer: "3x² - 4y + 6" },
    { q: "In polynomial addition, what do you combine?", choices: ["All terms", "Only constant terms", "Like terms", "Highest powers only"], answer: "Like terms" },
    { q: "Simplify: (2xy + 3z) + (4xy - z)", choices: ["6xy + 2z", "2xy + 2z", "6xy + z", "6xy"], answer: "6xy + 2z" },
    { q: "What is (x² + 2x + 1) + (3x² - x + 4)?", choices: ["4x² + x + 5", "2x² + x + 5", "4x² + 3x + 3", "4x² + x + 3"], answer: "4x² + x + 5" },
    { q: "Simplify: (7a - 3b) - (2a - 5b)", choices: ["5a + 2b", "9a - 8b", "5a - 8b", "5a + b"], answer: "5a + 2b" },
    
    // Multiplication questions
    { q: "What is (x + 2)(x + 3)?", choices: ["x² + 5x + 6", "x² + 6x + 5", "2x + 5", "x² + 6"], answer: "x² + 5x + 6" },
    { q: "Multiply: 3x(2x² - 4x + 1)", choices: ["6x³ - 12x² + 3x", "6x² - 12x + 3", "5x³ - x² + 3x", "6x³ - 4x + 1"], answer: "6x³ - 12x² + 3x" },
    { q: "What is (2x - 1)(3x + 4)?", choices: ["6x² + 5x - 4", "6x² + 8x - 3", "5x² + 5x - 4", "6x² + 5x + 4"], answer: "6x² + 5x - 4" },
    { q: "Simplify: (x + 4)²", choices: ["x² + 8x + 16", "x² + 4x + 16", "x² + 8x + 8", "x² + 16"], answer: "x² + 8x + 16" },
    
    // Division questions
    { q: "What is (x² + 5x + 6) ÷ (x + 2)?", choices: ["x + 3", "x + 2", "x + 4", "x - 3"], answer: "x + 3" },
    { q: "Divide: (6x³ - 12x² + 3x) ÷ 3x", choices: ["2x² - 4x + 1", "2x² - 12x + 3", "3x² - 4x + 1", "2x² - 4x + 3"], answer: "2x² - 4x + 1" },
    { q: "What is (x² - 9) ÷ (x - 3)?", choices: ["x + 3", "x - 3", "x + 9", "x - 9"], answer: "x + 3" },
    { q: "Simplify: (4x² - 16) ÷ (2x + 4)", choices: ["2x - 4", "2x + 4", "x - 2", "2x - 2"], answer: "2x - 4" }
];

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;

// Initialization & Navigation
//---------------------------
//---------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Set up operation buttons
    const opButtons = document.querySelectorAll('.op-btn');
    opButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            opButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentOperation = this.getAttribute('data-op');
            
            // If there are inputs and output is showing, update the steps
            const p1 = document.getElementById("poly1").value;
            const p2 = document.getElementById("poly2").value;
            const output = document.getElementById("output");
            
            if (p1 && p2 && output.classList.contains('show')) {
                showSteps();
            }
        });
    });
    
    // Initialize page to show home section
    goTo('home');
});

function goTo(page) {
    // Hide all sections first
    const sections = document.querySelectorAll('.section, .homepage');
    sections.forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });
    
    // Show the requested section
    const targetSection = document.getElementById(page);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 10);
    }
    
    // Reset output animation state
    const output = document.getElementById("output");
    if (output) {
        output.classList.remove("show");
    }
    
    if (page === "quiz") {
        // Reset quiz state
        currentQuestionIndex = 0;
        score = 0;
        loadQuiz();
    }
}

function goToMainSite() {
    window.location.href = '../index.html';
}

//UI & Display Functions
//---------------------------
//---------------------------
function clearOutput() {
    const output = document.getElementById("output");
    output.classList.remove("show");
}

function showStatement() {
    let statement = "";
    
    switch(currentOperation) {
        case "add":
            statement = `
                <h3>How to Solve Polynomial Addition:</h3>
                <div class="step"><span class="step-number">1</span><span class="step-content">Write both polynomials in standard form.</span></div>
                <div class="step"><span class="step-number">2</span><span class="step-content">Identify like terms (same variables and exponents).</span></div>
                <div class="step"><span class="step-number">3</span><span class="step-content">Add the coefficients of like terms.</span></div>
                <div class="step"><span class="step-number">4</span><span class="step-content">Write the result in standard form.</span></div>
            `;
            break;
            
        case "sub":
            statement = `
                <h3>How to Solve Polynomial Subtraction:</h3>
                <div class="step"><span class="step-number">1</span><span class="step-content">Write both polynomials in standard form.</span></div>
                <div class="step"><span class="step-number">2</span><span class="step-content">Distribute the negative sign to all terms in the second polynomial.</span></div>
                <div class="step"><span class="step-number">3</span><span class="step-content">Identify like terms (same variables and exponents).</span></div>
                <div class="step"><span class="step-number">4</span><span class="step-content">Add the coefficients of like terms.</span></div>
                <div class="step"><span class="step-number">5</span><span class="step-content">Write the result in standard form.</span></div>
            `;
            break;
            
        case "mult":
            statement = `
                <h3>How to Solve Polynomial Multiplication:</h3>
                <div class="step"><span class="step-number">1</span><span class="step-content">Multiply each term of the first polynomial by each term of the second.</span></div>
                <div class="step"><span class="step-number">2</span><span class="step-content">When multiplying variables, add their exponents.</span></div>
                <div class="step"><span class="step-number">3</span><span class="step-content">Combine like terms if any.</span></div>
                <div class="step"><span class="step-number">4</span><span class="step-content">Write the result in standard form.</span></div>
            `;
            break;
            
        case "div":
            statement = `
                <h3>How to Solve Polynomial Division:</h3>
                <div class="step"><span class="step-number">1</span><span class="step-content">Arrange both polynomials in descending order of exponents.</span></div>
                <div class="step"><span class="step-number">2</span><span class="step-content">Divide the first term of the dividend by the first term of the divisor.</span></div>
                <div class="step"><span class="step-number">3</span><span class="step-content">Multiply the entire divisor by this result and subtract from the dividend.</span></div>
                <div class="step"><span class="step-number">4</span><span class="step-content">Repeat the process with the new polynomial until the degree of the remainder is less than the divisor.</span></div>
            `;
            break;
    }
    
    const output = document.getElementById("output");
    output.classList.remove("show");
    output.innerHTML = statement;
    
    setTimeout(() => {
        output.classList.add("show");
    }, 10);
}

function formatTerm(coeff, vars) {
    if (vars === "") return coeff.toString();

    // Map digits to superscript characters
    const superscripts = {
        "0": "⁰",
        "1": "¹",
        "2": "²",
        "3": "³",
        "4": "⁴",
        "5": "⁵",
        "6": "⁶",
        "7": "⁷",
        "8": "⁸",
        "9": "⁹"
    };

    // Replace ^<number> with superscript version
    vars = vars.replace(/\^(\d+)/g, (_, exp) => {
        return [...exp].map(d => superscripts[d] || d).join("");
    });

    if (coeff === 1) return vars;
    if (coeff === -1) return `-${vars}`;
    return `${coeff}${vars}`;
}

function showSteps() {
    const p1Input = document.getElementById("poly1").value;
    const p2Input = document.getElementById("poly2").value;
    
    if (!p1Input || !p2Input) {
        alert("Please enter both polynomials");
        return;
    }
    
    const p1 = parsePolynomial(p1Input);
    const p2 = parsePolynomial(p2Input);
    
    let steps = "";
    let result = {};
    
    switch(currentOperation) {
        case "add":
            steps = "<h3>Addition Steps:</h3>";
            result = addPolynomials(p1, p2);
            
            // Show step-by-step addition
            const allKeysAdd = Array.from(new Set([...Object.keys(p1), ...Object.keys(p2)]));
            
            steps += `<div class="step"><span class="step-number">1</span><span class="step-content">Write the polynomials: (${formatPolynomial(p1)}) + (${formatPolynomial(p2)})</span></div>`;
            steps += `<div class="step"><span class="step-number">2</span><span class="step-content">Remove parentheses: ${formatPolynomial(p1)} + ${formatPolynomial(p2)}</span></div>`;
            steps += `<div class="step"><span class="step-number">3</span><span class="step-content">Combine like terms:</span></div>`;
            
            allKeysAdd.forEach(k => {
                let c1 = p1[k] || 0;
                let c2 = p2[k] || 0;
                if (c1 !== 0 || c2 !== 0) {
                    steps += `<div class="step" style="margin-left: 30px;">${formatTerm(c1, k)} + ${formatTerm(c2, k)} = ${formatTerm(c1 + c2, k)}</div>`;
                }
            });
            break;
            
        case "sub":
            steps = "<h3>Subtraction Steps:</h3>";
            result = subtractPolynomials(p1, p2);
            
            // Show step-by-step subtraction
            const allKeysSub = Array.from(new Set([...Object.keys(p1), ...Object.keys(p2)]));
            
            steps += `<div class="step"><span class="step-number">1</span><span class="step-content">Write the polynomials: (${formatPolynomial(p1)}) - (${formatPolynomial(p2)})</span></div>`;
            steps += `<div class="step"><span class="step-number">2</span><span class="step-content">Distribute the negative sign: ${formatPolynomial(p1)} - ${formatPolynomial(p2).replace(/\+/g, '+ -')}</span></div>`;
            steps += `<div class="step"><span class="step-number">3</span><span class="step-content">Combine like terms:</span></div>`;
            
            allKeysSub.forEach(k => {
                let c1 = p1[k] || 0;
                let c2 = p2[k] || 0;
                if (c1 !== 0 || c2 !== 0) {
                    steps += `<div class="step" style="margin-left: 30px;">${formatTerm(c1, k)} - ${formatTerm(c2, k)} = ${formatTerm(c1 - c2, k)}</div>`;
                }
            });
            break;
            
        case "mult":
            steps = "<h3>Multiplication Steps:</h3>";
            result = multiplyPolynomials(p1, p2);
            
            steps += `<div class="step"><span class="step-number">1</span><span class="step-content">Write the polynomials: (${formatPolynomial(p1)}) × (${formatPolynomial(p2)})</span></div>`;
            steps += `<div class="step"><span class="step-number">2</span><span class="step-content">Multiply each term in the first polynomial by each term in the second:</span></div>`;
            
            // Show step-by-step multiplication
            for (const [key1, value1] of Object.entries(p1)) {
                for (const [key2, value2] of Object.entries(p2)) {
                    const combinedVars = combineVariables(key1, key2);
                    steps += `<div class="step" style="margin-left: 30px;">${formatTerm(value1, key1)} × ${formatTerm(value2, key2)} = ${formatTerm(value1 * value2, combinedVars)}</div>`;
                }
            }
            
            steps += `<div class="step"><span class="step-number">3</span><span class="step-content">Combine like terms if any (not needed in this case)</span></div>`;
            break;
            
        case "div":
            // Use polynomial long division
            steps = polynomialLongDivision(p1Input, p2Input);
            result = {};
            break;
    }
    
    const output = document.getElementById("output");
    output.classList.remove("show");
    
    let resultHTML = "";
    if (currentOperation !== "div") {
        resultHTML = `<div class='final-result'><b>Final Result: ${formatPolynomial(result)}</b></div>`;
    }

    output.innerHTML = `${steps}${resultHTML}`;
    
    setTimeout(() => {
        output.classList.add("show");
    }, 10);
}

// Polynomial Parsing & Formatting
//---------------------------
//---------------------------
function parsePolynomial(poly) {
    // Clean the input first
    poly = poly.replace(/\s+/g, "").replace(/²/g, "^2");
    
    // Handle empty case
    if (!poly) return { "": 0 };
    
    let parsed = {};
    let currentTerm = "";
    let sign = 1;
    
    for (let i = 0; i < poly.length; i++) {
        const char = poly[i];
        
        if (char === '+' || char === '-') {
            // Process the previous term
            if (currentTerm !== "") {
                processTerm(currentTerm, sign, parsed);
                currentTerm = "";
            }
            sign = char === '+' ? 1 : -1;
        } else {
            currentTerm += char;
        }
    }
    
    // Process the last term
    if (currentTerm !== "") {
        processTerm(currentTerm, sign, parsed);
    }
    
    return parsed;
    
    function processTerm(term, sign, parsed) {
        if (term === "") return;
        
        // Match coefficient and variables
        const match = term.match(/^([+-]?\d*)([a-z](\^\d+)?)?$/i);
        if (!match) return;
        
        let coeff = match[1];
        let vars = match[2] || "";
        
        // Handle coefficient
        if (coeff === "" || coeff === "+") {
            coeff = 1;
        } else if (coeff === "-") {
            coeff = -1;
        } else {
            coeff = parseInt(coeff);
        }
        
        coeff *= sign;
        
        // Handle variables with exponents
        if (vars.includes('^')) {
            const [varName, exp] = vars.split('^');
            vars = varName + '^' + exp;
        } else if (vars !== "") {
            vars = vars + '^1';
        }
        
        parsed[vars] = (parsed[vars] || 0) + coeff;
    }
}

function formatPolynomial(poly) {
    let terms = [];
    let keys = Object.keys(poly).filter(k => poly[k] !== 0);

    // sort by power length then alphabetically
    keys.sort((a, b) => {
        const getPower = v => v.match(/\^(\d+)/) 
            ? parseInt(v.match(/\^(\d+)/)[1]) 
            : (v === "" ? 0 : 1);
        return getPower(b) - getPower(a) || a.localeCompare(b);
    });

    keys.forEach(k => {
        let coeff = poly[k];
        if (coeff === 0) return;

        let term = "";
        if (k === "") {
            term = coeff.toString();
        } else if (coeff === 1) {
            term = k;
        } else if (coeff === -1) {
            term = "-" + k;
        } else {
            term = coeff + k;
        }
        terms.push(term);
    });

    let result = terms.join(" + ").replace(/\+\s-\s/g, "- ");

    //Convert ALL exponents (^number) to superscript characters
    const superscripts = {
        "0": "⁰",
        "1": "¹",
        "2": "²",
        "3": "³",
        "4": "⁴",
        "5": "⁵",
        "6": "⁶",
        "7": "⁷",
        "8": "⁸",
        "9": "⁹"
    };

    result = result.replace(/\^(\d+)/g, (_, exp) => {
        return [...exp].map(d => superscripts[d] || d).join("");
    });

    return result || "0";
}

function parsePolynomialToTerms(polyStr) {
    // Replace ² with ^2 for processing
    polyStr = polyStr.replace(/²/g, '^2');
    polyStr = polyStr.replace(/\s+/g, "");
    
    const terms = [];
    const termRegex = /([+-]?\d*)([a-z](\^\d+)?)?/gi;
    let match;
    
    while ((match = termRegex.exec(polyStr)) !== null) {
        if (match[0] === '') continue;
        
        let coeff = match[1] === '' || match[1] === '+' ? 1 :
                    match[1] === '-' ? -1 : parseInt(match[1]);
        
        let variable = match[2] || '';
        let exponent = 1;
        
        if (variable.includes('^')) {
            const parts = variable.split('^');
            variable = parts[0];
            exponent = parseInt(parts[1]);
        }
        
        terms.push({
            coefficient: coeff,
            variable: variable,
            exponent: exponent
        });
    }
    
    return terms;
}

function formatTermsAsPolynomial(terms) {
    if (terms.length === 0) return '0';
    
    terms.sort((a, b) => b.exponent - a.exponent);
    
    let result = '';
    for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        
        if (i > 0 && term.coefficient > 0) {
            result += ' + ';
        } else if (term.coefficient < 0) {
            result += ' - ';
        }
        
        const absCoeff = Math.abs(term.coefficient);
        if (absCoeff !== 1 || term.exponent === 0) {
            result += absCoeff;
        }
        
        if (term.exponent > 0) {
            result += term.variable;
            if (term.exponent > 1) {
                result += '^' + term.exponent;
            }
        }
    }
    
    // Replace ^2 with ² for display
    return result.replace(/\^2/g, '²');
}

// Addition, subtraction, multiplication, and division Operations
//---------------------------
//---------------------------
//Addition
function addPolynomials(p1, p2) {
    const result = {...p1};
    for (const [key, value] of Object.entries(p2)) {
        result[key] = (result[key] || 0) + value;
    }
    return result;
}

//Subtraction
function subtractPolynomials(p1, p2) {
    const result = {...p1};
    for (const [key, value] of Object.entries(p2)) {
        result[key] = (result[key] || 0) - value;
    }
    return result;
}

//Multiplication
function multiplyPolynomials(p1, p2) {
    const result = {};
    for (const [key1, value1] of Object.entries(p1)) {
        for (const [key2, value2] of Object.entries(p2)) {
            // Combine variables and exponents
            const combinedVars = combineVariables(key1, key2);
            result[combinedVars] = (result[combinedVars] || 0) + value1 * value2;
        }
    }
    return result;
}

function combineVariables(vars1, vars2) {
    if (!vars1 && !vars2) return "";
    if (!vars1) return vars2;
    if (!vars2) return vars1;

    // Parse variables with exponents
    const parseVars = (str) => {
        const vars = {};
        const matches = str.match(/([a-z])(\^\d+)?/gi) || [];
        matches.forEach(m => {
            const varMatch = m.match(/([a-z])(\^(\d+))?/i);
            if (varMatch) {
                const name = varMatch[1];
                const exp = varMatch[3] ? parseInt(varMatch[3]) : 1;
                vars[name] = (vars[name] || 0) + exp;
            }
        });
        return vars;
    };

    const vars1Obj = parseVars(vars1);
    const vars2Obj = parseVars(vars2);

    // Combine variables
    const allVars = new Set([...Object.keys(vars1Obj), ...Object.keys(vars2Obj)]);
    const resultVars = [];

    for (const v of allVars) {
        const exp = (vars1Obj[v] || 0) + (vars2Obj[v] || 0);
        if (exp > 0) {
            resultVars.push(exp === 1 ? v : `${v}^${exp}`);
        }
    }

    return resultVars.join('');
}

//Division
function polynomialLongDivision(dividendStr, divisorStr) {
    try {
        // Detect variable name from inputs
        const variable = detectVariableName(dividendStr, divisorStr);
        
        // Convert input polynomials to coefficient arrays (low → high degree)
        const dividendArray = polynomialToCoefficientArray(dividendStr);
        const divisorArray = polynomialToCoefficientArray(divisorStr);

        // Check if divisor is zero
        if (divisorArray.length === 0 || divisorArray.every(c => c === 0)) {
            return "<div class='error'>Error: Cannot divide by zero</div>";
        }

        let steps = "<h3>Polynomial Long Division Steps:</h3>";
        steps += `<div class="step"><span class="step-number">1</span><span class="step-content">Divide (${formatPolynomial(parsePolynomial(dividendStr))}) by (${formatPolynomial(parsePolynomial(divisorStr))})</span></div>`;

        let result = [];
        let remainder = [...dividendArray];
        let divisor = [...divisorArray];
        let stepCount = 2;

        // Trim trailing zeros (highest degree at the end for low → high arrays)
        while (remainder.length > 0 && remainder[remainder.length - 1] === 0) remainder.pop();
        while (divisor.length > 0 && divisor[divisor.length - 1] === 0) divisor.pop();

        if (divisor.length === 0) {
            return "<div class='error'>Error: Divisor cannot be zero</div>";
        }

        // Perform division
        while (remainder.length >= divisor.length && remainder.some(c => c !== 0)) {
            // Divide leading terms (last elements, highest degree)
            let coeff = remainder[remainder.length - 1] / divisor[divisor.length - 1];
            let degreeDiff = remainder.length - divisor.length;

            // Build quotient term
            let term = new Array(degreeDiff + 1).fill(0);
            term[degreeDiff] = coeff;
            result = addPolynomialArrays(result, term);

            steps += `<div class="step"><span class="step-number">${stepCount++}</span><span class="step-content"><strong>Current dividend/remainder:</strong> ${formatPolynomialArray(remainder, variable)}</span></div>`;
            let quotientTermStr = formatPolynomialArray(term, variable);
            quotientTermStr = convertQuotientToVariable(quotientTermStr, variable, remainder.length - 1, divisor.length - 1);
            steps += `<div class="step"><span class="step-number">${stepCount++}</span><span class="step-content"><strong>Divide leading terms:</strong> ${remainder[remainder.length - 1]}${variable}^${remainder.length - 1} ÷ ${divisor[divisor.length - 1]}${variable}^${divisor.length - 1} = ${quotientTermStr}</span></div>`;
            
            // Multiply divisor by term
            let subtractTerm = multiplyPolynomialArrays(divisor, term);
            steps += `<div class="step"><span class="step-number">${stepCount++}</span><span class="step-content"><strong>Multiply divisor:</strong> (${formatPolynomialArray(divisor, variable)}) × (${formatPolynomialArray(term, variable)}) = ${formatPolynomialArray(subtractTerm, variable)}</span></div>`;

            // Subtract from remainder
            remainder = subtractPolynomialArrays(remainder, subtractTerm);

            // Trim trailing zeros again
            while (remainder.length > 0 && remainder[remainder.length - 1] === 0) remainder.pop();

            steps += `<div class="step"><span class="step-number">${stepCount++}</span><span class="step-content"><strong>Subtract:</strong> ${formatPolynomialArray(subtractTerm, variable)} from current dividend</span></div>`;
            steps += `<div class="step"><span class="step-number">${stepCount++}</span><span class="step-content"><strong>New remainder:</strong> ${formatPolynomialArray(remainder, variable)}</span></div>`;

            // Safety check
            if (stepCount > 50) {
                steps += `<div class="step"><span class="step-number">${stepCount++}</span><span class="step-content"><strong>Note:</strong> Division process stopped to avoid infinite loop.</span></div>`;
                break;
            }
        }

        // Convert the final quotient array to a proper polynomial string
        let finalQuotientStr = formatPolynomialArray(result, variable);

        // Apply the quotient conversion to handle cases like constant 1 becoming variable
        const dividendDegree = polynomialToCoefficientArray(dividendStr).length - 1;
        const divisorDegree = polynomialToCoefficientArray(divisorStr).length - 1;
        finalQuotientStr = convertQuotientToVariable(finalQuotientStr, variable, dividendDegree, divisorDegree);

        // Format remainder similarly
        let finalRemainderStr = formatPolynomialArray(remainder, variable);

        steps += `<div class="final-result"><h4>Final Quotient: ${finalQuotientStr}</h4>`;
        steps += `<h4>Final Remainder: ${finalRemainderStr}</h4></div>`;

        return steps;
    } catch (error) {
        console.error("Division error:", error);
        return `<div class="error">Error in polynomial division: ${error.message}</div>`;
    }
}

function detectVariableName(poly1, poly2) {
    // Look for the most common variable (prioritize x, y, z, then others)
    const commonVars = ['x', 'y', 'z', 'a', 'b', 'c', 'm', 'n'];

    // Check for common variables first
    for (const v of commonVars) {
        if (poly1.includes(v) || poly2.includes(v)) {
            return v;
        }
    }

    // If no common vars, find any alphabetical character
    const variableMatch1 = poly1.match(/[a-z]/i);
    const variableMatch2 = poly2.match(/[a-z]/i);

    return variableMatch1 ? variableMatch1[0] : (variableMatch2 ? variableMatch2[0] : 'x');
}

function convertQuotientToVariable(quotientStr, variable, dividendDegree, divisorDegree) {
    const expectedDegree = dividendDegree - divisorDegree;

    // Special case: when dividend and divisor are the same degree, result should be 1 (constant)
    if (expectedDegree === 0 && quotientStr === "1") {
        return "1";
    }

    // If we expect a variable but got a constant "1", convert it to variable form
    if (expectedDegree > 0 && quotientStr === "1") {
        if (expectedDegree === 1) return variable;
        return `${variable}^${expectedDegree}`;
    }

    // If we expect a variable but got a constant "-1", convert it
    if (expectedDegree > 0 && quotientStr === "-1") {
        if (expectedDegree === 1) return `-${variable}`;
        return `-${variable}^${expectedDegree}`;
    }

    // For other numeric constants where we expect variables, prepend/append the variable
    if (expectedDegree > 0 && /^-?\d+$/.test(quotientStr)) {
        const num = parseInt(quotientStr);
        const absNum = Math.abs(num);
        let sign = num < 0 ? "-" : "";
        let coeffPart = (absNum === 1 && expectedDegree === 1) ? "" : absNum.toString();
        let varPart = variable;
        if (expectedDegree > 1) {
            varPart += `^${expectedDegree}`;
        }
        return sign + coeffPart + varPart;
    }

    // Special case: if quotient is empty but we expect variables, return the variable
    if (expectedDegree > 0 && (quotientStr === "" || quotientStr === "0")) {
        if (expectedDegree === 1) return variable;
        return `${variable}^${expectedDegree}`;
    }

    // Apply superscript conversion if not already applied
    const superscripts = {
        "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
        "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"
    };
    return quotientStr.replace(/\^(\d+)/g, (_, exp) => {
        return [...exp].map(d => superscripts[d] || d).join("");
    });
}

function polynomialToCoefficientArray(polyStr) {
    const parsed = parsePolynomial(polyStr);
    
    // Find the highest degree
    let maxDegree = 0;
    for (const key of Object.keys(parsed)) {
        if (key === "") {
            maxDegree = Math.max(maxDegree, 0);
        } else {
            let degree = 1;
            if (key.includes('^')) {
                degree = parseInt(key.split('^')[1]);
            }
            maxDegree = Math.max(maxDegree, degree);
        }
    }
    
    // Create coefficient array [constant, x, x², ...]
    const coefficients = new Array(maxDegree + 1).fill(0);
    
    for (const [key, value] of Object.entries(parsed)) {
        if (key === "") {
            coefficients[0] += value; // constant term
        } else {
            let degree = 1;
            if (key.includes('^')) {
                degree = parseInt(key.split('^')[1]);
            }
            coefficients[degree] += value;
        }
    }
    
    return coefficients;
}

function formatPolynomialArray(polyArray, variable = 'x') {
    if (polyArray.length === 0) return "0";
    
    const terms = [];
    
    // polyArray is [constant, x, x², ...] low to high
    for (let degree = polyArray.length - 1; degree >= 0; degree--) {
        const coeff = polyArray[degree];
        if (coeff === 0) continue;
        
        let term = "";
        
        if (degree === 0) {
            term = coeff.toString();
        } else {
            let varPart = variable;
            if (degree > 1) {
                varPart += `^${degree}`;
            }
            
            if (Math.abs(coeff) === 1 && degree === 1) {
                term = (coeff < 0 ? "-" : "") + varPart;
            } else {
                term = coeff.toString() + varPart;
            }
        }
        
        terms.push(term);
    }
    
    let result = terms.join(" + ").replace(/\+\s-/g, " - ");
    
    // Handle empty result
    if (result === "") return "0";
    
    // Convert exponents to superscript for display consistency
    const superscripts = {
        "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
        "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"
    };
    result = result.replace(/\^(\d+)/g, (_, exp) => {
        return [...exp].map(d => superscripts[d] || d).join("");
    });
    
    return result;
}

function addPolynomialArrays(p1, p2) {
    let maxLen = Math.max(p1.length, p2.length);
    let result = new Array(maxLen).fill(0);
    for (let i = 0; i < maxLen; i++) {
        let a = p1[p1.length - maxLen + i] || 0;
        let b = p2[p2.length - maxLen + i] || 0;
        result[i] = a + b;
    }
    return result;
}

function subtractPolynomialArrays(p1, p2) {
    let maxLen = Math.max(p1.length, p2.length);
    let result = new Array(maxLen).fill(0);
    for (let i = 0; i < maxLen; i++) {
        let a = p1[p1.length - maxLen + i] || 0;
        let b = p2[p2.length - maxLen + i] || 0;
        result[i] = a - b;
    }
    return result;
}

function multiplyPolynomialArrays(p1, p2) {
    let result = new Array(p1.length + p2.length - 1).fill(0);
    for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
            result[i + j] += p1[i] * p2[j];
        }
    }
    return result;
}

// Quiz System Functions
//---------------------------
//---------------------------
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function loadQuiz() {
    const container = document.getElementById("quizContent");
    container.innerHTML = "";

    const numQuestions = 5; // how many random questions
    currentQuestions = shuffle([...quizQuestions]).slice(0, numQuestions);
    totalQuestions = currentQuestions.length;
    
    // Add quiz container structure
    container.innerHTML = `
        <div class="quiz-container">
            <div class="score-display">Score: ${score}/${totalQuestions}</div>
            <div id="currentQuestion"></div>
            <div class="progress-bar"><div class="progress-bar-inner"></div></div>
            <div class="quiz-footer">
                <button class="action-btn hidden" id="nextButton" onclick="nextQuestion()">
                    <i class="fas fa-arrow-right"></i> Next Question
                </button>
            </div>
        </div>
    `;
    
    showQuestion(0);
}

function showQuestion(index) {
    if (index >= currentQuestions.length) {
        // Quiz completed
        showQuizResults();
        return;
    }
    
    const questionContainer = document.getElementById("currentQuestion");
    const qObj = currentQuestions[index];
    
    let qBlock = `<div class="quiz-question"><h3>Q${index+1}: ${qObj.q}</h3>`;
    let shuffledChoices = shuffle([...qObj.choices]);
    
    shuffledChoices.forEach(choice => {
        qBlock += `<div class='choice' onclick="checkAnswer('${qObj.answer.replace(/'/g, "\\'")}', '${choice.replace(/'/g, "\\'")}')">${choice}</div>`;
    });
    
    qBlock += "</div>";
    questionContainer.innerHTML = qBlock;
    
    // Reset progress bar
    const progressBar = document.querySelector('.progress-bar-inner');
    progressBar.style.width = '0%';
    
    // hide next button
    document.getElementById('nextButton').classList.add('hidden');
    
    // animate quiz choices after a short delay
    setTimeout(() => {
        const choices = document.querySelectorAll('.choice');
        choices.forEach((choice, idx) => {
            setTimeout(() => {
                choice.style.opacity = 1;
                choice.style.transform = 'translateY(0)';
            }, idx * 100);
        });
    }, 100);
    
    currentQuestionIndex = index;
    
    // update score display
    document.querySelector('.score-display').textContent = `Score: ${score}/${totalQuestions}`;
}

function checkAnswer(correct, choice) {
    const choices = document.querySelectorAll('.choice');
    const progressBar = document.querySelector('.progress-bar-inner');
    
    // make the other choices unclickable after one is selected
    choices.forEach(c => {
        c.classList.add('disabled');
    });
    
    // mark correct and incorrect answers
    choices.forEach(c => {
        if (c.textContent === correct) {
            c.classList.add('correct');
        } else if (c.textContent === choice) {
            c.classList.add('incorrect');
        }
    });
    
    // updates the score if correct
    if (choice === correct) {
        score++;
        document.querySelector('.score-display').textContent = `Score: ${score}/${totalQuestions}`;
    }
    
    // progress bar animation 
    progressBar.style.width = '100%';
    
    // show next button
    document.getElementById('nextButton').classList.remove('hidden');
}

function nextQuestion() {
    showQuestion(currentQuestionIndex + 1);
}

function showQuizResults() {
    const container = document.getElementById("quizContent");
    container.innerHTML = `
        <div class="quiz-results">
            <h2>Quiz Completed!</h2>
            <p>Your final score: ${score}/${totalQuestions}</p>
            <p>${score === totalQuestions ? 'Perfect! 🎉' : score >= totalQuestions/2 ? 'Good job! 👍' : 'Keep practicing! 💪'}</p>
            <div class="quiz-result-buttons">
                <button class="action-btn try-again-btn" onclick="loadQuiz()">
                    <i class="fas fa-redo"></i> Try Again
                </button>
                <button class="action-btn home-btn" onclick="goTo('home')">
                    <i class="fas fa-home"></i> Back to Home
                </button>
            </div>
        </div>
    `;
}