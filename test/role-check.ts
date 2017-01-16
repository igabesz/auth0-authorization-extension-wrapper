import { assert } from 'chai';
import { Permission, Role, ShortRole } from '../lib';
import { wrapper, settings } from './init';


function assertShortRoleWithId(role: ShortRole) {
	assert.isObject(role);
	assert.isString(role._id, '_id');
	assert.isString(role.name, 'name');
	assert.isString(role.description, 'description');
	assert.isUndefined((role as Role).applicationType, 'applicationType');
	assert.isUndefined((role as Role).applicationId, 'applicationId');
	assert.isUndefined((role as Role).permissions, 'permissions');
}

function assertRole(role: Role) {
	assert.isString(role.applicationType, 'applicationType');
	assert.isString(role.applicationId, 'applicationId');
	assert.isArray(role.permissions, 'permissions');
};

function assertRoleWithId(role: Role) {
	assertRole(role);
	assert.isString(role._id, '_id');
}


describe('Role', () => {
	let created: Role;
	let updated: Role;

	before('Must be authenticated', () => {
		assert.ok(wrapper.isAuthenticated);
	});

	it('should create a Role', async () => {
		let r1 = {
			name: 'RandomRole',
			description: 'E',
			applicationType: 'client',
			applicationId: settings.auth0ClientId,
			permissions: [],
		};
		created = await wrapper.createRole(r1);
		assertRoleWithId(created);
	});

	it('should update the Role', async () => {
		let newDescription = 'NEW DESCRIPTION';
		let newName = 'NEW NAME';
		created.description = newDescription;
		created.name = newName;
		updated = await wrapper.updateRole(created);
		assertRoleWithId(updated);
		assert.equal(updated.description, newDescription);
		assert.equal(updated.name, newName);
	});

	it('should access the created Role', async () => {
		let existing = await wrapper.getRole(created._id);
		assertShortRoleWithId(existing);
	});

	it('should list the Roles', async () => {
		let existingList = await wrapper.getRoles();
		assert.isArray(existingList);
		assert.ok(existingList.length >= 1);
		let found = false;
		for (let role of existingList) {
			assertRole(role);
			if (role._id === created._id) found = true;
		}
		assert.ok(found);
	});

	it('should delete the created Role', async () => {
		await wrapper.deleteRole(created._id);
	});

});
