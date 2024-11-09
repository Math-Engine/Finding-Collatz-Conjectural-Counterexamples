// 덧셈
function bigNumberAdd(a, b) {
    a = a.toString();
    b = b.toString();
    let result = '', carry = 0;
    let len = Math.max(a.length, b.length);
    a = a.padStart(len, '0');
    b = b.padStart(len, '0');
    for (let i = len - 1; i >= 0; i--) {
        let sum = Number(a[i]) + Number(b[i]) + carry;
        result = (sum % 10) + result;
        carry = Math.floor(sum / 10);
    }
    if (carry > 0) result = carry + result;
    return result;
}

// 곱셈
function bigNumberMultiply(a, b) {
    a = a.toString();
    b = b.toString();
    let result = '0';
    for (let i = b.length - 1; i >= 0; i--) {
        let row = '', carry = 0;
        for (let j = a.length - 1; j >= 0; j--) {
            let product = Number(b[i]) * Number(a[j]) + carry;
            row = (product % 10) + row;
            carry = Math.floor(product / 10);
        }
        if (carry > 0) row = carry + row;
        row += '0'.repeat(b.length - 1 - i);
        result = bigNumberAdd(result, row);
    }
    return result;
}

// 뺄셈
function bigNumberSubtract(a, b) {
    a = a.toString();
    b = b.toString();
    if (a == b) {
        return "0";
    }
    let result = '', borrow = 0;
    let len = Math.max(a.length, b.length);
    a = a.padStart(len, '0');
    b = b.padStart(len, '0');
    for (let i = len - 1; i >= 0; i--) {
        let diff = Number(a[i]) - Number(b[i]) - borrow;
        if (diff < 0) {
            diff += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }
        result = diff + result;
    }
    if (borrow > 0) result = '-' + bigNumberSubtract(b, a);
    return result.replace(/^0+/, '');
}

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

execSync(`git pull origin main`);

let startNum = fs.readFileSync('max', 'utf8').trim();
let endNum;
if (process.argv[2]) {
    endNum = bigNumberAdd(startNum, process.argv[2]);
}else{
    endNum = bigNumberAdd(startNum, "1");
}
for (let i = startNum; bigNumberSubtract(endNum, i).includes("-") == false && bigNumberSubtract(endNum, i) != "0"; i = bigNumberAdd(i, "1")) {
    if (i.slice(-1) % 2 == 0) {
        console.log([i, bigNumberMultiply(i, "5").slice(0, -1), "...", "1"]);
        continue;
    }
    n = i;
    let HailStoneNumber = [n];
    while (n != 1) {
        if (n.slice(-1) % 2 == 0) {
            n = bigNumberMultiply(n, "5").slice(0, -1);
        }else{
            n = bigNumberAdd(bigNumberMultiply(n, "3"), "1");
        }
        if (bigNumberSubtract(i, n).includes("-") == false && bigNumberSubtract(i, n) != "0") {
            HailStoneNumber.push("...");
            HailStoneNumber.push("1");
            break;
        }
        HailStoneNumber.push(n);
    }
    console.log(HailStoneNumber);
}
fs.writeFileSync('max', endNum);
execSync(`git config user.name "github-actions[bot]"`);
execSync(`git config user.email "github-actions[bot]@users.noreply.github.com"`);
let commitMessage = endNum - startNum > 1 ? `Calculated from ${bigNumberAdd(startNum, '1')} ~ ${endNum}, no counterexamples` : `Calculated ${endNum}, no counterexample`;
execSync(`git add . && git commit -m "${commitMessage}" && git push`);
