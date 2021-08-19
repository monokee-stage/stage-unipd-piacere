
const coreTYPES: { [key: string]: symbol } = {
    MetadataRoute: Symbol.for('MetadataRoute'),
    DevicesRoute: Symbol.for('DevicesRoute'),
    RequestsRoute: Symbol.for('RequestsRoute'),
    ConfirmationRoute: Symbol.for('ConfirmationRoute'),
    GeoConverter: Symbol.for('GeoConverter'),
    Decryptor: Symbol.for('Decryptor')
  }
  
  export { coreTYPES }
  