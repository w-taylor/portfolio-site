document.addEventListener('DOMContentLoaded', () => {
    const findButton = document.querySelector('.find-btn');

    //Check target to make sure only ATCGN are used; send all characters to uppercase; ignore newlines and carriage returns
    function parseDna(dna) {
        let newDna = "";
        for (let z = 0; z < dna.length; z++){
            if (dna[z] === "\n" | dna[z] === "\t"){
                continue;
            } else if (dna[z].match(/^[a|t|c|g|n|u]+$/i) == null){
                return "fail";
            } else {
                newDna = newDna.concat(dna[z].toUpperCase());
            };
        };
        return newDna;
    }

    function findSeq() {
        document.querySelector('.bad-input').style.visibility = "hidden";
        let template = document.querySelector('.dna-template').value;
        template = parseDna(template);
        let target = document.querySelector('.look-for').value;
        target = parseDna(target);
        if (target === "fail" | template === "fail"){
            document.querySelector('.bad-input').style.visibility = "visible";
            return;
        };
        let foundIndex = [];
        let foundCount = 0;

        //Iterate through template and check for target. Keep track of where and how many targets were found.
        for (let i = 0; i+target.length < template.length+1; i++){
            let candidate = template.substring(i,i+target.length);
            for (let x = 0; x < target.length; x++){
                if (target[x] === "N" | candidate[x] === "N"){
                    //if either target or candidate have an N, match the candidate to the target at that position
                    candidate = candidate.substr(0, x)+target[x]+candidate.substr(x+1,candidate.length);
                }
            }
            if (target === candidate) {
                foundCount++;
                foundIndex.push(i);
            };
        };

        makeOutput(foundIndex, foundCount, target, template);
    };

    //Update table with total # of targets found, ratio of total found/template length, and indices of each hit
    //Also output template text with hits highlighted
    function makeOutput (indArr, count, targ, temp) {
        outputBox = document.querySelector('.output-box');
        outputBox.style.visibility = 'visible';
        
        document.querySelector('.table-target').innerHTML = targ;
        document.querySelector('.table-tot').innerHTML = count;
        let ratio = (count / temp.length).toFixed(3);
        document.querySelector('.table-ratio').innerHTML = ratio;
        //store index of where targeted regions are found
        let indStr = '';
        for (let i = 0; i < indArr.length; i++) {
            if (i === 0) {
                indStr += indArr[i];
            } else {
                indStr += ", ";
                indStr += indArr[i];
            }
        };
        document.querySelector('.table-ind').innerHTML = indStr;

        if (document.getElementById("visual-check").checked === false) {
            document.querySelector('.template-vis').innerHTML = "";
            return;
        };

        let outputHtml = "";
        let counter = 0;
        let flag = 0;
        //for visual output, show template and surround target matched segments with 'targeted' span
        for (let i = 0; i < temp.length; i++){
            if (indArr.includes(i) && counter > 0){ //if in the middle of a target and an overlapping target begins, reset the counter
                counter = 1;
            } else if (indArr.includes(i)) {
                outputHtml += "<span class='targeted' >";
                flag = 1;
                counter = 1;
            } else if (counter === targ.length) {
                outputHtml += "</span>";
                counter = 0;
                flag = 0;
            } else if (flag == 1) {
                counter ++;
            }
            outputHtml += temp.charAt(i);
        };

        outputHtml = "<h2>Match Locations:</h2>" + outputHtml;
        document.querySelector('.template-vis').innerHTML = outputHtml;

    };

    findButton.onclick = findSeq;
});