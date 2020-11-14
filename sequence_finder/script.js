document.addEventListener('DOMContentLoaded', () => {
    const findButton = document.querySelector('.find-btn');

    //Check target to make sure only ATCGN are used; send all characters to uppercase
    function parseTarget(targ) {
        d
    }

    function findSeq() {
        let template = document.querySelector('.dna-template').value;
        //template = parseTemplate(template);
        let target = document.querySelector('.look-for').value;
        //target = parseTarget(target);
        let foundIndex = [];
        let foundCount = 0;

        //Iterate through template and check for target. Keep track of where and how many targets were found.
        for (let i = 0; i+target.length < template.length+1; i++){
            console.log(i)
            let candidate = template.substring(i,i+target.length);
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
        let ratio = count / temp.length;
        document.querySelector('.table-ratio').innerHTML = ratio;
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
        for (let i = 0; i < temp.length; i++){
            console.log(indArr);
            console.log(i.toString());
            if (indArr.includes(i) && counter === targ.length){
                outputHtml += "</span><span class='targeted' >";
                counter = 1;
            } else if (indArr.includes(i)) {
                console.log("DING!");
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
        console.log(outputHtml);
        document.querySelector('.template-vis').innerHTML = outputHtml;

    };

    findButton.onclick = findSeq;
});