//DESCRIPTION: Add a string to empty selected table cells
//
// Created 27-04-2023
// Edmond Lo, Hothouse Design
// https://hothousedesign.com.au
//
// Select cells to perform this operation.

// Main();
// If you want the script to be un-doable, comment out the line above, and remove the comment from the line below
app.doScript(Main, undefined, undefined, UndoModes.ENTIRE_SCRIPT,"Run Script");

function Main() {

    // Check to see whether any InDesign documents are open.
	// If no documents are open, display an error message.
	if (app.documents.length == 0) {
        alert("No document is open.");
        return;
    }

    // Get string to insert
    var the_dialog = app.dialogs.add({name:"Add to empty selected cells"});
    with(the_dialog.dialogColumns.add()){
        with(dialogRows.add()){
            staticTexts.add({staticLabel:"Input string to add to selected cells:"});
        }
        with(borderPanels.add()){
            var addText = textEditboxes.add({minWidth: 120});
        }
    }
    the_dialog.show();
    var x = addText.editContents;
	the_dialog.destroy();

	// Progress bar
	var progressPanel;
	var maxValue = 300;
	var progressBarWidth = 300;
	createProgressPanel(maxValue, progressBarWidth);

	function createProgressPanel(maximumValue, progressBarWidth) {
		progressPanel = new Window("window", "Processing");
		with (progressPanel) {
			progressPanel.progressBar = add("progressbar", [48, 12, progressBarWidth, 24], 0, maximumValue);
		}
		return progressPanel;
	}

	progressPanel = createProgressPanel(100, 400);
	progressPanel.show();

	var userSet = app.scriptPreferences.enableRedraw;
	app.scriptPreferences.enableRedraw = true; 

	switch (app.selection[0].constructor.name){
		case "Table":
			addString(x);
			break;
		case "Cell":
			addString(x);
			break;
		default:
			alert("No cell is selected.");
			break;
	}

	function addString(x) {
		var celSel = app.selection[0].cells.everyItem().getElements();
		for (var c = 0; c < celSel.length; c++ ) {
			if (celSel[c].contents.length == 0) {
				celSel[c].contents = x;
			}
			progressPanel.progressBar.value = (100/celSel.length)*c;
		}
		app.scriptPreferences.enableRedraw = userSet;
	}
}
