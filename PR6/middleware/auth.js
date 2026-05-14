function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ success: false, error: 'Необхідна автентифікація' });
}

function hasRole(...roles) {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ success: false, error: 'Необхідна автентифікація' });
        }
        if (roles.includes(req.user.role)) {
            return next();
        }
        res.status(403).json({ success: false, error: 'Недостатньо прав доступу для вашої ролі' });
    };
}

module.exports = { isAuthenticated, hasRole };