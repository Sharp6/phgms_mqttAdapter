"use strict";

var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;

module.exports = function() {
	var mqtt = {};

	var client = new EventEmitter();
	client.subscribe = sinon.stub();

	mqtt.client = client;

	mqtt.connect = sinon.stub();
	mqtt.connect.returns(client);

	return mqtt;
};