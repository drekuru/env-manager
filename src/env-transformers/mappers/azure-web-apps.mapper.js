const { parse } = require('dotenv');

function fromENVtoAzure(vars) {
    const jsonVars = parse(vars);

    const azureEnvVars = Object.keys(jsonVars).reduce((acc, key) => {
        if (jsonVars[key])
            acc.push({
                name: key,
                value: jsonVars[key],
                slotSetting: true
            });

        return acc;
    }, []);

    return {
        transformedData: JSON.stringify(azureEnvVars),
        extension: 'json'
    };
}

function fromAzureToENV(vars) {
    const envVars = vars.reduce((acc, { name, value }) => {
        acc[name] = value;

        return acc;
    }, {});

    return {
        transformedData: envVars,
        extension: 'env'
    };
}

module.exports = {
    fromENVtoAzure,
    fromAzureToENV
};
