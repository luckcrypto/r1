// TAKE NUMBER INPUT FROM USER "minNumber" and "maxNumber"

// Get "minNumber" from user input and store in variable
// var min = document.getElementById("minNumber").value;

// Get "maxNumber" from user input and store in variable
// var max = document.getElementById("maxNumber").value;

// Use "minNumber" to generate the floor number used in the random calculation
// Use "maxNumber" to generate the ceiling number used in the random calculation

function randomNumber() {
	var min = parseInt(document.getElementById("minNumber").value);
	var max = parseInt(document.getElementById("maxNumber").value) + 1;
	
	if (isNaN(min) || isNaN(max)) {
		alert('Please enter a number into the blank field(s)');
	} else if (min > max) {
		alert('Please make sure the maximum number is greater than the minumum number');
	} else {	
		var result = Math.floor(Math.random() * (max - min)) + min;
		
		document.getElementById("result").value = result;
	}
}

// WHEN 'ENTER' KEY IS PRESSED IN maxNumber FIELD, INVOKE getRequest FUNCTION
document.getElementById('maxNumber').addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById('generateBtn').click();
  }
})

// WHEN 'ENTER' KEY IS PRESSED IN minNumber FIELD, INVOKE getRequest FUNCTION
document.getElementById('minNumber').addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById('generateBtn').click();
  }
})