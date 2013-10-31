$(function(){
	var reading = false;
	init();

	function init(){
		chrome.serial.getPorts(function (ports) {
			for (var i=0; i<ports.length; i++) {
				var port = ports[i];
				$("#ports").append($("<option>").html(port).val(port));
			}
		});		
	}

	$("#open").click(function(){
	   var selectedPort = $("#ports option:selected").val();
	   var options = {bitrate:9600}; //BAUD RATE=9600
	   chrome.serial.open(selectedPort, options, function (openInfo) {
	   	connectionId = openInfo.connectionId;
	   	console.log("openInfo.connectionId=" + connectionId);
	   });
	});

	$("#close").click(function(){
		chrome.serial.close(connectionId, function () {
			console.log("Closed.");
		});		
		reading = false;
	});

	$("#write").click(function(){
		writePort();
	});

	$("#read").click(function(){
	   startReadingPort();//Waiting the messages
	});

	function writePort () {
		console.log("Sending......");
		var data = getArrayBufferForString(
			document.getElementById('textWrite').value);
		chrome.serial.write(connectionId, data,
			function (sendInfo){console.log("Sent.")})
	}

	function getArrayBufferForString(str) {
		var buff = new ArrayBuffer(str.length);
		var arr = new Uint8Array(buff);
		for (var i=0; i<str.length; i++) {
			arr[i] = str.charCodeAt(i);
		}
		return buff;
	}

	function startReadingPort () { //読み取り開始
		reading = true;
		concole.log("Waiting for incoming messages...");
		readPort();
	}

	function readPort() {
		var bytesToRead= 64;
		chrome.serial.read(connectionId, bytesToRead,
			function (readInfo) {
				if (readInfo.bytesRead > 0) {
	             // データはArrayBuffer型で受け取れる
	             var arr = new Uint8Array(readInfo.data);
	             var message = String.fromCharCode.apply(null, arr);
	             $("#textRead").text(message);
	             console.log(message);
	         }
	         if(reading)
	         	readPort();
	    });
	}

});

