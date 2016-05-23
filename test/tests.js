"use strict";

var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var mqttDouble = require('./support/mqttDouble');
var testHandler = sinon.stub();

var mqttAdapter = require('../index');

function createDependencies() {
	return {
		mqtt: mqttDouble()
	};
}

function createConfig() {
	return {
		mqttHost: "mqtt://192.168.1.124",
		topic: 'phgms/state',
		callback: testHandler
	};
}

describe("The convertor calls methods based on messages", function() {
	beforeEach(function() {
		this.dependencies = createDependencies();
		this.config = createConfig();
		this.adapter = mqttAdapter(this.dependencies, this.config);
	});

	it("will connect to the MQTT server", function() {
		return expect(this.dependencies.mqtt.connect).to.be.calledWith(this.config.mqttHost);
	});

	context("Given that the connection was successful", function() {
		beforeEach(function() {
			this.client = this.dependencies.mqtt.client;
			this.client.emit("connect");
		});

		it("will subscribe to the correct topic", function() {
			return expect(this.client.subscribe).to.be.calledWith(this.config.topic);
		});

		it("will react to messages", function() {
			this.client.emit("message");
			return expect(this.config.callback).to.have.been.calledOnce;
		});
	});
});