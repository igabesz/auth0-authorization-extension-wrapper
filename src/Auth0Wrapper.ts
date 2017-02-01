import * as request from 'request-promise';


import {
	Permission,
	ShortPermission,
	PermissionsResponse,
	Role,
	ShortRole,
	RoleResponse,
} from './Auth0Types';


export interface Auth0WrapperSettings {
	auth0ClientId: string;
	auth0ClientSecret: string;
	auth0Url: string;
	auth0AuthExtensionUrl: string;
}

export class Auth0Wrapper {
	private token: string;
	private apiUrl: string;

	get isAuthenticated() { return !!this.token; }
	getToken() { return this.token; }

	private createOptions(body?: any): {
		headers: { [name: string]: string; };
		json: boolean;
		body?: any;
	} {
		return {
			headers: { 'Authorization': 'Bearer ' + this.token },
			json: true,
			body,
		};
	}

	async authenticate(settings: Auth0WrapperSettings): Promise<void> {
		this.apiUrl = settings.auth0AuthExtensionUrl;
		const credentials = {
			client_id: settings.auth0ClientId,
			client_secret: settings.auth0ClientSecret,
			audience: 'urn:auth0-authz-api',
			grant_type: 'client_credentials'
		};
		await (request as any).post({
			uri: settings.auth0Url + '/oauth/token',
			form: credentials,
			json: true,
		})
		.then(res => this.token = res.access_token);
	}

	// PRIVATE HELPERS

	private async get<T>(url: string): Promise<T> {
		// console.log('GET ' + url);
		let response = await request.get(this.apiUrl + url, this.createOptions());
		// console.log('RESPONSE', response);
		return response;
	}

	private async post<T>(url: string, body: any): Promise<T> {
		// console.log('POST ' + url, body);
		let options = this.createOptions(body);
		let response = await request.post(this.apiUrl + url, options);
		// console.log('RESPONSE', response);
		return response;
	}

	private async put<T>(url: string, body: any): Promise<T> {
		// console.log('PUT ' + url, body);
		let options = this.createOptions(body);
		let response = await request.put(this.apiUrl + url, options);
		// console.log('RESPONSE', response);
		return response;
	}

	private async delete<T>(url: string): Promise<T> {
		// console.log('DELETE ' + url);
		let response = await request.delete(this.apiUrl + url, this.createOptions());
		// console.log('RESPONSE', response);
		return response;
}

	// PERMISSIONS

	async getPermissions() {
		return (await this.get<PermissionsResponse>('/permissions')).permissions;
	}

	async getPermission(id: string) {
		return (await this.get<ShortPermission>('/permissions/' + id));
	}

	async createPermission(permission: Permission): Promise<Permission> {
		return this.post<Permission>('/permissions', {
			name: permission.name,
			description: permission.description,
			applicationType: permission.applicationType,
			applicationId: permission.applicationId,
		});
	}

	async updatePermission(permission: Permission): Promise<Permission> {
		return this.put<Permission>('/permissions/' + permission._id, {
			name: permission.name,
			description: permission.description,
			applicationType: permission.applicationType,
			applicationId: permission.applicationId,
		});
	}

	async deletePermission(permission: Permission): Promise<void>;
	async deletePermission(permissionId: string): Promise<void>;
	async deletePermission(permission: Permission | string) {
		if (typeof permission !== 'string') permission = permission._id;
		return this.delete<void>('/permissions/' + permission);
	}

	// ROLES

	async getRoles(): Promise<Role[]> {
		return (await this.get<RoleResponse>('/roles')).roles;
	}

	async getRole(id: string): Promise<ShortRole> {
		return (await this.get<Role>('/roles/' + id));
	}

	async createRole(role: Role): Promise<Role> {
		return (await this.post<Role>('/roles', {
			name: role.name,
			description: role.description,
			applicationType: role.applicationType,
			applicationId: role.applicationId,
			permissions: role.permissions,
		}));
	}

	async updateRole(role: Role): Promise<Role> {
		return (await this.put<Role>('/roles/' + role._id, {
			name: role.name,
			description: role.description,
			applicationType: role.applicationType,
			applicationId: role.applicationId,
			permissions: role.permissions,
		}));
	}

	async deleteRole(id: string) {
		return this.delete<void>('/roles/' + id);
	}

}
