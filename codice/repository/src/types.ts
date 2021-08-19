const TYPES: { [key: string]: symbol } = {
    MetadataRepository: Symbol.for('MetadataRepository'),
    DeviceRepository: Symbol.for('DevicesRepository'),
    TransactionRepository: Symbol.for('TransactionsRepository'),
    EventRepository: Symbol.for('EventsRepository'),
    NotificationRepository: Symbol.for('NotificationRepository')
  }
  
  export { TYPES }
  