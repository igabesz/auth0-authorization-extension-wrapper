export interface ShortRole {
	_id?: string;
	name: string;
	description: string;
}

export interface Role {
	_id?: string;
	name: string;
	description: string;
	applicationType: string;
	applicationId: string;
	permissions: string[];
}

export interface RoleResponse {
	roles: Role[];
	total: number;
}

export interface ShortPermission {
	_id?: string;
	name: string;
	description: string;
}

export interface Permission {
	_id?: string;
	name: string;
	description: string;
	applicationType: string;
	applicationId: string;
}

export interface PermissionsResponse {
	permissions: Permission[];
	total: number;
}

// export interface Group {
// 	id: string;
// 	name: string;
// 	description: string;
// 	applicationType: string;
// }
