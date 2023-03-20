'use strict';
let socket;

const getArgs = (args) => {
    let id = '';
    let data = {};

    if (args.length) {
        if (typeof args[0] === 'object') {
            data = args[0];
        } else if (typeof +args[0] === 'number') {
            id = args[0];
            data = args[1];
        }
    }

    return { id, data };
};

const scaffold = (url, structure) => {
    const api = {};
    const services = Object.keys(structure);
    const transport = url.split(':')[0];

    if (transport === 'ws') {
        socket = new WebSocket(url);
    }

    for (const serviceName of services) {
        api[serviceName] = {};
        const service = structure[serviceName];
        const methods = Object.keys(service);
        for (const methodName of methods) {
            api[serviceName][methodName] = (...args) => {
                return new Promise(async (resolve) => {
                    if (transport === 'http') {
                        const { id, data } = getArgs(args);
                        const res = await fetch(
                            `${url}${serviceName}/${methodName}/${id}`,
                            {
                                method: 'POST',
                                body: JSON.stringify(data),
                            }
                        );
                        const result = await res.json();
                        resolve(result);
                    }

                    if (transport === 'ws') {
                        const packet = {
                            name: serviceName,
                            method: methodName,
                            args,
                        };
                        socket.send(JSON.stringify(packet));
                        socket.onmessage = (event) => {
                            const data = JSON.parse(event.data);
                            resolve(data);
                        };
                    }
                });
            };
        }
    }
    return api;
};

const api = scaffold('http://127.0.0.1:8001/', {
    user: {
        create: ['record'],
        read: ['id'],
        update: ['id', 'record'],
        delete: ['id'],
        find: ['mask'],
    },
    country: {
        read: ['id'],
        delete: ['id'],
        find: ['mask'],
        update: ['id', 'record'],
    },
    city: {
        read: ['id'],
        create: ['record'],
        delete: ['id'],
        find: ['mask'],
        update: ['id', 'record'],
    },
});

// socket.addEventListener('open', async () => {
//     const data = await api.user.read(3);
//     console.dir({ data });
// });

document.addEventListener('DOMContentLoaded', async () => {
    const data = await api.city.read();
    console.dir({ data });
});
