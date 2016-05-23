"use strict";

module.exports = function(dependencies, config) {
	var client = dependencies.mqtt.connect(config.mqttHost);
	
	client.on("connect", function() {
    client.subscribe(config.topic);
	});
	
	client.on("message", function(topic,msg) {
		config.callback(msg.toString());
	});
};