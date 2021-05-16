import winston from 'winston'

const { format } = winston

const logger = winston.createLogger({
  // level: 'debug',
  transports: [
    new winston.transports.File({
      filename: 'compose.log',
      level: 'debug',
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint()
      ),
      options: { flags: 'w' }
    }),
    new winston.transports.Console({
      level: 'info',
      format: format.combine(
        format.cli()
      )
    })
  ]
})

export default logger
