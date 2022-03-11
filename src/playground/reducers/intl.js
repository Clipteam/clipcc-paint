import {updateIntl as superUpdateIntl} from 'react-intl-redux';
import {IntlProvider, intlReducer} from 'react-intl-redux';

import paintMessages from 'clipcc-l10n/dist/paint-msgs';


const intlInitialState = {
    intl: {
        defaultLocale: 'en',
        locale: 'en',
        messages: paintMessages.en.messages
    }
};

const updateIntl = locale => superUpdateIntl({
    locale: locale,
    messages: paintMessages[locale].messages || paintMessages.en.messages
});

export {
    intlReducer as default,
    IntlProvider,
    intlInitialState,
    updateIntl
};
