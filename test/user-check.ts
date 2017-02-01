import { assert } from 'chai';
import { Role, ShortRole } from '../lib';
import { wrapper, settings } from './init';


describe('User', () => {
	const roleName = 'Test-role-for-users';
	let role: Role;
	let userId: string;
	let userRoleLength: number;

	before('Must be authenticated', () => {
		assert.ok(wrapper.isAuthenticated);
		userId = settings.auth0TestUserId;
	});

	it('creates a role', async () => {
		role = await wrapper.createRole({
			name: roleName,
			description: roleName,
			applicationType: 'client',
			applicationId: settings.auth0ClientId,
			permissions: [],
		});
	});

	it('should query the roles of the user', async () => {
		let roles = await wrapper.getUserRoles(userId);
		assert.isArray(roles);
		userRoleLength = roles.length;
	});

	it('can add role', async () => {
		await wrapper.addRoleForUser(userId, role._id);
		let roles = await wrapper.getUserRoles(userId);
		assert.equal(roles.length, userRoleLength + 1);
		let found = false;
		for (let r of roles) {
			if (r.name === roleName) {
				found = true;
				break;
			}
		}
		assert.ok(found);
	});

	it('can remove added role', async () => {
		await wrapper.removeRoleFromUser(userId, role._id);
		let roles = await wrapper.getUserRoles(userId);
		assert.equal(roles.length, userRoleLength);
	});

	it('destroys the created role', async () => {
		await wrapper.deleteRole(role._id);
	});
});
