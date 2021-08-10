export class Metadata {
	_id!: string
	metadata_url!: string
	core!: {
		client_id: string
		client_secret: string
	}
	app_mobile!: {
		client_id: string
	}
	introspection_endpoint!: string
}