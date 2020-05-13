require('../node_modules/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css');

var SDK = require('blocksdk');
var sdk = new SDK(null, null, null); // 3rd argument true bypassing https requirement: not prod worthy

var json_loc, default_content, content, bl1, l2, bl3, bl4;

function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function paintSettings() {
	document.getElementById('text-input-id-0').value = json_loc;
}

function paintMap() {
	json_loc = document.getElementById('text-input-id-0').value;

	bl1 = "%%[var @dataurl set @dataurl = HTTPGet(\"";
	bl2 = "{{.datasource MSContent source = @dataurl type = variable}}{{.data}} { \"target\": \"@dataurl\",\"filter\": \"Contact_ID == [ID]\"}";
	bl3 = "{{/data}} {{.datasource contacts type = nested}} {{.data}} {\"target\": \"MSContent.content\"} {{/data}}";
	bl4 = "{{#if Contact_ID == [ID]}} <img src =\"{{url}}\"> {{/if}} {{/datasource}} {{/datasource}}";

	content = bl1 + json_loc + "\")]%% " + bl2 + bl3 + bl4;

	default_content = "<p><h4><b>Content Builder SDK</b></p>";
	sdk.setSuperContent(default_content, (newSuperContent) => {});
	sdk.setContent(content);
	sdk.setData({
		json_loc: json_loc
	});
	localStorage.setItem('jsonlocationforblock', json_loc);
}

sdk.getData(function (data) {
	json_loc = data.json_loc || localStorage.getItem('jsonlocationforblock');
	paintSettings();
	paintMap();
});

document.getElementById('workspace').addEventListener("input", function () {
	debounce(paintMap, 500)();
});