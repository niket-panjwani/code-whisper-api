module.exports = (req, res, appName) => {
    res.setHeader('X-Intent', 'CreateReactApp');
    res.setHeader('X-Command', `npx create-react-app ${appName}`);
    res.write('Creating a new React app...');
    res.end();
};