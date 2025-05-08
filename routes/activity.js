'use strict';
const axios = require("axios");
const util = require('util');
const { Client } = require('pg');

// Global Variables
const tokenURL = `${process.env.authenticationUrl}/v2/token`;

/*
 * POST Handlers for various routes
 */
exports.edit = function (req, res) {
    res.status(200).send('Edit');
};

exports.execute = async function (req, res) {
    try {
        send('Execute');
    } catch (error) {
        console.error('Error executing journey:', error);

        send('Execute'); // Ensure the journey continues
    }
};


exports.publish = function (req, res) {
    res.status(200).send('Publish');
};

exports.validate = function (req, res) {
    res.status(200).send('Validate');
};

exports.stop = function (req, res) {
    res.status(200).send('Stop');
};

/*
 * Function to retrieve an access token
 */
async function retrieveToken() {
    try {
        const response = await axios.post(tokenURL, {
            grant_type: 'client_credentials',
            client_id: process.env.clientId,
            client_secret: process.env.clientSecret,
            account_id: process.env.accountId
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        throw error;
    }
}

/*
 * Function to trigger a journey
 */
async function triggerJourney(token, contactKey, data) {
    const triggerUrl = `${process.env.restBaseURL}/interaction/v1/events`;
    const eventPayload = {
        ContactKey: contactKey,
        EventDefinitionKey: "APIEvent-d70adac2-866f-d65b-c7fd-63e1a3622b6a",
        Data: data
    };
    try {
        const response = await axios.post(triggerUrl, eventPayload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return { status: 'Success', error: null };
    } catch (error) {
        console.error('Error triggering journey:', error);
        return { status: 'Error', error: error };
    }
}

/*
 * FUNCTION TO ADD DATA
 */
function retrieveData() {
    const eventData = {
        "SubscriberKey": "REWARDSAPITEST01",
        "Email": "sam.sample@salesforce.com",
        "First_Name": "Sam",
        "Last_Name": "Sample",
        "DeviceID": "904d11b8-e827-4a63-b039-91be0b5f5c95",
        "Campaign_Name": "API_TEST",
        "Message_text": "Test Rewards Message",
        "Message_title": "Welcome to rewards"
    };

    return eventData;
}
