module.exports = (req, res, appName) => {
    res.setHeader('X-Intent', 'CreateNextApp');
    res.setHeader('X-Command', `npx create-next-app ${appName}`);
    res.write('Creating a new Next.js app...');
    res.end();
};