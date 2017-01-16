import { assert } from 'chai';
import { Permission, ShortPermission } from '../lib';
import { wrapper, settings } from './init';


function assertShortPermissionWithId(perm: ShortPermission) {
	assert.isString(perm._id);
	assert.isObject(perm);
	assert.isString(perm.name, 'name');
	assert.isString(perm.description, 'description');
	assert.isUndefined((perm as Permission).applicationType, 'applicationType');
	assert.isUndefined((perm as Permission).applicationId, 'applicationId');
}

function assertPermission(perm: Permission) {
	assert.isObject(perm);
	assert.isString(perm.name, 'name');
	assert.isString(perm.description, 'description');
	assert.isString(perm.applicationType, 'applicationType');
	assert.isString(perm.applicationId, 'applicationId');
};

function assertPermissionWithId(perm: Permission) {
	assertPermission(perm);
	assert.isString(perm._id);
}


describe('Permission', () => {
	let created: Permission;
	let updated: Permission;

	before('Must be authenticated', () => {
		assert.ok(wrapper.isAuthenticated);
	});

	it('should create a Permission', async () => {
		let p1 = {
			name: 'RandomPermission',
			description: 'E',
			applicationType: 'client',
			applicationId: settings.auth0ClientId,
		};
		created = await wrapper.createPermission(p1);
		assertPermissionWithId(created);
	});

	it('should update the permission', async () => {
		let newDescription = 'NEW DESCRIPTION';
		let newName = 'NEW NAME';
		created.description = newDescription;
		created.name = newName;
		updated = await wrapper.updatePermission(created);
		assertPermissionWithId(updated);
		assert.equal(updated.description, newDescription);
		assert.equal(updated.name, newName);
	});

	it('should access the created permission', async () => {
		let existing = await wrapper.getPermission(created._id);
		assertShortPermissionWithId(existing);
	});

	it('should list the permissions', async () => {
		let existingList = await wrapper.getPermissions();
		assert.isArray(existingList);
		assert.ok(existingList.length >= 1);
		let found = false;
		for (let perm of existingList) {
			assertPermissionWithId(perm);
			if (perm._id === created._id) found = true;
		}
		assert.ok(found);
	});

	it('should delete the created permission', async () => {
		await wrapper.deletePermission(created._id);
	});

});
