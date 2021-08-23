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
	web_app!: {
		client_id: string
	}
	external_software!: {
		client_id: string
	}
	introspection_endpoint!: string
}