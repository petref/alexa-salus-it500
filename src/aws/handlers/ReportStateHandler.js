const Handler = require('./Handler');

class ReportStateHandler extends Handler {
    static handles(event) {
        return Handler.namespaceFor(event) === 'Alexa' &&
            event.directive.header.name === 'ReportState';
    }

    async handle(event) {
        try {
            let profile = await this.retrieveProfile(event);
            const service = this.createControlService(profile);
            const status = await service.status();
            return this.responseFor(event)
                .with.targetSetpoint(status.targetTemperature)
                .and.currentTemperature(status.currentTemperature)
                .as.stateReport().response();
        } catch (e) {
            return this.responseFor(event).as.error(e).response();
        }
    }
}

module.exports = ReportStateHandler;