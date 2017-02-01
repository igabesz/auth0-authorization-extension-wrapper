import * as mocha from 'mocha';
import { assert } from 'chai';
import { Auth0Wrapper } from '../lib';
import { ENV, loadConfig } from 'config-decorators';


export let wrapper: Auth0Wrapper;
export let settings: Auth0Settings;


export class Auth0Settings {
	@ENV('AUTH0_CLIENT_ID', true)
	auth0ClientId: string;

	@ENV('AUTH0_CLIENT_SECRET', true)
	auth0ClientSecret: string;

	@ENV('AUTH0_BASE_URL', true)
	auth0Url: string;

	@ENV('AUTH0_API_URL', true)
	auth0AuthExtensionUrl: string;

	@ENV('AUTH0_TEST_USER_ID', true)
	auth0TestUserId: string;
}


describe('Initialization', () => {
	it('should have the necessary ENV variables', () => {
		settings = loadConfig(Auth0Settings);
	});

	it('should create the wrapper', () => {
		wrapper = new Auth0Wrapper;
	});

	it('should authenticate', async () => {
		await wrapper.authenticate(settings);
	});
});
