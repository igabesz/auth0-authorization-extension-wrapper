import { assert } from 'chai';
import { Group } from '../lib';
import { wrapper, settings } from './init';


function assertGroup(group: Group) {
	assert.isObject(group);
	assert.isString(group.name, 'name');
	assert.isString(group.description, 'description');
}


function assertGroupWithId(group: Group) {
	assertGroup(group);
	assert.isString(group._id, '_id');
}

describe('Group', () => {
	let created: Group;
	let updated: Group;

	before('Must be authenticated', () => {
		assert.ok(wrapper.isAuthenticated);
	});

	it('should create a Group', async () => {
		let r1 = {
			name: 'RandomGroup',
			description: 'E',
			applicationType: 'client',
			applicationId: settings.auth0ClientId,
			permissions: [],
		};
		created = await wrapper.createGroup(r1);
		assertGroupWithId(created);
	});

	it('should update the Group', async () => {
		let newDescription = 'NEW DESCRIPTION';
		let newName = 'NEW NAME';
		created.description = newDescription;
		created.name = newName;
		updated = await wrapper.updateGroup(created);
		assertGroupWithId(updated);
		assert.equal(updated.description, newDescription);
		assert.equal(updated.name, newName);
	});

	it('should access the created Group', async () => {
		let existing = await wrapper.getGroup(created._id);
		assertGroupWithId(existing);
	});

	it('should list the Groups', async () => {
		let existingList = await wrapper.getGroups();
		assert.isArray(existingList);
		assert.ok(existingList.length >= 1);
		let found = false;
		for (let group of existingList) {
			assertGroup(group);
			if (group._id === created._id) found = true;
		}
		assert.ok(found);
	});

	it('should delete the created Group', async () => {
		await wrapper.deleteGroup(created._id);
	});

});
