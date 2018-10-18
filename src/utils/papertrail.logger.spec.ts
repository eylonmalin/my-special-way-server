import { MSWLogger } from './papertrail.logger';

describe('paper trail logger', () => {

    xit('Logger should use papertrail in production', async () => {
        const paperTrailLogger = new MSWLogger(true);
        expect(paperTrailLogger.getTransportList().length).toEqual(2);
    });

    xit('Logger should use not papertrail in non-production envs', async () => {
        const paperTrailLogger = new MSWLogger(false);
        expect(paperTrailLogger.getTransportList().length).toEqual(1);
    });

});
