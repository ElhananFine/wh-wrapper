import { expect } from "chai";
import sinon from "sinon";
import express from "express";
import Client from "../lib/index";
import { ClientOptions } from "../lib/types/shared";
import dotenv from "dotenv";
import { ParametersError } from "../lib/errors/error-classes";

const phoneIDValue = "";
const tokenVale = "";
const verifyTokenValue = "";
const callbackUrlValue = "";
const appIDValue = "";
const appSecretValue = "";
const businessAccountIDValue = "";
const webHookEndpointValue = "";
const portValue = 4006;

///
const recipientPhoneNumber = "";

dotenv.config({ path: "../.env.example" });

describe("Client", () => {
    let client: Client;

    const phoneID = process.env.PHONE_ID || phoneIDValue;
    const token = process.env.TOKEN || tokenVale;
    const verifyToken = process.env.VERIFY_TOKEN || verifyTokenValue;
    const options: ClientOptions = {
        baseURL: process.env.BASE_URL || "https://graph.facebook.com",
        apiVersion: process.env.API_VERSION || "19.0",
        webHookEndpoint: process.env.WEBHOOK_ENDPOINT || webHookEndpointValue,
        callbackUrl: process.env.CALLBACK_URL || callbackUrlValue,
        appID: process.env.APP_ID || appIDValue,
        appSecret: process.env.APP_SECRET || appSecretValue,
        businessAccountID: process.env.BUSINESS_ACCOUNT_ID || businessAccountIDValue,
        server: express(),
        port: Number(process.env.PORT) || portValue || 3000,
    };

    before(() => {
        client = new Client(phoneID, token, verifyToken, options);
    });

    after(() => {
        sinon.restore();
    });

    // constructor
    describe("constructor", () => {
        it("should throw an error if phoneID and token are not provided", () => {
            expect(() => new Client("", "")).to.throw("Missing Parameters, phoneID and token are required");
        });

        it("should set the correct URL based on the provided options", () => {
            const customOptions: ClientOptions = {
                ...options,
                baseURL: "https://graph.facebook.com",
                apiVersion: "19.0",
            };
            const customClient = new Client(phoneID, token, verifyToken, customOptions);
            expect(customClient.url).to.equal("https://graph.facebook.com/v19.0");
        });

        it("should set the axiosInstance with the correct baseURL and headers", () => {
            expect(client.axiosInstance.defaults.baseURL).to.equal(client.url);
            expect(client.axiosInstance.defaults.headers).to.include({
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            });
        });

        it("should throw an error if callbackUrl is provided but appID or appSecret is missing", () => {
            const invalidOptions = {
                ...options,
                callbackUrl: "https://example.com/callback",
                appID: undefined,
            };
            expect(() => new Client(phoneID, token, verifyToken, invalidOptions)).to.throw(
                "Missing Parameters, appId and appSecret are required"
            );
        });
    });

    // _initialize
    describe("_initialize", () => {
        let serverListenSpy: sinon.SinonSpy;
        let serverUseSpy: sinon.SinonSpy;
        let serverGetSpy: sinon.SinonSpy;
        let serverPostSpy: sinon.SinonSpy;

        beforeEach(() => {
            serverListenSpy = sinon.spy(options.server, "listen");
            serverUseSpy = sinon.spy(options.server, "use");
            serverGetSpy = sinon.spy(options.server, "get");
            serverPostSpy = sinon.spy(options.server, "post");
        });

        afterEach(() => {
            serverListenSpy.restore();
            serverUseSpy.restore();
            serverGetSpy.restore();
            serverPostSpy.restore();
        });

        it("should create a new Express server if one is not provided", (done) => {
            new Client(phoneID, token, verifyToken, { ...options, server: undefined })._initialize().then(() => {
                expect(serverListenSpy.calledOnce).to.be.true;
                expect(serverUseSpy.calledOnce).to.be.true;
            });
            done();
        });

        it("should throw an error if verifyToken is not provided", (done) => {
            Promise.resolve()
                .then(() => new Client(phoneID, token, undefined, options)._initialize())
                .catch((error) => {
                    expect(error.message).to.equal("A proper verify token must be provided.");
                    done();
                });
        });

        it("should set up GET and POST routes correctly", async () => {
            await client._initialize();
            expect(serverGetSpy.calledOnce).to.be.true;
            expect(serverPostSpy.calledOnce).to.be.true;
        });
    });

    // setCallBackUrl
    describe("setCallBackUrl", () => {
        let makeRequestStub: sinon.SinonStub;

        beforeEach(() => {
            makeRequestStub = sinon.stub(client, "makeRequest");
        });

        afterEach(() => {
            makeRequestStub.restore();
        });

        it("should make the correct requests to set the callback URL", async () => {
            makeRequestStub
                .onFirstCall()
                .resolves({ access_token: "access_token", token_type: "bearer" })
                .onSecondCall()
                .resolves({ success: true });

            const result = await client._setCallBackUrl("https://example.com", "app_id", "app_secret");
            expect(result).to.deep.equal({ success: true });

            expect(makeRequestStub.calledTwice).to.be.true;
            expect(makeRequestStub.firstCall.args[0]).to.deep.equal({
                method: "GET",
                url: "/oauth/access_token",
                params: {
                    grant_type: "client_credentials",
                    client_id: "app_id",
                    client_secret: "app_secret",
                },
            });
            expect(makeRequestStub.secondCall.args[0]).to.deep.equal({
                method: "POST",
                url: "/app_id/subscriptions",
                params: {
                    object: "whatsapp_business_account",
                    callback_url: `https://example.com${options.webHookEndpoint}`,
                    verify_token: verifyToken,
                    access_token: "access_token",
                    fields: "message_template_status_update,messages",
                },
            });
        });
    });

    // sendMessage
    describe("sendMessage", () => {
        let makeRequestStub: sinon.SinonStub;
        const recipientPhoneNumber = "GLOBAL_RECIPIENT_PHONE_NUMBER";

        beforeEach(() => {
            makeRequestStub = sinon.stub(client, "makeRequest");
        });

        afterEach(() => {
            makeRequestStub.restore();
        });

        it("should throw an error if the 'to' parameter is not a string", async () => {
            try {
                await client.sendMessage(123 as any, "Hello");
                expect.fail("Expected error to be thrown");
            } catch (err) {
                expect(err).to.be.an.instanceOf(ParametersError);
            }
        });

        it("should throw an error if the 'text' parameter is not provided", async () => {
            try {
                await client.sendMessage(recipientPhoneNumber, "");
                expect.fail("Expected error to be thrown");
            } catch (err) {
                expect(err).to.be.an.instanceOf(ParametersError);
            }
        });

        it("should throw an error if the 'text' parameter is not a string", async () => {
            try {
                await client.sendMessage(recipientPhoneNumber, 123 as any);
                expect.fail("Expected error to be thrown");
            } catch (err) {
                expect(err).to.be.an.instanceOf(ParametersError);
            }
        });

        it("should throw an error if the 'text' parameter is longer than 4096 characters", async () => {
            const longText = "a".repeat(4097);
            try {
                await client.sendMessage(recipientPhoneNumber, longText);
                expect.fail("Expected error to be thrown");
            } catch (err) {
                expect(err).to.be.an.instanceOf(ParametersError);
            }
        });

        it("should send a text message without any options", async () => {
            makeRequestStub.resolves({ messages: [{ id: "" }] });
            client.sendMessage(recipientPhoneNumber, "Hello, World!");
            expect(makeRequestStub.calledOnce).to.be.true;
            expect(makeRequestStub.firstCall.args[0]).to.deep.include({
                to: recipientPhoneNumber,
                type: "text",
                text: {
                    body: "Hello, World!",
                    preview_url: false,
                },
            });
        });
    });
});
