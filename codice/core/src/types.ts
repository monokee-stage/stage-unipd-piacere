import { DevicesRoute } from "./routes/devices/devices.route"
import { RequestsRoute } from "./routes/requests/requests.route"
import { ConfirmationRoute } from "./routes/confirmations/confirmation.route"

const coreTYPES: { [key: string]: symbol } = {
    MetadataRoute: Symbol.for('MetadataRoute'),
    DevicesRoute: Symbol.for('DevicesRoute'),
    RequestsRoute: Symbol.for('RequestsRoute'),
    ConfirmationRoute: Symbol.for('ConfirmationRoute'),
    
    GeoConverter: Symbol.for('GeoConverter')
  }
  
  export { coreTYPES }
  