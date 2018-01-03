import { assert } from 'chai';
import { Group, Role } from '../lib';
import { wrapper, settings } from './init';


describe('User', () => {
	const roleName = 'Test-role-for-users';
	const groupName = 'Test-group-for-users';
	let role: Role;
	let group: Group;
	let userId: string;
	let userRoleLength: number;
	let userGroupLength: number;

	before('Must be authenticated', () => {
		assert.ok(wrapper.isAuthenticated);
		userId = settings.auth0TestUserId;
	});

	// User roles
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

	// User groups
	it('creates a group', async () => {
		group = await wrapper.createGroup({
			name: groupName,
			description: groupName,
		});
	});

	it('should query the groups of the user', async () => {
		let groups = await wrapper.getUserGroups(userId);
		assert.isArray(groups);
		userGroupLength = groups.length;
	});

	it('can add group', async () => {
		await wrapper.addGroupForUser(userId, group._id);
		let groups = await wrapper.getUserGroups(userId);
		assert.equal(groups.length, userGroupLength + 1);
		let found = false;
		for (let r of groups) {
			if (r.name === groupName) {
				found = true;
				break;
			}
		}
		assert.ok(found);
	});

	it('can remove added group', async () => {
		await wrapper.removeGroupFromUser(userId, group._id);
		let groups = await wrapper.getUserGroups(userId);
		assert.equal(groups.length, userGroupLength);
	});

	it('destroys the created group', async () => {
		await wrapper.deleteGroup(group._id);
	});
});
