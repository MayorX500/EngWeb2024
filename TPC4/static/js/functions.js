/* =============================
This script generates sample text for the body content. 
You can remove this script and any reference to it. 
 ============================= */
var bodyText = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
];

function generateText(sentenceCount) {
    for (var i = 0; i < sentenceCount; i++)
        document.write(bodyText[Math.floor(Math.random() * bodyText.length)] + " ");
}


// This function updates the periodoId input based on the selected period
function updatePeriodId() {
    var periodoSelect = document.getElementById('periodo');
    var selectedOption = periodoSelect.options[periodoSelect.selectedIndex];
    var periodoId = selectedOption.getAttribute('data-periodo-id');

    // Update the periodoId input field
    document.getElementById('periodoId').value = periodoId;
}

// You can attach multiple functions to the DOMContentLoaded event if needed
document.addEventListener('DOMContentLoaded', function() {
    updatePeriodId();
    // any other initialization functions you need to run when the document loads
  });